from fastapi import APIRouter, Depends, HTTPException, status, Query
import httpx
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token, encrypt_token
from app.models.user import User
from app.models.page import Page
from app.schemas.auth import Token, FacebookAuthResponse
from app.services.facebook_service import FacebookService
from app.config.facebook import facebook_config

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/login")
async def facebook_login(redirect_uri: str = Query(...)):
    """Redirect to Facebook OAuth login"""
    facebook_service = FacebookService()
    login_url = facebook_service.get_login_url(redirect_uri)
    return {"login_url": login_url}

@router.get("/callback")
async def facebook_callback(
    code: str = Query(...),
    redirect_uri: str = Query(...),
    db: Session = Depends(get_db)
):
    """Handle Facebook OAuth callback"""
    try:
        facebook_service = FacebookService()
        
        # Exchange code for access token
        token_data = await facebook_service.exchange_code_for_token(code, redirect_uri)
        short_lived_token = token_data["access_token"]

        # Exchange for long-lived token
        long_lived_data = await facebook_service.exchange_for_long_lived_token(short_lived_token)
        access_token = long_lived_data["access_token"]

        # Log token info for debugging
        expires_in = long_lived_data.get("expires_in", "No expiration info")
        logger.info(f"✅ Long-lived user token obtained - expires in: {expires_in} seconds")

        # Test token encryption immediately
        try:
            encrypted_test = encrypt_token(access_token)
            from app.core.security import decrypt_token
            decrypted_test = decrypt_token(encrypted_test)
            if access_token == decrypted_test:
                logger.info("✅ Token encryption/decryption test passed")
            else:
                logger.error("❌ Token encryption/decryption test failed")
                raise HTTPException(status_code=500, detail="Token encryption error")
        except Exception as e:
            logger.error(f"❌ Token encryption test failed: {e}")
            raise HTTPException(status_code=500, detail="Token encryption error")

        # Log permissions for debugging
        try:
            permissions = await facebook_service.get_user_permissions(access_token)
            logger.info(f"Granted permissions: {permissions}")
        except Exception as e:
            logger.warning(f"Could not fetch permissions: {e}")

        # Get user info
        user_info = await facebook_service.get_user_info(access_token)
        fb_user_id = user_info["id"]
        name = user_info["name"]
        email = user_info.get("email")
        
        # Check if user exists
        user = db.query(User).filter(User.fb_user_id == fb_user_id).first()
        
        if not user:
            # Create new user
            user = User(
                fb_user_id=fb_user_id,
                name=name,
                email=email,
                access_token=encrypt_token(access_token),
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"✅ Created new user: {name} (ID: {user.id})")
        else:
            # Update existing user and reactivate
            user.access_token = encrypt_token(access_token)
            user.name = name
            user.email = email
            user.is_active = True
            db.commit()
            logger.info(f"✅ Updated existing user: {name} (ID: {user.id})")
        
        # Get user's pages and Instagram accounts
        pages = await facebook_service.get_user_pages(access_token)

        if not pages:
            logger.warning(f"⚠️  No Facebook pages found for user: {name}")
            # Still create the user but they'll need to set up pages later
            db.commit()

            # Create JWT token for the user even without pages
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            jwt_token = create_access_token(
                data={"sub": str(user.id)}, expires_delta=access_token_expires
            )

            return {
                "access_token": jwt_token,
                "token_type": "bearer",
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                "user_id": str(user.id),
                "name": user.name,
                "email": user.email,
                "setup_required": True,
                "message": "Account created successfully. Please set up your Facebook Page and Instagram Business account."
            }

        for page_data in pages:
            page_id = page_data["id"]
            page_name = page_data["name"]
            page_access_token = page_data["access_token"]

            # Log page token info
            logger.info(f"Page token for {page_name}: {page_access_token[:20]}... (Page tokens are typically long-lived)")
            
            # Check for Instagram Business Account
            ig_account = await facebook_service.get_instagram_business_account(
                page_id, page_access_token
            )
            
            ig_business_id = None
            instagram_username = None
            
            if ig_account:
                ig_business_id = ig_account["id"]
                # Get Instagram account details
                ig_info = await facebook_service.get_instagram_account_info(
                    ig_business_id, page_access_token
                )
                instagram_username = ig_info.get("username")

            # Create or update page record
            existing_page = db.query(Page).filter(Page.fb_page_id == page_id).first()
            
            if not existing_page:
                page = Page(
                    user_id=user.id,
                    fb_page_id=page_id,
                    ig_business_id=ig_business_id,
                    page_name=page_name,
                    page_access_token=encrypt_token(page_access_token),
                    instagram_username=instagram_username,
                    is_active=True
                )
                db.add(page)
                logger.info(f"✅ Created new page: {page_name}")
            else:
                existing_page.page_access_token = encrypt_token(page_access_token)
                existing_page.ig_business_id = ig_business_id
                existing_page.instagram_username = instagram_username
                existing_page.is_active = True
                logger.info(f"✅ Updated existing page: {page_name}")
        
        db.commit()
        
        # Create JWT token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        
        return Token(
            access_token=jwt_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except Exception as e:
        logger.error(f"Facebook callback error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication failed"
        )

@router.get("/setup-guide")
async def get_setup_guide():
    """Get setup guide for users without Facebook pages"""
    return {
        "title": "Instagram Business Setup Required",
        "message": "To use AutoniqueAI, you need a Facebook Page connected to an Instagram Business account.",
        "steps": [
            {
                "step": 1,
                "title": "Create a Facebook Page",
                "description": "Go to facebook.com/pages/create and create a business page",
                "url": "https://www.facebook.com/pages/create"
            },
            {
                "step": 2,
                "title": "Convert to Instagram Business Account",
                "description": "In Instagram app: Settings > Account > Switch to Professional Account > Business",
                "url": "https://help.instagram.com/502981923235522"
            },
            {
                "step": 3,
                "title": "Connect Instagram to Facebook Page",
                "description": "In Instagram: Settings > Account > Linked Accounts > Facebook",
                "url": "https://help.instagram.com/399237934150902"
            },
            {
                "step": 4,
                "title": "Log in to AutoniqueAI Again",
                "description": "Once setup is complete, log in again to connect your accounts",
                "url": "/auth/login"
            }
        ],
        "help_links": [
            {
                "title": "Instagram Business Account Help",
                "url": "https://help.instagram.com/502981923235522"
            },
            {
                "title": "Connect Instagram to Facebook Page",
                "url": "https://help.instagram.com/399237934150902"
            }
        ]
    }

@router.get("/permission-reset-guide")
async def get_permission_reset_guide():
    """Get guide for resetting Facebook permissions"""
    return {
        "title": "Reset Facebook Permissions",
        "message": "To grant the new permissions required by AutoniqueAI, you need to reset your Facebook app permissions.",
        "steps": [
            {
                "step": 1,
                "title": "Go to Facebook Settings",
                "description": "Visit Facebook Settings > Apps and Websites",
                "url": "https://www.facebook.com/settings?tab=applications"
            },
            {
                "step": 2,
                "title": "Find AutoniqueAI",
                "description": "Look for 'AutoniqueAI' in your connected apps list",
                "action": "Click on 'AutoniqueAI'"
            },
            {
                "step": 3,
                "title": "Remove the App",
                "description": "Click 'Remove' to disconnect AutoniqueAI from your Facebook account",
                "action": "This will reset all permissions"
            },
            {
                "step": 4,
                "title": "Log in Again",
                "description": "Return to AutoniqueAI and log in again to grant the new permissions",
                "url": "/auth/login"
            }
        ],
        "alternative_method": {
            "title": "Alternative: Use Re-authorization Link",
            "description": "Click the button below to force Facebook to re-request all permissions",
            "url": f"https://www.facebook.com/v18.0/dialog/oauth?client_id={settings.FACEBOOK_APP_ID}&redirect_uri=https://autonique.in/auth/callback&scope={facebook_config.OAUTH_SCOPE}&response_type=code&auth_type=rerequest&display=popup"
        },
        "required_permissions": [
            f"{perm} - {desc}" for perm, desc in facebook_config.PERMISSION_DESCRIPTIONS.items()
        ]
    }

@router.get("/check-permissions")
async def check_user_permissions(access_token: str = Query(...)):
    """Check what permissions are currently granted for a user"""
    try:
        facebook_service = FacebookService()

        async with httpx.AsyncClient() as client:
            # Check permissions
            permissions_response = await client.get(
                f"{facebook_service.graph_url}/me/permissions",
                params={"access_token": access_token}
            )

            if permissions_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to check permissions: {permissions_response.text}"
                )

            permissions_data = permissions_response.json()
            granted_perms = [p["permission"] for p in permissions_data.get("data", []) if p.get("status") == "granted"]
            declined_perms = [p["permission"] for p in permissions_data.get("data", []) if p.get("status") == "declined"]

            missing_perms = facebook_config.get_missing_permissions(granted_perms)

            return {
                "granted_permissions": granted_perms,
                "declined_permissions": declined_perms,
                "missing_permissions": missing_perms,
                "required_permissions": facebook_config.REQUIRED_PERMISSIONS,
                "has_all_required": len(missing_perms) == 0,
                "permission_details": {
                    perm: {
                        "granted": perm in granted_perms,
                        "declined": perm in declined_perms,
                        "description": facebook_config.PERMISSION_DESCRIPTIONS.get(perm, "Unknown permission")
                    }
                    for perm in facebook_config.REQUIRED_PERMISSIONS
                },
                "force_reset_urls": [
                    f"https://www.facebook.com/v18.0/dialog/oauth?client_id={settings.FACEBOOK_APP_ID}&redirect_uri=https://autonique.in/auth/callback&scope={facebook_config.OAUTH_SCOPE}&response_type=code&auth_type=rerequest&display=popup&force_login=true",
                    f"https://www.facebook.com/v18.0/dialog/oauth?client_id={settings.FACEBOOK_APP_ID}&redirect_uri=https://autonique.in/auth/callback&scope={facebook_config.OAUTH_SCOPE}&response_type=code&auth_type=rerequest&display=page&force_login=true&reauthorize=true"
                ]
            }

    except Exception as e:
        logger.error(f"Error checking permissions: {e}")
        raise HTTPException(status_code=500, detail=str(e))
