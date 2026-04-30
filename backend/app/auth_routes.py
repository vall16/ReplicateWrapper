from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import get_db, User
from app.schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenPurchase,
    TokenTransaction,
    StatusResponse,
    GoogleLoginRequest,
)
from app.services import UserService
from app.security import decode_token, calculate_token_price
from typing import List, Optional
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import secrets

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Funzione per ottenere l'utente verificando il token
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
        "user": UserResponse.model_validate(user)
    }

# PROFILO UTENTE
@router.get("/profile", response_model=UserResponse)
def get_profile(user = Depends(get_current_user)):
    """Restituisce il profilo dell'utente corrente"""
    return UserResponse.model_validate(user)

# SALDO TOKEN
@router.get("/balance")
def get_balance(user = Depends(get_current_user)):
    """Restituisce il saldo token dell'utente"""
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
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Restituisce lo storico delle transazioni"""
    return UserService.get_transactions(db, user.id, limit)


@router.post("/google-login", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Login tramite Google OAuth (Gmail).

    Il frontend deve passare un ID token ottenuto da Google Identity Services.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth non configurato (manca GOOGLE_CLIENT_ID)",
        )

    try:
        idinfo = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            client_id,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Google non valido",
        )

    email = idinfo.get("email")
    name = idinfo.get("name") or ""

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Il token Google non contiene una email valida",
        )

    user = UserService.get_user_by_email(db, email)

    if not user:
        base_username = (email.split("@")[0] or "user").lower()
        username = base_username
        suffix = 1

        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}{suffix}"
            suffix += 1

        random_password = secrets.token_urlsafe(16)
        user = UserService.create_user(
            db,
            email=email,
            username=username,
            password=random_password,
        )

    access_token = UserService.create_auth_token(user)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
    }
