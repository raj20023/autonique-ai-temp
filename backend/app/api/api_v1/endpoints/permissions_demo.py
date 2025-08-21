from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.page import Page
from app.models.message import Message
from app.services.facebook_service import FacebookService
from app.core.security import decrypt_token

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/permissions-demo")
async def permissions_demo(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Demonstrate all requested permissions and their usage for Facebook App Review
    This endpoint shows exactly how each permission is used in the application
    """
    try:
        facebook_service = FacebookService()
        user_access_token = decrypt_token(current_user.access_token)
        
        # Get user's pages and Instagram accounts
        pages = db.query(Page).filter(Page.user_id == current_user.id).all()
        
        demo_data = {
            "app_purpose": "Instagram Auto-Reply Bot for Small Businesses",
            "requested_permissions": [
                {
                    "permission": "pages_messaging",
                    "purpose": "Send auto-reply messages through Facebook Pages to Instagram users",
                    "usage": "When a customer sends a message to Instagram, we use this to send automated responses"
                },
                {
                    "permission": "instagram_basic", 
                    "purpose": "Access Instagram Business account information (username, profile picture)",
                    "usage": "Display Instagram account details in dashboard and verify account connection"
                },
                {
                    "permission": "instagram_manage_messages",
                    "purpose": "Receive and send Instagram Direct Messages",
                    "usage": "Core functionality - receive customer messages and send automated replies"
                }
            ],
            "permission_usage_examples": [],
            "user_data": {
                "facebook_name": current_user.name,
                "connected_pages": len(pages),
                "instagram_accounts": len([p for p in pages if p.ig_business_id])
            }
        }
        
        # Demonstrate each permission usage
        for page in pages:
            if page.ig_business_id:
                try:
                    page_access_token = decrypt_token(page.page_access_token)
                    
                    # Demonstrate instagram_basic usage
                    ig_info = await facebook_service.get_instagram_account_info(
                        page.ig_business_id, page_access_token
                    )
                    
                    # Get recent messages to show messaging functionality
                    recent_messages = db.query(Message).filter(
                        Message.user_id == current_user.id
                    ).order_by(Message.created_at.desc()).limit(3).all()
                    
                    usage_example = {
                        "page_name": page.page_name,
                        "instagram_username": ig_info.get("username", "N/A"),
                        "instagram_name": ig_info.get("name", "N/A"),
                        "profile_picture": ig_info.get("profile_picture_url", ""),
                        "permissions_used": {
                            "instagram_basic": f"Retrieved Instagram account info: @{ig_info.get('username', 'N/A')}",
                            "pages_messaging": f"Connected to Facebook Page: {page.page_name}",
                            "instagram_manage_messages": f"Processed {len(recent_messages)} messages for auto-replies"
                        },
                        "recent_auto_replies": [
                            {
                                "customer_message": msg.message_text[:50] + "..." if len(msg.message_text) > 50 else msg.message_text,
                                "auto_reply": msg.response_text[:50] + "..." if msg.response_text and len(msg.response_text) > 50 else msg.response_text,
                                "replied": msg.auto_replied,
                                "timestamp": msg.created_at.isoformat()
                            }
                            for msg in recent_messages
                        ]
                    }
                    
                    demo_data["permission_usage_examples"].append(usage_example)
                    
                except Exception as e:
                    logger.error(f"Error demonstrating permissions for page {page.page_name}: {e}")
                    demo_data["permission_usage_examples"].append({
                        "page_name": page.page_name,
                        "error": "Could not demonstrate permissions - token may need refresh",
                        "note": "This is expected during development/testing phase"
                    })
        
        # Add summary for reviewers
        demo_data["reviewer_summary"] = {
            "total_permissions_requested": 3,
            "all_permissions_justified": True,
            "business_use_case": "Small businesses need automated Instagram customer service",
            "user_benefit": "24/7 automated responses to customer inquiries on Instagram",
            "data_usage": "Only processes messages to generate appropriate responses",
            "data_retention": "Messages stored only for improving auto-reply accuracy"
        }
        
        return demo_data
        
    except Exception as e:
        logger.error(f"Error in permissions demo: {e}")
        return {
            "error": str(e),
            "note": "This demo requires valid tokens. Please ensure user is properly authenticated."
        }
