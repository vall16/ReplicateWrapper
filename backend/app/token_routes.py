from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TokenPurchase, StatusResponse
from app.services import UserService
from app.security import get_current_user
import stripe

router = APIRouter(prefix="/api/tokens", tags=["Tokens"])

# ACQUISTA TOKEN
# Endpoint disabilitato: l'acquisto deve passare esclusivamente tramite Stripe Checkout
# (/api/create-checkout-session → pagamento → /api/tokens/checkout/confirm)
@router.post("/purchase", response_model=StatusResponse)
def purchase_tokens(
    purchase: TokenPurchase,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Acquisto token diretto — DISABILITATO per sicurezza.

    L'unico modo valido per acquistare token è il flusso Stripe Checkout:
    1. POST /api/create-checkout-session  → ottieni URL di pagamento
    2. Redirect utente a Stripe
    3. GET /api/tokens/checkout/confirm?session_id=... → accredita token
    """
    raise HTTPException(
        status_code=403,
        detail="L'acquisto diretto non è consentito. Usa Stripe Checkout: POST /api/create-checkout-session"
    )

# PACCHETTI TOKENPRECONFIGURATI
@router.get("/packages")
def get_packages():
    """Restituisce i pacchetti token disponibili"""
    packages = [
        {
            "id": 1,
            "name": "Starter",
            "tokens": 100,
            "price": 1.00,
            "description": "Perfect to get started"
        },
        {
            "id": 2,
            "name": "Growth",
            "tokens": 500,
            "price": 4.50,
            "description": "Best value for money",
            "badge": "👍 Recommended"
        },
        {
            "id": 3,
            "name": "Pro",
            "tokens": 1000,
            "price": 8.00,
            "description": "For professional users"
        },
        {
            "id": 4,
            "name": "Enterprise",
            "tokens": 5000,
            "price": 35.00,
            "description": "For large-scale operations",
            "badge": "⚡ Maximum discount"
        }
    ]
    return {
        "packages": packages,
        "message": "💰 Select the package that suits you best"
    }

# VERIFICA SALDO PRIMA DI FAR USARE L'API
@router.get("/check")
def check_tokens(user = Depends(get_current_user)):
    """Verifica se l'utente ha token sufficienti"""
    has_tokens = user.tokens > 0
    status = "✅ Puoi usare l'API" if has_tokens else "🚫 Token insufficienti"
    
    return {
        "user_id": user.id,
        "tokens": user.tokens,
        "has_tokens": has_tokens,
        "status": status
    }

# conferma checkout Stripe: recupera sessione e accredita i token all'utente
@router.get("/checkout/confirm")
def confirm_checkout(
    session_id: str,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Controlla lo stato della sessione Stripe e se pagata accredita i token"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Impossibile recuperare la sessione: {e}")

    if session.payment_status != 'paid':
        raise HTTPException(status_code=400, detail="Pagamento non completato")

    # Verifica che la sessione appartenga all'utente corrente
    session_user_email = session.metadata.get('user_email')
    if session_user_email and session_user_email != user.email:
        raise HTTPException(status_code=403, detail="Questa sessione non appartiene all'utente corrente")

    # estrai i token dalla metadata (aggiunti in create_checkout_session)
    tokens = int(session.metadata.get('tokens', 0))
    if tokens <= 0:
        raise HTTPException(status_code=400, detail="Informazioni pacchetto mancanti")

    # aggiorna l'utente
    user = UserService.purchase_tokens(db, user.id, tokens)

    return {
        "status": "success",
        "tokens_added": tokens,
        "new_balance": user.tokens
    }
