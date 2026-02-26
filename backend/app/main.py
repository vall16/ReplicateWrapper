from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import stripe
from app.auth_routes import router as auth_router
from app.token_routes import router as token_router

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("Stripe key:", os.getenv("STRIPE_SECRET_KEY"))

app = FastAPI(
    title="Repli API",
    description="Wrapper API per Replicate.ai con sistema token",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includi le rotte
app.include_router(auth_router)
app.include_router(token_router)

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

@app.post("/create-payment-intent")
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


# nuovo endpoint per generare una sessione di Checkout
@app.post("/create-checkout-session")
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
            success_url="http://localhost:4200/store?payment=success&session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:4200/store?payment=cancel",
            metadata={
                "package_id": pkg.get("id"),
                "tokens": tokens
            }
        )
        return {"id": session.id, "url": session.url}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

