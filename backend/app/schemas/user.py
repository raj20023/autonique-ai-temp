from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    fb_user_id: str
    access_token: str
    token_expires_at: Optional[datetime] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    access_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None

class UserLogin(BaseModel):
    access_token: str

class UserResponse(UserBase):
    id: int
    fb_user_id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
