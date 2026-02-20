from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    tokens: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Models
class TokenPurchase(BaseModel):
    amount: float
    price: Optional[float] = None  # Prezzo calcolato automaticamente

class TokenTransaction(BaseModel):
    id: int
    user_id: int
    amount: float
    transaction_type: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

# Auth Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Status Response
class StatusResponse(BaseModel):
    message: str
    status: str
    data: Optional[dict] = None
