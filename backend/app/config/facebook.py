# Centralized Facebook OAuth configuration for backend
from typing import List

class FacebookConfig:
    """Centralized Facebook OAuth configuration"""
    
    # OAuth Permissions - Keep this in sync with frontend (business_management removed - using two-step approach)
    OAUTH_SCOPE = "pages_messaging,instagram_basic,instagram_manage_messages,pages_show_list,pages_manage_metadata"
    
    # Required Permissions List (business_management removed - using two-step approach)
    REQUIRED_PERMISSIONS: List[str] = [
        "pages_messaging",
        "instagram_basic",
        "instagram_manage_messages",
        "pages_show_list",
        "pages_manage_metadata"
    ]
    
    # Permission Descriptions
    PERMISSION_DESCRIPTIONS = {
        "pages_messaging": "Send messages to your pages",
        "instagram_basic": "Access basic Instagram info",
        "instagram_manage_messages": "Manage Instagram messages",
        "pages_show_list": "Access your Facebook pages list",
        "pages_manage_metadata": "Manage page metadata and Instagram Business account access"
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
