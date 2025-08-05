from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fb_user_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    access_token = Column(Text, nullable=False)  # Encrypted Facebook access token
    token_expires_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    pages = relationship("Page", back_populates="user", cascade="all, delete-orphan")
    faqs = relationship("FAQ", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', fb_user_id='{self.fb_user_id}')>"
