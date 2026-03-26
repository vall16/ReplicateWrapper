from http.client import HTTPException

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from fastapi.params import Depends
from pydantic import BaseModel
from app import replicate_wrapper
import stripe
import replicate
from app.auth_routes import router as auth_router
from app.token_routes import router as token_router
from app.auth_routes import get_current_user 
from app.database import get_db
from app.replicate_wrapper import ReplicateWrapper


load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("Stripe key:", os.getenv("STRIPE_SECRET_KEY"))

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
# @app.post("/api/generate-paid")
# def generate_image_paid(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
#     prompt = build_prompt(req.description, req.style)
#     output = replicate_wrapper.run_model(
#         "stability-ai/sdxl:latest",
#         input_params={
#             "prompt": prompt,
#             "negative_prompt": "blurry, distorted, ugly, unrealistic, cartoon",
#             "width": 1024,
#             "height": 768
#         },
#         user_id=user.id,
#         db=db
#     )
#     return {"prompt": prompt, "image_url": output[0]}
replicate_token = os.getenv("REPLICATE_API_TOKEN")
if not replicate_token:
    raise Exception("REPLICATE_API_TOKEN non trovato nel .env!")

# ✅ Crea un'istanza della classe
replicate_wrapper = ReplicateWrapper(api_token=replicate_token)
SDXL_VERSION ="7762fd07"

@app.post("/api/generate-paid")
async def generate_image_paid(req: ImageRequest, user=Depends(get_current_user), db=Depends(get_db)):
    prompt = build_prompt(req.description, req.style)
    
    output = await replicate_wrapper.run_model(
        "black-forest-labs/flux-2-pro",
        input_params={
            "prompt": prompt,
            "resolution": "1 MP",
            "aspect_ratio": "1:1",
            "input_images": [],
            "output_format": "webp",
            "output_quality": 80,
            "safety_tolerance": 2
        },
        user_id=user.id,
        db=db
    )

    # 🔥 DEBUG (tienilo finché non funziona)
    print("OUTPUT RAW:", output)

    # Estrazione URL dall'output
    image_url = None
    if isinstance(output, list) and len(output) > 0:
        first = output[0]
        if isinstance(first, str):
            image_url = first
        elif isinstance(first, dict):
            image_url = first.get("url") or first.get("uri")

    if not image_url:
        raise HTTPException(500, "Impossibile ottenere URL immagine")


    return image_url


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

