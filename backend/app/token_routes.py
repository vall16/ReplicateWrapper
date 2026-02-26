from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TokenPurchase, StatusResponse, UserResponse
from app.services import UserService
from app.security import calculate_token_price, decode_token
from typing import Optional

router = APIRouter(prefix="/api/tokens", tags=["Tokens"])

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Non autorizzato")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Token invalido")
        
        user = UserService.get_user_by_email(db, payload["email"])
        if not user:
            raise HTTPException(status_code=401, detail="Utente non trovato")
        return user
    except:
        raise HTTPException(status_code=401, detail="Non autorizzato")

# ACQUISTA TOKEN
@router.post("/purchase", response_model=StatusResponse)
def purchase_tokens(
    purchase: TokenPurchase,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Acquista token"""
    
    try:
        # Calcola il prezzo
        price = calculate_token_price(purchase.amount)
        
        # Simula il pagamento (in produzione integrerai Stripe, PayPal, etc)
        # Per ora supponiamo che il pagamento avvenga sempre con successo
        
        user = UserService.purchase_tokens(db, user.id, purchase.amount)
        
        return {
            "message": f"💳 Hai acquistato {purchase.amount} token per €{price:.2f}",
            "status": "success",
            "data": {
                "tokens_purchased": purchase.amount,
                "price": price,
                "new_balance": user.tokens
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
            "description": "Perfetto per iniziare"
        },
        {
            "id": 2,
            "name": "Growth",
            "tokens": 500,
            "price": 4.50,
            "description": "Miglior rapporto prezzo/qualità",
            "badge": "👍 Consigliato"
        },
        {
            "id": 3,
            "name": "Pro",
            "tokens": 1000,
            "price": 8.00,
            "description": "Per gli utenti professionali"
        },
        {
            "id": 4,
            "name": "Enterprise",
            "tokens": 5000,
            "price": 35.00,
            "description": "Per le grandi operazioni",
            "badge": "⚡ Massimo sconto"
        }
    ]
    return {
        "packages": packages,
        "message": "💰 Seleziona il pacchetto che preferisci"
    }

# VERIFICA SALDO PRIMA DI FAR USARE L'API
@router.get("/check")
def check_tokens(authorization: str = None, db: Session = Depends(get_db)):
    """Verifica se l'utente ha token sufficienti"""
    user = get_current_user(authorization, db)
    
    has_tokens = user.tokens > 0
    status = "✅ Puoi usare l'API" if has_tokens else "🚫 Token insufficienti"
    
    return {
        "user_id": user.id,
        "tokens": user.tokens,
        "has_tokens": has_tokens,
        "status": status
    }
