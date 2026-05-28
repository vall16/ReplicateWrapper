from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Literal

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    tokens: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Models
class TokenPurchase(BaseModel):
    amount: int = Field(..., gt=0)
    price: Optional[float] = None

class TokenTransaction(BaseModel):
    id: int
    user_id: int
    amount: int
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


class GoogleLoginRequest(BaseModel):
    id_token: str = Field(..., min_length=20)

# Status Response
class StatusResponse(BaseModel):
    message: str
    status: str
    data: Optional[dict] = None

# Video Models with STRICT validation
class VideoRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=1000)
    duration: Literal[5, 10, 30, 60] = Field(..., description="Duration in seconds")
    resolution: Literal["480p", "720p", "1080p"] = Field(..., description="Video resolution")
    model: Literal["kling-video", "seedance-2", "pika-1", "minimax-video"] = Field(..., description="Video model")
