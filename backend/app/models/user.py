from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fb_user_id = Column(String, unique=True, index=True, nullable=True)  # Made nullable for Instagram-only users
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    access_token = Column(Text, nullable=True)  # Made nullable for Instagram-only users
    token_expires_at = Column(DateTime, nullable=True)

    # Instagram fields for direct Instagram authentication
    instagram_user_id = Column(String, unique=True, index=True, nullable=True)
    instagram_username = Column(String, unique=True, index=True, nullable=True)
    instagram_access_token = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # User Management fields (added by migration)
    role = Column(String, default="normal")  # admin, beta, normal, paid
    is_beta_user = Column(Boolean, default=False)
    beta_user_number = Column(Integer, nullable=True)
    trial_start_date = Column(DateTime, nullable=True)
    trial_end_date = Column(DateTime, nullable=True)
    trial_days_remaining = Column(Integer, default=14)
    subscription_status = Column(String, default="pending")  # Using String instead of Enum
    subscription_start_date = Column(DateTime, nullable=True)
    subscription_end_date = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)
    profile_picture = Column(String, nullable=True)

    # Relationships
    pages = relationship("Page", back_populates="user", cascade="all, delete-orphan")
    faqs = relationship("FAQ", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")

    def is_trial_expired(self):
        """Check if trial period has expired"""
        if not self.trial_end_date:
            return False
        return datetime.utcnow() > self.trial_end_date

    def days_remaining_in_trial(self):
        """Get remaining days in trial"""
        if not self.trial_end_date:
            return 0
        remaining = self.trial_end_date - datetime.utcnow()
        return max(0, remaining.days)

    def can_access_features(self):
        """Check if user can access premium features"""
        if self.role == "admin":
            return True
        if self.role == "beta" and not self.is_trial_expired():
            return True
        if self.role == "paid" and self.subscription_status == "active":
            return True
        if self.role in ["normal", "free_trial"] and not self.is_trial_expired():
            return True
        return False

    def has_limited_access(self):
        """Check if user has limited access (expired trial but can still use some features)"""
        return self.role in ["normal", "free_trial"] and self.is_trial_expired()

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', fb_user_id='{self.fb_user_id}')>"
