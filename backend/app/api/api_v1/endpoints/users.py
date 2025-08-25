from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.message import Message
from app.models.faq import FAQ
from app.models.page import Page
from app.schemas.user import UserResponse, UserUpdate
from app.core.security import encrypt_token
from pydantic import BaseModel

router = APIRouter()

class NotificationPreferences(BaseModel):
    email_notifications: bool = True
    message_alerts: bool = True
    system_updates: bool = True

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.get("/stats")
def get_user_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Dict:
    """Get user dashboard statistics"""

    # Get basic counts
    total_messages = db.query(Message).filter(Message.user_id == current_user.id).count()
    auto_replies_sent = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.auto_replied == True
    ).count()

    active_faqs = db.query(FAQ).filter(
        FAQ.user_id == current_user.id,
        FAQ.is_active == True
    ).count()

    connected_pages = db.query(Page).filter(
        Page.user_id == current_user.id,
        Page.ig_business_id.isnot(None)
    ).count()

    # Calculate average response time (assuming instant for auto-replies)
    avg_response_time = "< 1s"  # Auto-replies are nearly instant

    # Get recent activity (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_messages = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.created_at >= week_ago
    ).count()

    recent_auto_replies = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.created_at >= week_ago,
        Message.auto_replied == True
    ).count()

    # Calculate growth percentages (comparing to previous week)
    prev_week_start = week_ago - timedelta(days=7)
    prev_week_messages = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.created_at >= prev_week_start,
        Message.created_at < week_ago
    ).count()

    prev_week_auto_replies = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.created_at >= prev_week_start,
        Message.created_at < week_ago,
        Message.auto_replied == True
    ).count()

    # Calculate percentage changes
    def calculate_change(current: int, previous: int) -> int:
        if previous == 0:
            return 100 if current > 0 else 0
        return int(((current - previous) / previous) * 100)

    message_change = calculate_change(recent_messages, prev_week_messages)
    auto_reply_change = calculate_change(recent_auto_replies, prev_week_auto_replies)

    return {
        "total_messages": total_messages,
        "auto_replies_sent": auto_replies_sent,
        "active_faqs": active_faqs,
        "connected_pages": connected_pages,
        "avg_response_time": avg_response_time,
        "recent_activity": {
            "messages_this_week": recent_messages,
            "auto_replies_this_week": recent_auto_replies,
            "message_change_percent": message_change,
            "auto_reply_change_percent": auto_reply_change
        }
    }

@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me")
def delete_current_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete current user account and all associated data"""

    # Delete all user's FAQs
    db.query(FAQ).filter(FAQ.user_id == current_user.id).delete()

    # Delete all user's messages
    db.query(Message).filter(Message.user_id == current_user.id).delete()

    # Delete all user's pages
    db.query(Page).filter(Page.user_id == current_user.id).delete()

    # Delete the user
    db.delete(current_user)
    db.commit()

    return {"message": "User account and all associated data deleted successfully"}

@router.get("/notifications")
def get_notification_preferences(
    current_user: User = Depends(get_current_active_user)
):
    """Get user notification preferences"""
    # For now, return default preferences
    # In the future, you can store these in the database
    return {
        "email_notifications": True,
        "message_alerts": True,
        "system_updates": True
    }

@router.put("/notifications")
def update_notification_preferences(
    preferences: NotificationPreferences,
    current_user: User = Depends(get_current_active_user)
):
    """Update user notification preferences"""
    # For now, just return the updated preferences
    # In the future, you can store these in the database
    return preferences.dict()
