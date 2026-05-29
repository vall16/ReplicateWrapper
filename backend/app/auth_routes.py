from fastapi import APIRouter, Depends, HTTPException, status, Response
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
from app.security import get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from typing import List
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import secrets
from datetime import datetime, timedelta

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
def login(credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Authenticate a user and return a token in httpOnly cookie"""
    user = UserService.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = UserService.create_auth_token(user)
    # Set httpOnly cookie (secure=True in production)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=os.getenv("ENVIRONMENT", "development") == "production",
        samesite="strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

@router.get("/profile", response_model=UserResponse)
def get_profile(user = Depends(get_current_user)):
    return UserResponse.model_validate(user)

@router.get("/balance")
def get_balance(user = Depends(get_current_user)):
    return {
        "tokens": user.tokens,
        "user_id": user.id,
        "username": user.username,
        "message": f"🪙 You have {user.tokens} tokens available"
    }

@router.get("/transactions", response_model=List[TokenTransaction])
def get_transactions(
    limit: int = 50,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns the user's transaction history"""
    return UserService.get_transactions(db, user.id, limit)

# LOGOUT
@router.post("/logout")
def logout(response: Response):
    """Logout: clear httpOnly cookie"""
    response.delete_cookie(
        key="access_token",
        secure=os.getenv("ENVIRONMENT", "development") == "production",
        samesite="strict"
    )
    return {"message": "✅ Logged out successfully", "status": "success"}


@router.post("/google-login", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, response: Response, db: Session = Depends(get_db)):
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
    # Set httpOnly cookie (secure=True in production)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=os.getenv("ENVIRONMENT", "development") == "production",
        samesite="strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
    }
