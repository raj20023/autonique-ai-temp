from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PageBase(BaseModel):
    page_name: str
    instagram_username: Optional[str] = None

class PageCreate(PageBase):
    fb_page_id: str
    ig_business_id: Optional[str] = None
    page_access_token: str

class PageUpdate(BaseModel):
    page_name: Optional[str] = None
    instagram_username: Optional[str] = None
    page_access_token: Optional[str] = None
    webhook_subscribed: Optional[bool] = None
    is_active: Optional[bool] = None

class PageResponse(PageBase):
    id: int
    user_id: int
    fb_page_id: str
    ig_business_id: Optional[str] = None
    webhook_subscribed: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
