# Centralized Facebook OAuth configuration for backend
from typing import List

class FacebookConfig:
    """Centralized Facebook OAuth configuration"""
    
    # Instagram Business OAuth - Direct Instagram approach like ManyChat
    INSTAGRAM_OAUTH_SCOPE = "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_manage_insights"

    # Instagram Business Required Permissions
    INSTAGRAM_REQUIRED_PERMISSIONS: List[str] = [
        "instagram_business_basic",
        "instagram_business_manage_messages",
        "instagram_business_manage_comments",
        "instagram_business_manage_insights"
    ]

    # Fallback Facebook OAuth (for users who prefer Facebook)
    OAUTH_SCOPE = "pages_messaging,instagram_basic,instagram_manage_messages"

    # Required Permissions List - Only essential permissions
    REQUIRED_PERMISSIONS: List[str] = [
        "pages_messaging",
        "instagram_basic",
        "instagram_manage_messages"
    ]
    
    # Permission Descriptions
    PERMISSION_DESCRIPTIONS = {
        "pages_messaging": "Send messages to your pages",
        "instagram_basic": "Access basic Instagram info",
        "instagram_manage_messages": "Manage Instagram messages",
        "pages_show_list": "Access your Facebook pages list",
        "business_management": "Manage business assets",
        "pages_manage_metadata": "Manage page metadata and Instagram Business account access",
        "pages_read_engagement": "Read page engagement data and Instagram Business account info"
    }
    
    # OAuth Parameters
    OAUTH_PARAMS = {
        "response_type": "code",
        "auth_type": "rerequest"
    }
    
    @classmethod
    def get_scope_list(cls) -> List[str]:
        """Get OAuth scope as a list"""
        return cls.OAUTH_SCOPE.split(",")
    
    @classmethod
    def get_missing_permissions(cls, granted_permissions: List[str]) -> List[str]:
        """Get list of missing required permissions"""
        return [p for p in cls.REQUIRED_PERMISSIONS if p not in granted_permissions]
    
    @classmethod
    def has_all_permissions(cls, granted_permissions: List[str]) -> bool:
        """Check if all required permissions are granted"""
        return len(cls.get_missing_permissions(granted_permissions)) == 0

# Global instance
facebook_config = FacebookConfig()
