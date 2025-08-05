from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    user_id: Optional[int] = None
    fb_user_id: Optional[str] = None

class FacebookAuthResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user_id: str
    name: str
    email: Optional[str] = None
