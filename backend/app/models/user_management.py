from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    BETA = "beta"
    FREE_TRIAL = "free_trial"
    PAID = "paid"
    ADMIN = "admin"

class SubscriptionStatus(enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    PENDING = "pending"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    facebook_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    profile_picture = Column(String)
    
    # User Management
    role = Column(Enum(UserRole), default=UserRole.FREE_TRIAL)
    is_active = Column(Boolean, default=True)
    is_beta_user = Column(Boolean, default=False)
    beta_user_number = Column(Integer, nullable=True)  # 1-20 for first beta users
    
    # Trial Management
    trial_start_date = Column(DateTime, nullable=True)
    trial_end_date = Column(DateTime, nullable=True)
    trial_days_remaining = Column(Integer, default=14)
    
    # Subscription
    subscription_status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.PENDING)
    subscription_start_date = Column(DateTime, nullable=True)
    subscription_end_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    instagram_accounts = relationship("InstagramAccount", back_populates="user")
    usage_stats = relationship("UsageStats", back_populates="user")
    
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
        if self.role == UserRole.ADMIN:
            return True
        if self.role == UserRole.BETA:
            return True
        if self.role == UserRole.PAID and self.subscription_status == SubscriptionStatus.ACTIVE:
            return True
        if self.role == UserRole.FREE_TRIAL and not self.is_trial_expired():
            return True
        return False

class InstagramAccount(Base):
    __tablename__ = "instagram_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    instagram_id = Column(String, unique=True, index=True)
    username = Column(String)
    name = Column(String)
    profile_picture_url = Column(String)
    followers_count = Column(Integer, default=0)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_connected = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="instagram_accounts")

class UsageStats(Base):
    __tablename__ = "usage_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Monthly usage tracking
    month = Column(String)  # Format: "2024-01"
    messages_sent = Column(Integer, default=0)
    messages_received = Column(Integer, default=0)
    api_calls_made = Column(Integer, default=0)
    
    # Feature usage
    faq_responses_sent = Column(Integer, default=0)
    auto_replies_sent = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="usage_stats")

class AdminSettings(Base):
    __tablename__ = "admin_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(Text)
    description = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Default admin settings
DEFAULT_ADMIN_SETTINGS = [
    {
        "key": "beta_users_limit",
        "value": "20",
        "description": "Maximum number of beta users allowed"
    },
    {
        "key": "trial_days",
        "value": "14",
        "description": "Number of free trial days for new users"
    },
    {
        "key": "monthly_message_limit_trial",
        "value": "1000",
        "description": "Monthly message limit for trial users"
    },
    {
        "key": "monthly_message_limit_paid",
        "value": "10000",
        "description": "Monthly message limit for paid users"
    },
    {
        "key": "app_maintenance_mode",
        "value": "false",
        "description": "Enable maintenance mode"
    }
]
