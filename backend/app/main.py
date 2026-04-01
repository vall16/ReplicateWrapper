from http.client import HTTPException
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
from app.auth_routes import get_current_user
from app.database import get_db, GeneratedImage
from app.replicate_wrapper import ReplicateWrapper
from fastapi.responses import JSONResponse
from app.model_mapper import map_model



load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("Stripe key:", os.getenv("STRIPE_SECRET_KEY"))

# --- SETUP UPLOADS FOLDER ---
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# --- GESTIONE CORS DA ENV ---
# Leggiamo la stringa dal .env, se non esiste usiamo una lista vuota come fallback
cors_origins_raw = os.getenv("CORS_ORIGINS", "")
# Trasformiamo la stringa "dom1,dom2" in una lista ["dom1", "dom2"]
allowed_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app = FastAPI(
    title="Repli API",
    description="Wrapper API per Replicate.ai con sistema token",
    version="0.1.0"
)

# Mount uploads folder
app.mount("/images", StaticFiles(directory=UPLOADS_DIR), name="images")

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

# mapping stili (fondamentale per vendere)
STYLE_MAP = {
    "moderno": "modern italian apartment, minimal design, bright light",
    "lusso": "luxury italian apartment, marble, elegant, high-end furniture",
    "scandinavo": "scandinavian interior, wood, cozy, soft light"
}

class ImageRequest(BaseModel):
    description: str
    style: str = "moderno"
    model: str = "stability-ai/sdxl:latest"  # default



def build_prompt(description: str, style: str):
    base_style = STYLE_MAP.get(style, STYLE_MAP["moderno"])
    
    return f"""
    {description},
    {base_style},
    real estate photography, wide angle, ultra realistic, 4k
    """


@app.post("/generate")
def generate_image(req: ImageRequest):
    prompt = build_prompt(req.description, req.style)

    output = replicate.run(
        "stability-ai/sdxl:latest",
        input={
            "prompt": prompt,
            "negative_prompt": "blurry, distorted, ugly, unrealistic, cartoon",
            "width": 1024,
            "height": 768
        }
    )

    return {
        "prompt": prompt,
        "image_url": output[0]
    }

replicate_token = os.getenv("REPLICATE_API_TOKEN")
if not replicate_token:
    raise Exception("REPLICATE_API_TOKEN non trovato nel .env!")

# ✅ Crea un'istanza della classe
replicate_wrapper = ReplicateWrapper(api_token=replicate_token)
SDXL_VERSION ="7762fd07"

MODEL_MAP = {
    "sdxl": "stability-ai/sdxl:7762fd07",
    "flux-pro": "black-forest-labs/flux-2-pro",
    "flux-dev": "black-forest-labs/flux-2-dev",
    "flux-schnell": "black-forest-labs/flux-schnell"
}

async def download_and_save_image(image_url: str) -> str:
    """
    Scarica un'immagine da un URL e la salva su disco.

    Returns:
        Percorso relativo: /images/abc123.png
    """
    try:
        # Genera un nome univoco
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{unique_id}.png"
        filepath = UPLOADS_DIR / filename

        # Scarica l'immagine
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(image_url, timeout=30.0)
            response.raise_for_status()

        # Salva su disco
        with open(filepath, "wb") as f:
            f.write(response.content)

        return f"/images/{filename}"
    except Exception as e:
        print(f"Errore nel download dell'immagine: {e}")
        raise Exception(f"Errore nel salvataggio dell'immagine: {str(e)}")

# GENERAZIONE DELL’IMMAGINE
@app.post("/api/generate-paid")
async def generate_image_paid(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
    prompt = build_prompt(req.description, req.style)

    # fallback se model non passato
    model_to_use = req.model or "stability-ai/sdxl:latest"
    # seleziona modello completo
    model_version = MODEL_MAP.get(req.model, "stability-ai/sdxl:7762fd07")


    try:
        output = await replicate_wrapper.run_model(
            model_version,   # modello dinamico

            input_params={
                "prompt": prompt,
                "image_size": "1K",
                "aspect_ratio": "16:9",
                "output_format": "jpg",
                "safety_filter_level": "block_medium_and_above"


            },
            user_id=user.id,
            db=db
        )


        # 🔥 DEBUG (tienilo finché non funziona)
        print("OUTPUT RAW:", output)

        # Estrazione URL dall’output (potrebbe essere stringa o lista)
        if isinstance(output, list):
            image_url_remote = output[0]
        else:
            image_url_remote = output

        # Scarica e salva l’immagine su disco
        local_image_url = await download_and_save_image(image_url_remote)

        # Salva i metadata nel DB
        generated_image = GeneratedImage(
            user_id=user.id,
            prompt=req.description,
            model=req.model,
            style=req.style,
            image_url=local_image_url,
            tokens_used=1
        )
        db.add(generated_image)
        db.commit()
        db.refresh(generated_image)

        return {
            "image_url": local_image_url,
            "id": generated_image.id
        }


    except Exception as e:
        # cattura l’errore e ritornalo a frontend
        return JSONResponse(
            status_code=200,  # 200 così Angular riceve la risposta e può mostrare l’errore
            content={"error": str(e)}
        )


import random

FAKE_IMAGES = [
    "https://picsum.photos/1024/768?random=1",
    "https://picsum.photos/1024/768?random=2",
    "https://picsum.photos/1024/768?random=3",
    "https://picsum.photos/1024/768?random=4",
    "https://picsum.photos/1024/768?random=5",
]

@app.post("/api/generate-paid2")
async def generate_image_paid_fake(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
    prompt = build_prompt(req.description, req.style)

    try:
        # Scegli un'immagine fake random
        image_url_remote = random.choice(FAKE_IMAGES)
        print(f"[FAKE GENERATE] Remote URL scelto: {image_url_remote}")


        # Scarica e salva l’immagine su disc
        local_image_url = await download_and_save_image(image_url_remote)
        print(f"[FAKE GENERATE] Local URL salvato: {local_image_url}")


        # Salva i metadata nel DB
        generated_image = GeneratedImage(
            user_id=user.id,
            prompt=req.description,
            model=req.model,
            style=req.style,
            image_url=local_image_url,
            tokens_used=0  # 0 perché non ha consumato token reali
        )
        db.add(generated_image)
        db.commit()
        db.refresh(generated_image)

        return {
            "image_url": local_image_url,
            "id": generated_image.id,
            "fake": True
        }

    except Exception as e:
        return JSONResponse(
            status_code=200,
            content={"error": str(e)}
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
    """Ritorna la lista di modelli disponibili"""
    return {
        "models": [
            {"id": "flux-pro", "name": "FLUX.1 Pro", "description": "Modello ad alta qualità"},
            {"id": "flux-dev", "name": "FLUX.1 Dev", "description": "Modello veloce e versatile"},
            {"id": "sdxl", "name": "SDXL", "description": "Modello stabile e affidabile"},
            {"id": "flux-schnell", "name": "FLUX Schnell", "description": "Generazione ultrarapida"}
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


# Endpoint Stripe Payment Intent
from fastapi import Request
from fastapi.responses import JSONResponse

@app.get("/stripe-publishable-key")
def get_publishable_key():
    # Leggi la chiave dal .env
    stripe_key = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    if not stripe_key:
        return {"detail": "Chiave non configurata"}
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
async def create_checkout_session(request: Request):
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
            # success_url="http://localhost:4200/store?payment=success&session_id={CHECKOUT_SESSION_ID}",
            # cancel_url="http://localhost:4200/store?payment=cancel",
            success_url=f"{FRONTEND_URL}/store?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/store?payment=cancel",
            metadata={
                "package_id": pkg.get("id"),
                "tokens": tokens
            }
        )
        return {"id": session.id, "url": session.url}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

