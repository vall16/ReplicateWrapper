from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, User
from app.schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenTransaction,
    StatusResponse,
    GoogleLoginRequest,
)
from app.services import UserService
from app.security import get_current_user
from typing import List
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import secrets

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# REGISTRATION
@router.post("/register", response_model=StatusResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        user = UserService.create_user(
            db, 
            email=user_data.email,
            username=user_data.username,
            password=user_data.password
        )
        return {
            "message": "✅ User registered successfully!",
            "status": "success",
            "data": {"user_id": user.id, "email": user.email}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# LOGIN
@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return a token"""
    user = UserService.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = UserService.create_auth_token(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

# USER PROFILE
@router.get("/profile", response_model=UserResponse)
def get_profile(user = Depends(get_current_user)):
    """Returns the current user's profile"""
    return UserResponse.model_validate(user)

# TOKEN BALANCE
@router.get("/balance")
def get_balance(user = Depends(get_current_user)):
    """Returns the user's token balance"""
    return {
        "tokens": user.tokens,
        "user_id": user.id,
        "username": user.username,
        "message": f"🪙 You have {user.tokens} tokens available"
    }

# TRANSACTION HISTORY
@router.get("/transactions", response_model=List[TokenTransaction])
def get_transactions(
    limit: int = 50,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns the user's transaction history"""
    return UserService.get_transactions(db, user.id, limit)


@router.post("/google-login", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Login via Google OAuth (Gmail).

    The frontend must pass an ID token obtained from Google Identity Services.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured (missing GOOGLE_CLIENT_ID)",
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
            detail="Invalid Google token",
        )

    email = idinfo.get("email")
    name = idinfo.get("name") or ""

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The Google token does not contain a valid email",
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
