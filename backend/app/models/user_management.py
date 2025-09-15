from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

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
        "key": "trial_days_normal",
        "value": "14",
        "description": "Number of free trial days for normal users"
    },
    {
        "key": "trial_days_beta",
        "value": "60",
        "description": "Number of free trial days for beta users (60 days)"
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
