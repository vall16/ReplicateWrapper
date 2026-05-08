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
    """Direct token purchase — DISABLED for security.

    The only valid way to purchase tokens is the Stripe Checkout flow:
    1. POST /api/create-checkout-session  → get payment URL
    2. Redirect user to Stripe
    3. GET /api/tokens/checkout/confirm?session_id=... → credit tokens
    """
    raise HTTPException(
        status_code=403,
        detail="Direct purchase is not allowed. Use Stripe Checkout: POST /api/create-checkout-session"
    )

# PRE-CONFIGURED TOKEN PACKAGES
@router.get("/packages")
def get_packages():
    """Returns the available token packages"""
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

# CHECK BALANCE BEFORE USING THE API
@router.get("/check")
def check_tokens(user = Depends(get_current_user)):
    """Checks if the user has sufficient tokens"""
    has_tokens = user.tokens > 0
    status = "✅ You can use the API" if has_tokens else "🚫 Insufficient tokens"
    
    return {
        "user_id": user.id,
        "tokens": user.tokens,
        "has_tokens": has_tokens,
        "status": status
    }

# confirm Stripe checkout: retrieve session and credit tokens to user
@router.get("/checkout/confirm")
def confirm_checkout(
    session_id: str,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Checks the Stripe session status and credits tokens if paid"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to retrieve session: {e}")

    if session.payment_status != 'paid':
        raise HTTPException(status_code=400, detail="Payment not completed")

    # Check that the session belongs to the current user
    session_user_email = session.metadata.get('user_email')
    if session_user_email and session_user_email != user.email:
        raise HTTPException(status_code=403, detail="This session does not belong to the current user")

    # extract tokens from metadata (added in create_checkout_session)
    tokens = int(session.metadata.get('tokens', 0))
    if tokens <= 0:
        raise HTTPException(status_code=400, detail="Missing package information")

    # update the user
    user = UserService.purchase_tokens(db, user.id, tokens)

    return {
        "status": "success",
        "tokens_added": tokens,
        "new_balance": user.tokens
    }
