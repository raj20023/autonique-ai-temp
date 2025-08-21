from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    matched_faq_id = Column(Integer, ForeignKey("faqs.id"), nullable=True)
    ig_user_id = Column(String, nullable=False)  # Instagram user who sent the message
    ig_message_id = Column(String, unique=True, index=True, nullable=False)
    message_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=True)
    similarity_score = Column(Float, nullable=True)  # Similarity score with matched FAQ
    auto_replied = Column(Boolean, default=False)
    reply_sent_at = Column(DateTime, nullable=True)
    is_incoming = Column(Boolean, default=True)  # True for incoming messages, False for outgoing (bot) messages
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="messages")
    matched_faq = relationship("FAQ", back_populates="messages")

    def __repr__(self):
        return f"<Message(id={self.id}, ig_user_id='{self.ig_user_id}', auto_replied={self.auto_replied})>"
