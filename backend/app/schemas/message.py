from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageBase(BaseModel):
    ig_user_id: str
    message_text: str

class MessageCreate(MessageBase):
    ig_message_id: str

class MessageResponse(MessageBase):
    id: int
    user_id: int
    matched_faq_id: Optional[int] = None
    ig_message_id: str
    response_text: Optional[str] = None
    similarity_score: Optional[float] = None
    auto_replied: bool
    reply_sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
