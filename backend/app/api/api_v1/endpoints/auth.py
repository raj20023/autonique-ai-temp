from fastapi import APIRouter, Depends, HTTPException, status, Query
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
        access_token = token_data["access_token"]
        
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
                access_token=encrypt_token(access_token)
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update existing user
            user.access_token = encrypt_token(access_token)
            user.name = name
            user.email = email
            db.commit()
        
        # Get user's pages and Instagram accounts
        pages = await facebook_service.get_user_pages(access_token)
        logger.info(f"Found {len(pages)} pages for user {user.id}")

        for page_data in pages:
            page_id = page_data["id"]
            page_name = page_data["name"]
            page_access_token = page_data["access_token"]
            
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
                logger.info(f"Found Instagram account for page {page_name}: {instagram_username}")
            else:
                logger.warning(f"No Instagram Business Account found for page {page_name}")

            # Create or update page record
            existing_page = db.query(Page).filter(Page.fb_page_id == page_id).first()
            
            if not existing_page:
                page = Page(
                    user_id=user.id,
                    fb_page_id=page_id,
                    ig_business_id=ig_business_id,
                    page_name=page_name,
                    page_access_token=encrypt_token(page_access_token),
                    instagram_username=instagram_username
                )
                db.add(page)
                logger.info(f"Created new page record: {page_name}")
            else:
                existing_page.page_access_token = encrypt_token(page_access_token)
                existing_page.ig_business_id = ig_business_id
                existing_page.instagram_username = instagram_username
                logger.info(f"Updated existing page record: {page_name}")
        
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
