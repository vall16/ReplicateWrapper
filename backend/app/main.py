from fastapi import HTTPException
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import uuid
import httpx
from pathlib import Path

from fastapi.params import Depends
from pydantic import BaseModel
from app import replicate_wrapper
import stripe
import replicate
from app.auth_routes import router as auth_router
from app.token_routes import router as token_router
from app.security import get_current_user
from app.database import get_db, GeneratedImage, GeneratedVideo
from app.replicate_wrapper import ReplicateWrapper
from app.schemas import VideoRequest
from fastapi.responses import JSONResponse
from app.model_mapper import map_model
from app.logger import logger, log_file_download
from unittest.mock import Mock

# Mock per simulare Replicate
class ReplicateMock:
    def __init__(self):
        self.jobs = []

    def create_job(self, input_data):
        # Simula un job che può avere successo o fallire
        import random
        job_id = len(self.jobs) + 1
        status = "failed" if random.random() < 0.2 else "completed"
        job = {"id": job_id, "status": status, "input": input_data}
        self.jobs.append(job)
        return job

    def get_job_status(self, job_id):
        # Restituisce lo stato di un job
        for job in self.jobs:
            if job["id"] == job_id:
                return job["status"]
        return "not_found"

# Istanza del mock
replicate_mock = ReplicateMock()

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
# print("Stripe key:", os.getenv("STRIPE_SECRET_KEY"))

# --- SETUP UPLOADS FOLDER --
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# Crea sottocartelle per immagini e video0
IMAGES_DIR = UPLOADS_DIR / "images"
IMAGES_DIR.mkdir(exist_ok=True)

VIDEOS_DIR = UPLOADS_DIR / "videos"
VIDEOS_DIR.mkdir(exist_ok=True)

# --- GESTIONE CORS DA ENV ---
# Read CORS origins from .env with safe fallback
cors_origins_raw = os.getenv("CORS_ORIGINS", "").strip()
environment = os.getenv("ENVIRONMENT", "development")

# Parse CORS origins
if cors_origins_raw:
    allowed_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]
else:
    # Safe fallback based on environment
    if environment == "production":
        # In production, require explicit CORS config
        logger.warning("⚠️  CORS_ORIGINS not configured in production! Requests from browser will be blocked.")
        allowed_origins = []
    else:
        # In development, allow localhost
        allowed_origins = [
            "http://localhost:4200",
            "http://localhost:3000",
            "http://127.0.0.1:4200",
            "http://127.0.0.1:3000"
        ]
        logger.info(f"✅ Using default development CORS origins: {allowed_origins}")

app = FastAPI(
    title="Repli API",
    description="Wrapper API per Replicate.ai con sistema token",
    version="0.1.0"
)

# Mount uploads folder
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")
app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     "http://gekohub.com:4200",
    #     "http://localhost:4200",
    # ],
    allow_origins=allowed_origins, # Usiamo la lista dinamica
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includi le rotte
app.include_router(auth_router)
app.include_router(token_router)

# style mapping
STYLE_MAP = {
    "moderno": "modern italian apartment, minimal design, bright light",
    "lusso": "luxury italian apartment, marble, elegant, high-end furniture",
    "scandinavo": "scandinavian interior, wood, cozy, soft light"
}

class ImageRequest(BaseModel):
    description: str
    style: str = "moderno"
    model: str = "stability-ai/sdxl:latest"  # default
    ratio: str = "16:9"


def _error_status(error_msg: str) -> int:
    if error_msg.startswith("❌ Insufficient tokens"):
        return 402
    if error_msg.startswith("User not found"):
        return 404
    if error_msg.startswith("Video model not supported") or error_msg.startswith("Duration not supported"):
        return 400
    return 500


def build_prompt(description: str, style: str, ratio: str = "16:9"):
    base_style = STYLE_MAP.get(style, STYLE_MAP["moderno"])
    ratio_description = {
        "1:1": "square composition",
        "16:9": "landscape composition",
        "3:2": "landscape composition",
        "2:3": "portrait composition",
        "3:4": "portrait composition",
        "4:3": "landscape composition",
        "21:9": "cinematic composition"
    }.get(ratio, "landscape composition")

    return f"""
    {description},
    {base_style},
    {ratio_description},
    real estate photography, wide angle, ultra realistic, 4k
    """


@app.post("/generate")
async def generate_image(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
    prompt = build_prompt(req.description, req.style, req.ratio)
    token_cost = IMAGE_MODEL_COSTS.get(req.model, 3)
    model_version = MODEL_MAP.get(req.model, "stability-ai/sdxl:7762fd07")

    allowed_ratios = ["1:1", "16:9", "3:2", "2:3", "3:4", "4:3", "21:9"]
    aspect_ratio = req.ratio if req.ratio in allowed_ratios else "16:9"

    try:
        async def _save_img(raw):
            url = raw[0] if isinstance(raw, list) else raw
            return await download_and_save_image(url)

        local_image_url = await replicate_wrapper.run_model(
            model_version,
            input_params={
                "prompt": prompt,
                "aspect_ratio": aspect_ratio,
                "safety_filter_level": "block_medium_and_above"
            },
            user_id=user.id,
            db=db,
            token_cost=token_cost,
            save_func=_save_img
        )

        generated_image = GeneratedImage(
            user_id=user.id,
            prompt=req.description,
            model=req.model,
            style=req.style,
            image_url=local_image_url,
            tokens_used=token_cost
        )
        db.add(generated_image)
        db.commit()
        db.refresh(generated_image)

        from app.services import UserService
        updated_user = UserService.get_user(db, user.id)

        return {
            "image_url": local_image_url,
            "id": generated_image.id,
            "tokens_used": token_cost,
            "tokens_remaining": updated_user.tokens
        }

    except Exception as e:
        error_msg = str(e)

        return JSONResponse(
            status_code=_error_status(error_msg),
            content={"error": error_msg}
        )


replicate_token = os.getenv("REPLICATE_API_TOKEN")
if not replicate_token:
    raise Exception("REPLICATE_API_TOKEN not found in .env!")

# ✅ Crea un'istanza della classe
replicate_wrapper = ReplicateWrapper(api_token=replicate_token)
SDXL_VERSION ="7762fd07"

MODEL_MAP = {
    # 🔵 STABLE DIFFUSION / SDXL
    "sdxl": "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",                # ok
    "stable-diffusion-3": "stability-ai/stable-diffusion-3",
    # 🔥 FLUX (alcuni endpoint non richiedono hash, ma meglio fissarli)
    "flux-pro": "black-forest-labs/flux-2-pro",
    "flux-dev": "black-forest-labs/flux-2-dev",
    "flux-schnell": "black-forest-labs/flux-schnell",
    # "stable-diffusion-1-5": "stability-ai/stable-diffusion:1.5",
    "gpt-image-1.5": "openai/gpt-image-1.5",  #ok
    "seedream-5-lite": "bytedance/seedream-5-lite",          # esempio
    # "seedream-4-5": "bytedance/seedream-4.5",          # esempio
    # "seedream-4-0": "bytedance/seedream-4.0",          # esempio
    "pollo-v1": "pollo/ai-v1",                            # placeholder
    "pollo-v2": "pollo/ai-v2",                            # placeholder
    # Imagen (reali)
    "imagen-4": "google/imagen-4",  #ok
    "imagen-4-fast": "google/imagen-4-fast",

    # qwen image (reali)
    "qwen-image": "qwen/qwen-image",             

    # Gemini image (reali)
    "gemini-image-pro": "gemini-3-pro-image",

    # marketing → mapping reale
    "nano-banana": "google/nano-banana",
    "nano-banana-pro": "google/nano-banana-pro", #ok
                   # placeholder
    "kling-alpha": "kling/alpha-model"                  # placeholder
}

# 🎬 MODELLI VIDEO (per generazione video)
VIDEO_MODEL_MAP = {
    "kling-video": "kwaivgi/kling-v3-video",              # modello video principale
    "seedance-2": "bytedance/seedance-2.0",             # alternativa video
    "pika-1": "pika-labs/pika-1.0",                      # alternativa pika
    "minimax-video": "minimax/video-01"                  # text-to-video
}

# 💰 COSTI TOKEN PER MODELLO (immagini)
IMAGE_MODEL_COSTS = {
    "flux-pro": 8,
    "flux-dev": 5,
    "flux-schnell": 2,
    "imagen-4": 7,
    "imagen-4-fast": 3,
    "nano-banana": 2,
    "nano-banana-pro": 5,
    "gpt-image-1.5": 7,
    "qwen-image": 3,
    "seedream-5-lite": 4,
    "sdxl": 3,
    "stable-diffusion-3": 5,
}

# 💰 COSTI TOKEN PER MODELLO (video)
VIDEO_MODEL_COSTS = {
    "kling-video": 20,
    "seedance-2": 25,
    "pika-1": 30,
    "minimax-video": 35,
}

# Security: Max file sizes and allowed MIME types
MAX_IMAGE_SIZE_MB = 10  # 10MB
MAX_VIDEO_SIZE_MB = 500  # 500MB
ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_MIMES = {"video/mp4", "video/quicktime", "video/x-msvideo"}

def validate_download_response(response: httpx.Response, file_type: str) -> None:
    """
    Validate downloaded file before saving
    
    Raises:
        Exception: If file is invalid, too large, or suspicious
    """
    # Check HTTP status
    response.raise_for_status()
    
    # Get Content-Type header
    content_type = response.headers.get("content-type", "").lower()
    
    # Parse MIME type (ignore charset parameter)
    mime_type = content_type.split(";")[0].strip()
    
    if file_type == "image":
        allowed_mimes = ALLOWED_IMAGE_MIMES
        max_size = MAX_IMAGE_SIZE_MB * 1024 * 1024
    else:
        allowed_mimes = ALLOWED_VIDEO_MIMES
        max_size = MAX_VIDEO_SIZE_MB * 1024 * 1024
    
    # Validate MIME type
    if mime_type and mime_type not in allowed_mimes:
        raise Exception(f"Invalid {file_type} format: {mime_type}. Allowed: {allowed_mimes}")
    
    # Check Content-Length header
    content_length = response.headers.get("content-length")
    if content_length:
        size_bytes = int(content_length)
        if size_bytes > max_size:
            raise Exception(f"{file_type.capitalize()} too large: {size_bytes / 1024 / 1024:.1f}MB (max: {max_size / 1024 / 1024:.1f}MB)")
    
    # Validate actual content size during download (safety check)
    if len(response.content) > max_size:
        raise Exception(f"{file_type.capitalize()} exceeded maximum size during download")

async def download_and_save_image(image_url: str) -> str:
    """
    Download and validate image before saving to disk.

    Returns:
        Relative path: /images/abc123.png
    """
    try:
        # Generate unique filename
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{unique_id}.png"
        filepath = IMAGES_DIR / filename

        # Download the image with timeout
        async with httpx.AsyncClient(follow_redirects=True, limits=httpx.Limits(max_redirects=5)) as client:
            response = await client.get(image_url, timeout=30.0)
            
        # Validate before saving
        validate_download_response(response, "image")

        # Save to disk
        with open(filepath, "wb") as f:
            f.write(response.content)

        log_file_download(user_id=None, url=image_url, status="SUCCESS")
        return f"/images/{filename}"
    except Exception as e:
        log_file_download(user_id=None, url=image_url, status="FAILED", error=str(e)[:100])
        raise Exception(f"Error saving image: {str(e)}")
async def download_and_save_video(video_url: str) -> str:
    """
    Download and validate video before saving to disk.

    Returns:
        Relative path: /videos/abc123.mp4
    """
    try:
        # Generate unique filename
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{unique_id}.mp4"
        filepath = VIDEOS_DIR / filename

        # Download the video with longer timeout (heavier file)
        async with httpx.AsyncClient(follow_redirects=True, limits=httpx.Limits(max_redirects=5)) as client:
            response = await client.get(video_url, timeout=120.0)
            
        # Validate before saving
        validate_download_response(response, "video")

        # Save to disk
        with open(filepath, "wb") as f:
            f.write(response.content)

        log_file_download(user_id=None, url=video_url, status="SUCCESS")
        return f"/videos/{filename}"
    except Exception as e:
        log_file_download(user_id=None, url=video_url, status="FAILED", error=str(e)[:100])
        raise Exception(f"Error saving video: {str(e)}")
# GENERAZIONE DELL’IMMAGINE
@app.post("/api/generate-paid")
async def generate_image_paid(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
    prompt = build_prompt(req.description, req.style, req.ratio)

    # fallback se model non passato
    model_to_use = req.model or "stability-ai/sdxl:latest"
    # seleziona modello completo
    model_version = MODEL_MAP.get(req.model, "stability-ai/sdxl:7762fd07")

    # Ottieni il costo token per questo modello
    token_cost = IMAGE_MODEL_COSTS.get(req.model, 3)

    # valida ratio input
    allowed_ratios = ["1:1", "16:9", "3:2", "2:3", "3:4", "4:3", "21:9"]
    aspect_ratio = req.ratio if req.ratio in allowed_ratios else "16:9"

    try:
        async def _save_img(raw):
            url = raw[0] if isinstance(raw, list) else raw
            return await download_and_save_image(url)

        local_image_url = await replicate_wrapper.run_model(
            model_version,

            input_params={
                "prompt": prompt,
                "aspect_ratio": aspect_ratio,
                "safety_filter_level": "block_medium_and_above"

            },
            user_id=user.id,
            db=db,
            token_cost=token_cost,
            save_func=_save_img
        )

        generated_image = GeneratedImage(
            user_id=user.id,
            prompt=req.description,
            model=req.model,
            style=req.style,
            image_url=local_image_url,
            tokens_used=token_cost
        )
        db.add(generated_image)
        db.commit()
        db.refresh(generated_image)

        from app.services import UserService
        updated_user = UserService.get_user(db, user.id)

        return {
            "image_url": local_image_url,
            "id": generated_image.id,
            "tokens_used": token_cost,
            "tokens_remaining": updated_user.tokens
        }


    except Exception as e:
        error_msg = str(e)

        return JSONResponse(
            status_code=_error_status(error_msg),
            content={"error": error_msg}
        )



import random

FAKE_IMAGES = [
    "https://picsum.photos/1024/768?random=1",
    "https://picsum.photos/1024/768?random=2",
    "https://picsum.photos/1024/768?random=3",
    "https://picsum.photos/1024/768?random=4",
    "https://picsum.photos/1024/768?random=5",
]

# @app.post("/api/generate-paid2")
# async def generate_image_paid_fake(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
#     prompt = build_prompt(req.description, req.style, req.ratio)

#     try:
#         # Scegli un'immagine fake random
#         image_url_remote = random.choice(FAKE_IMAGES)
#         print(f"[FAKE GENERATE] Remote URL scelto: {image_url_remote}")


#         # Scarica e salva l’immagine su disc
#         local_image_url = await download_and_save_image(image_url_remote)
#         print(f"[FAKE GENERATE] Local URL salvato: {local_image_url}")


#         # Salva i metadata nel DB
#         generated_image = GeneratedImage(
#             user_id=user.id,
#             prompt=req.description,
#             model=req.model,
#             style=req.style,
#             image_url=local_image_url,
#             tokens_used=0  # 0 because no real tokens were consumed
#         )
#         db.add(generated_image)
#         db.commit()
#         db.refresh(generated_image)

#         return {
#             "image_url": local_image_url,
#             "id": generated_image.id,
#             "fake": True
#         }

#     except Exception as e:
#         return JSONResponse(
#             status_code=200,
#             content={"error": str(e)}
#         )

# Helper per mappare resolution a aspect_ratio per video
def map_resolution_to_aspect_ratio(resolution: str) -> str:
    """Maps resolution to aspect ratio for Replicate.
    
    Returns:
        Aspect ratio string (e.g. "16:9", "9:16")
    """
    resolution_map = {
        "480p": "16:9",   # Paesaggio standard
        "720p": "16:9",   # Paesaggio HD
        "1080p": "16:9",  # Paesaggio Full HD
        "4k": "16:9"      # Paesaggio 4K
    }
    return resolution_map.get(resolution, "16:9")

# 🎬 GENERAZIONE DEL VIDEO
@app.post("/api/generate-video")
async def generate_video(req: VideoRequest, user=Depends(get_current_user), db=Depends(get_db)):
    """
    Endpoint per generare video AI.
    
    Parametri:
    - prompt: Descrizione del video da generare
    - duration: Durata in secondi (5, 10, 30, 60)
    - resolution: Risoluzione (480p, 720p)
    - model: Modello video (kling-video, runway-ml, pika-1)
    
    Ritorna:
    - video_url: URL locale del video generato
    - id: ID della generazione nel DB
    """
    
    try:
        model_version = VIDEO_MODEL_MAP[req.model]
        aspect_ratio = map_resolution_to_aspect_ratio(req.resolution)
        
        token_cost = VIDEO_MODEL_COSTS.get(req.model, 10)
        
        video_input_params = {
            "prompt": req.prompt,
            "duration": req.duration,
            "aspect_ratio": aspect_ratio,
        }
        
        if req.model == "kling-video":
            video_input_params["cfg_scale"] = 7.5
        
        async def _save_vid(raw):
            url = raw[0] if isinstance(raw, list) else raw
            return await download_and_save_video(url)

        local_video_url = await replicate_wrapper.run_model(
            model_version,
            input_params=video_input_params,
            user_id=user.id,
            db=db,
            token_cost=token_cost,
            save_func=_save_vid
        )
        
        generated_video = GeneratedVideo(
            user_id=user.id,
            prompt=req.prompt,
            model=req.model,
            resolution=req.resolution,
            duration=req.duration,
            video_url=local_video_url,
            tokens_used=token_cost
        )
        db.add(generated_video)
        db.commit()
        db.refresh(generated_video)
        
        from app.services import UserService
        updated_user = UserService.get_user(db, user.id)
        
        return {
            "video_url": local_video_url,
            "id": generated_video.id,
            "tokens_used": token_cost,
            "tokens_remaining": updated_user.tokens
        }
    
    except Exception as e:
        error_msg = str(e)
        print(f"Error generating video: {error_msg}")

        return JSONResponse(
            status_code=_error_status(error_msg),
            content={"error": error_msg}
        )


@app.get("/")
async def root():
    return {
        "message": "Benvenuto in Repli API",
        "version": "0.1.0",
        "status": "ready",
        "features": {
            "authentication": "✅",
            "token_system": "✅",
            "replicate_integration": "✅"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/models")
async def get_available_models():
    """Returns the list of available models"""
    return {
        "models": [
            {"id": "flux-pro", "name": "FLUX.1 Pro", "description": "High quality model"},
            {"id": "flux-dev", "name": "FLUX.1 Dev", "description": "Fast and versatile model"},
            {"id": "sdxl", "name": "SDXL", "description": "Stable and reliable model"},
            {"id": "flux-schnell", "name": "FLUX Schnell", "description": "Ultra-fast generation"}
        ]
    }


@app.get("/api/generated-images")
def get_generated_images(
    style: Optional[str] = None,
    model: Optional[str] = None,
    prompt: Optional[str] = None,
    limit: int = 50,
    user=Depends(get_current_user),
    db=Depends(get_db)
):
    query = db.query(GeneratedImage).filter(GeneratedImage.user_id == user.id)

    if style:
        query = query.filter(GeneratedImage.style.ilike(f"%{style}%"))
    if model:
        query = query.filter(GeneratedImage.model.ilike(f"%{model}%"))
    if prompt:
        query = query.filter(GeneratedImage.prompt.ilike(f"%{prompt}%"))

    limit = min(max(limit, 1), 200)
    results = query.order_by(GeneratedImage.created_at.desc()).limit(limit).all()

    items = [
        {
            "id": img.id,
            "prompt": img.prompt,
            "style": img.style,
            "model": img.model,
            "image_url": img.image_url,
            "tokens_used": img.tokens_used,
            "created_at": img.created_at.isoformat()
        }
        for img in results
    ]

    return {
        "total": len(items),
        "items": items
    }

@app.get("/api/generated-videos")
def get_generated_videos(
    model: Optional[str] = None,
    prompt: Optional[str] = None,
    limit: int = 50,
    user=Depends(get_current_user),
    db=Depends(get_db)
):
    query = db.query(GeneratedVideo).filter(GeneratedVideo.user_id == user.id)

    if model:
        query = query.filter(GeneratedVideo.model.ilike(f"%{model}%"))
    if prompt:
        query = query.filter(GeneratedVideo.prompt.ilike(f"%{prompt}%"))

    limit = min(max(limit, 1), 200)
    results = query.order_by(GeneratedVideo.created_at.desc()).limit(limit).all()

    items = [
        {
            "id": vid.id,
            "prompt": vid.prompt,
            "model": vid.model,
            "resolution": vid.resolution,
            "duration": vid.duration,
            "video_url": vid.video_url,
            "tokens_used": vid.tokens_used,
            "created_at": vid.created_at.isoformat(),
            "type": "video"
        }
        for vid in results
    ]

    return {
        "total": len(items),
        "items": items
    }

@app.get("/api/generated-media")
def get_generated_media(
    style: Optional[str] = None,
    model: Optional[str] = None,
    prompt: Optional[str] = None,
    limit: int = 50,
    user=Depends(get_current_user),
    db=Depends(get_db)
):
    # Recupera immagini
    images_query = db.query(GeneratedImage).filter(GeneratedImage.user_id == user.id)
    if style:
        images_query = images_query.filter(GeneratedImage.style.ilike(f"%{style}%"))
    if model:
        images_query = images_query.filter(GeneratedImage.model.ilike(f"%{model}%"))
    if prompt:
        images_query = images_query.filter(GeneratedImage.prompt.ilike(f"%{prompt}%"))

    images = images_query.order_by(GeneratedImage.created_at.desc()).limit(limit).all()

    # Recupera video
    videos_query = db.query(GeneratedVideo).filter(GeneratedVideo.user_id == user.id)
    if model:
        videos_query = videos_query.filter(GeneratedVideo.model.ilike(f"%{model}%"))
    if prompt:
        videos_query = videos_query.filter(GeneratedVideo.prompt.ilike(f"%{prompt}%"))

    videos = videos_query.order_by(GeneratedVideo.created_at.desc()).limit(limit).all()

    # Combina e ordina per data di creazione
    all_items = []

    # Aggiungi immagini
    for img in images:
        all_items.append({
            "id": img.id,
            "prompt": img.prompt,
            "style": img.style,
            "model": img.model,
            "media_url": img.image_url,
            "tokens_used": img.tokens_used,
            "created_at": img.created_at.isoformat(),
            "type": "image"
        })

    # Aggiungi video
    for vid in videos:
        all_items.append({
            "id": vid.id,
            "prompt": vid.prompt,
            "model": vid.model,
            "resolution": vid.resolution,
            "duration": vid.duration,
            "media_url": vid.video_url,
            "tokens_used": vid.tokens_used,
            "created_at": vid.created_at.isoformat(),
            "type": "video"
        })

    # Ordina per data decrescente e limita
    all_items.sort(key=lambda x: x["created_at"], reverse=True)
    all_items = all_items[:limit]

    return {
        "total": len(all_items),
        "items": all_items
    }


# Endpoint Stripe Payment Intent
from fastapi import Request
from fastapi.responses import JSONResponse

@app.get("/stripe-publishable-key")
def get_publishable_key():
    # Leggi la chiave dal .env
    stripe_key = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    if not stripe_key:
        return {"detail": "Key not configured"}
    return {"key": stripe_key}

@app.post("/api/create-payment-intent")
async def create_payment_intent(request: Request):
    body = await request.body()
    print("BODY RAW:", body)
    
    data = await request.json()
    amount = data.get("amount")
    currency = data.get("currency", "eur")
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency=currency,
            automatic_payment_methods={"enabled": True}
        )
        return JSONResponse({"clientSecret": intent.client_secret})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")

# nuovo endpoint per generare una sessione di Checkout
@app.post("/api/create-checkout-session")
async def create_checkout_session(request: Request, user=Depends(get_current_user)):
    data = await request.json()
    pkg = data.get("package") or {}
    # costruisci il nome/prodotto a partire dal pacchetto
    name = pkg.get("name", "Acquisto token")
    tokens = pkg.get("tokens", 0)
    price = pkg.get("price", 0)  # valore in euro
    amount = int(price * 100)

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": name, "metadata": {"tokens": tokens}},
                    "unit_amount": amount,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{FRONTEND_URL}/store?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/store?payment=cancel",
            metadata={
                "package_id": pkg.get("id"),
                "tokens": tokens,
                "user_email": user.email
            }
        )
        return {"id": session.id, "url": session.url}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request, db=Depends(get_db)):
    if not STRIPE_WEBHOOK_SECRET:
        print("[WEBHOOK] STRIPE_WEBHOOK_SECRET not configured")
        return JSONResponse({"error": "Webhook not configured"}, status_code=500)

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        return JSONResponse({"error": "Missing stripe-signature header"}, status_code=400)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return JSONResponse({"error": "Invalid payload"}, status_code=400)
    except stripe.error.SignatureVerificationError:
        return JSONResponse({"error": "Invalid signature"}, status_code=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_email = session.get("metadata", {}).get("user_email")
        tokens = int(session.get("metadata", {}).get("tokens", 0))

        if not user_email or tokens <= 0:
            print(f"[WEBHOOK] Missing metadata: email={user_email}, tokens={tokens}")
            return JSONResponse({"status": "ignored"}, status_code=200)

        from app.services import UserService

        user = UserService.get_user_by_email(db, user_email)
        if not user:
            print(f"[WEBHOOK] User not found: {user_email}")
            return JSONResponse({"status": "ignored"}, status_code=200)

        session_id = session.get("id", "")
        try:
            UserService.purchase_tokens(db, user.id, tokens, stripe_session_id=session_id)
            print(f"[WEBHOOK] Credited {tokens} tokens to {user_email} (user {user.id}, session {session_id})")
        except Exception as e:
            error_str = str(e)
            if "already processed" in error_str:
                print(f"[WEBHOOK] Session {session_id} already processed, skipping")
            else:
                print(f"[WEBHOOK] Error processing session {session_id}: {error_str}")
                db.rollback()
                return JSONResponse({"error": "Internal server error"}, status_code=500)

    return JSONResponse({"status": "ok"}, status_code=200)

