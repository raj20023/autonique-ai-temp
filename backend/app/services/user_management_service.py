from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
import logging

from app.models.user import User
from app.models.user_management import UsageStats, AdminSettings

logger = logging.getLogger(__name__)

class UserManagementService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_or_create_user(self, facebook_id: str, email: str, name: str, profile_picture: str = None) -> User:
        """Get existing user or initialize user management fields"""
        user = self.db.query(User).filter(User.fb_user_id == facebook_id).first()

        if not user:
            # User doesn't exist yet, just return None and let auth handle user creation
            logger.info(f"User not found for facebook_id: {facebook_id}, will be created by auth system")
            return None

        # Initialize user management fields if not set
        if user.role is None:
            # Determine user role
            beta_count = self.db.query(User).filter(User.is_beta_user == True).count()

            if beta_count < 20:
                # Make them a beta user with 1-year trial
                user.role = "beta"
                user.is_beta_user = True
                user.beta_user_number = beta_count + 1
                user.trial_start_date = datetime.utcnow()
                user.trial_end_date = datetime.utcnow() + timedelta(days=365)  # 1 year
                user.trial_days_remaining = 365
                logger.info(f"Set beta user #{user.beta_user_number}: {name} (1 year trial)")
            else:
                # Start normal user with 14-day trial
                user.role = "normal"
                user.trial_start_date = datetime.utcnow()
                user.trial_end_date = datetime.utcnow() + timedelta(days=14)
                user.trial_days_remaining = 14
                logger.info(f"Set normal user: {name} (14 days trial)")

        # Update last login and profile picture
        user.last_login = datetime.utcnow()
        if profile_picture:
            user.profile_picture = profile_picture

        self.db.commit()
        self.db.refresh(user)

        return user
    
    def check_user_access(self, user_id: int) -> dict:
        """Check if user has access to features and return status"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"has_access": False, "reason": "User not found"}
        
        if not user.is_active:
            return {"has_access": False, "reason": "Account deactivated"}
        
        # If user has no role set, initialize it
        if user.role is None:
            # Determine user role
            beta_count = self.db.query(User).filter(User.is_beta_user == True).count()

            if beta_count < 20:
                # Make them a beta user with 1-year trial
                user.role = "beta"
                user.is_beta_user = True
                user.beta_user_number = beta_count + 1
                user.trial_start_date = datetime.utcnow()
                user.trial_end_date = datetime.utcnow() + timedelta(days=365)  # 1 year
                user.trial_days_remaining = 365
                logger.info(f"Set beta user #{user.beta_user_number}: {user.name} (1 year trial)")
            else:
                # Start normal user with 14-day trial
                user.role = "normal"
                user.trial_start_date = datetime.utcnow()
                user.trial_end_date = datetime.utcnow() + timedelta(days=14)
                user.trial_days_remaining = 14
                logger.info(f"Set normal user: {user.name} (14 days trial)")

            self.db.commit()

        # Admin - unlimited access to everything
        if user.role == "admin":
            return {"has_access": True, "reason": "Admin access", "unlimited": True, "role": "admin"}

        # Beta user - 1 year free trial
        if user.role == "beta":
            if user.is_trial_expired():
                return {
                    "has_access": False,
                    "reason": "Beta trial expired",
                    "trial_expired": True,
                    "days_remaining": 0,
                    "role": "beta"
                }
            else:
                return {
                    "has_access": True,
                    "reason": "Beta user access",
                    "trial_active": True,
                    "days_remaining": user.days_remaining_in_trial(),
                    "unlimited": True,
                    "role": "beta"
                }

        # Paid user - full access
        if user.role == "paid" and user.subscription_status == "active":
            return {"has_access": True, "reason": "Paid subscription", "unlimited": False, "role": "paid"}

        # Normal user (previously free_trial)
        if user.role == "normal" or user.role == "free_trial":  # Support both old and new naming
            if user.is_trial_expired():
                return {
                    "has_access": False,
                    "reason": "Trial expired",
                    "trial_expired": True,
                    "days_remaining": 0,
                    "limited_access": True,  # They get limited functionality
                    "role": "normal"
                }
            else:
                return {
                    "has_access": True,
                    "reason": "Free trial",
                    "trial_active": True,
                    "days_remaining": user.days_remaining_in_trial(),
                    "role": "normal"
                }

        return {"has_access": False, "reason": "No valid subscription", "role": user.role or "unknown"}

    def get_limited_access_features(self, user_id: int) -> dict:
        """Get what features expired trial users can access"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"can_access": []}

        # Limited functionality for expired normal users
        if user.role in ["normal", "free_trial"] and user.is_trial_expired():
            return {
                "can_access": [
                    "view_dashboard",      # Can see dashboard but limited
                    "view_faqs",          # Can view existing FAQs but not create new ones
                    "view_messages",      # Can see message history but no auto-reply
                    "view_stats",         # Can see basic stats
                    "profile_settings"    # Can update profile
                ],
                "cannot_access": [
                    "create_faqs",        # Cannot create new FAQs
                    "auto_reply",         # No auto-reply functionality
                    "advanced_analytics", # No advanced features
                    "bulk_operations",    # No bulk operations
                    "api_access"          # No API access
                ],
                "limits": {
                    "max_faqs": 0,        # Cannot create new FAQs
                    "max_messages_per_day": 0,  # No auto-replies
                    "dashboard_access": "read_only"
                }
            }

        # Full access for active users
        return {
            "can_access": ["all"],
            "cannot_access": [],
            "limits": {}
        }

    def upgrade_to_paid(self, user_id: int) -> bool:
        """Upgrade user to paid subscription"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        user.role = "paid"
        user.subscription_status = "active"
        user.subscription_start_date = datetime.utcnow()
        # Set to 1 year from now (adjust as needed)
        user.subscription_end_date = datetime.utcnow() + timedelta(days=365)

        self.db.commit()
        logger.info(f"User {user.name} upgraded to paid subscription")
        return True
    
    def get_user_stats(self, user_id: int) -> dict:
        """Get user usage statistics"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return {}
        
        current_month = datetime.utcnow().strftime("%Y-%m")
        stats = self.db.query(UsageStats).filter(
            UsageStats.user_id == user_id,
            UsageStats.month == current_month
        ).first()
        
        if not stats:
            stats = UsageStats(user_id=user_id, month=current_month)
            self.db.add(stats)
            self.db.commit()
        
        return {
            "messages_sent": stats.messages_sent,
            "messages_received": stats.messages_received,
            "api_calls_made": stats.api_calls_made,
            "faq_responses_sent": stats.faq_responses_sent,
            "auto_replies_sent": stats.auto_replies_sent
        }
    
    def increment_usage(self, user_id: int, metric: str, count: int = 1):
        """Increment usage metric for user"""
        current_month = datetime.utcnow().strftime("%Y-%m")
        stats = self.db.query(UsageStats).filter(
            UsageStats.user_id == user_id,
            UsageStats.month == current_month
        ).first()
        
        if not stats:
            stats = UsageStats(user_id=user_id, month=current_month)
            self.db.add(stats)
        
        if hasattr(stats, metric):
            current_value = getattr(stats, metric)
            setattr(stats, metric, current_value + count)
            self.db.commit()
    
    def get_all_users_for_admin(self) -> List[dict]:
        """Get all users for admin panel"""
        users = self.db.query(User).all()
        
        result = []
        for user in users:
            access_info = self.check_user_access(user.id)
            stats = self.get_user_stats(user.id)
            
            result.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_beta_user": user.is_beta_user,
                "beta_user_number": user.beta_user_number,
                "subscription_status": user.subscription_status if user.subscription_status else None,
                "trial_days_remaining": user.days_remaining_in_trial() if user.role == "free_trial" else None,
                "created_at": user.created_at,
                "last_login": user.last_login,
                "has_access": access_info.get("has_access", False),
                "access_reason": access_info.get("reason", ""),
                "usage_stats": stats
            })
        
        return result
    
    def get_admin_settings(self) -> dict:
        """Get all admin settings"""
        settings = self.db.query(AdminSettings).all()
        return {setting.key: setting.value for setting in settings}
    
    def update_admin_setting(self, key: str, value: str) -> bool:
        """Update admin setting"""
        setting = self.db.query(AdminSettings).filter(AdminSettings.key == key).first()
        
        if setting:
            setting.value = value
            setting.updated_at = datetime.utcnow()
        else:
            setting = AdminSettings(key=key, value=value)
            self.db.add(setting)
        
        self.db.commit()
        return True
