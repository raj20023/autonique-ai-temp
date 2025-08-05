from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
from app.core.database import Base

class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    embedding_vector = Column(ARRAY(Float), nullable=True)  # OpenAI embedding vector
    similarity_threshold = Column(Float, default=0.8)  # Minimum similarity for match
    usage_count = Column(Integer, default=0)  # Track how often this FAQ is used
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="faqs")
    messages = relationship("Message", back_populates="matched_faq")

    def __repr__(self):
        return f"<FAQ(id={self.id}, question='{self.question[:50]}...', user_id={self.user_id})>"
