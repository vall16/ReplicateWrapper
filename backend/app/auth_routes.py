from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    UserRegister, UserLogin, UserResponse, TokenResponse, 
    TokenPurchase, TokenTransaction, StatusResponse
)
from app.services import UserService
from app.security import decode_token, calculate_token_price
from typing import List

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Funzione per ottenere l'utente verificando il token
def get_current_user(authorization: str = None, db: Session = Depends(get_db)):
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

# REGISTRAZIONE
@router.post("/register", response_model=StatusResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Registra un nuovo utente"""
    try:
        user = UserService.create_user(
            db, 
            email=user_data.email,
            username=user_data.username,
            password=user_data.password
        )
        return {
            "message": "✅ Utente registrato con successo!",
            "status": "success",
            "data": {"user_id": user.id, "email": user.email}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# LOGIN
@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Autentica un utente e restituisce un token"""
    user = UserService.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email o password non validi")
    
    access_token = UserService.create_auth_token(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

# PROFILO UTENTE
@router.get("/profile", response_model=UserResponse)
def get_profile(authorization: str = None, db: Session = Depends(get_db)):
    """Restituisce il profilo dell'utente corrente"""
    user = get_current_user(authorization, db)
    return UserResponse.from_orm(user)

# SALDO TOKEN
@router.get("/balance")
def get_balance(authorization: str = None, db: Session = Depends(get_db)):
    """Restituisce il saldo token dell'utente"""
    user = get_current_user(authorization, db)
    return {
        "tokens": user.tokens,
        "user_id": user.id,
        "username": user.username,
        "message": f"🪙 Hai {user.tokens} token disponibili"
    }

# STORICO TRANSAZIONI
@router.get("/transactions", response_model=List[TokenTransaction])
def get_transactions(
    limit: int = 50,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Restituisce lo storico delle transazioni"""
    user = get_current_user(authorization, db)
    return UserService.get_transactions(db, user.id, limit)
