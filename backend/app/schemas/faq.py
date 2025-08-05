from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FAQBase(BaseModel):
    question: str
    answer: str
    similarity_threshold: Optional[float] = 0.8
    is_active: Optional[bool] = True

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    similarity_threshold: Optional[float] = None
    is_active: Optional[bool] = None

class FAQBulkCreate(BaseModel):
    faqs: List[FAQCreate]

class FAQResponse(FAQBase):
    id: int
    user_id: int
    usage_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class FAQMatch(BaseModel):
    faq_id: int
    question: str
    answer: str
    similarity_score: float
