from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.page import Page
from app.schemas.page import PageResponse, PageUpdate
from app.services.facebook_service import FacebookService
from app.core.security import decrypt_token

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[PageResponse])
def get_user_pages(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's Facebook pages with Instagram accounts"""
    pages = db.query(Page).filter(Page.user_id == current_user.id).all()
    return pages

@router.get("/instagram-details")
async def get_instagram_details(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get Instagram account details with profile pictures for dashboard"""
    pages = db.query(Page).filter(Page.user_id == current_user.id).all()
    facebook_service = FacebookService()

    instagram_accounts = []
    for page in pages:
        if page.ig_business_id and page.page_access_token:
            try:
                page_access_token = decrypt_token(page.page_access_token)
                ig_info = await facebook_service.get_instagram_account_info(
                    page.ig_business_id, page_access_token
                )

                if ig_info:
                    instagram_accounts.append({
                        "page_id": page.id,
                        "page_name": page.page_name,
                        "instagram_username": ig_info.get("username", "Unknown"),
                        "instagram_display_name": ig_info.get("name", page.page_name),
                        "profile_picture_url": ig_info.get("profile_picture_url", ""),
                        "ig_business_id": page.ig_business_id,
                        "webhook_subscribed": page.webhook_subscribed
                    })
                else:
                    # Fallback if API call fails
                    instagram_accounts.append({
                        "page_id": page.id,
                        "page_name": page.page_name,
                        "instagram_username": page.instagram_username or "Unknown",
                        "instagram_display_name": page.page_name,
                        "profile_picture_url": "",
                        "ig_business_id": page.ig_business_id,
                        "webhook_subscribed": page.webhook_subscribed,
                        "error": "Could not fetch Instagram details"
                    })

            except Exception as e:
                logger.error(f"Error fetching Instagram details for page {page.page_name}: {e}")
                instagram_accounts.append({
                    "page_id": page.id,
                    "page_name": page.page_name,
                    "instagram_username": page.instagram_username or "Unknown",
                    "instagram_display_name": page.page_name,
                    "profile_picture_url": "",
                    "ig_business_id": page.ig_business_id,
                    "webhook_subscribed": page.webhook_subscribed,
                    "error": "Token error - please re-login"
                })

    return {"instagram_accounts": instagram_accounts}

@router.get("/{page_id}", response_model=PageResponse)
def get_page(
    page_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific page information"""
    page = db.query(Page).filter(
        Page.id == page_id,
        Page.user_id == current_user.id
    ).first()
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return page

@router.put("/{page_id}", response_model=PageResponse)
def update_page(
    page_id: int,
    page_update: PageUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update page information"""
    page = db.query(Page).filter(
        Page.id == page_id,
        Page.user_id == current_user.id
    ).first()
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    update_data = page_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(page, field, value)
    
    db.commit()
    db.refresh(page)
    return page

@router.post("/{page_id}/subscribe-webhook")
async def subscribe_webhook(
    page_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Subscribe page to Instagram messaging webhooks"""
    page = db.query(Page).filter(
        Page.id == page_id,
        Page.user_id == current_user.id
    ).first()
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    if not page.ig_business_id or page.ig_business_id.startswith("ig_placeholder_"):
        raise HTTPException(
            status_code=400,
            detail="No Instagram Business account connected to this page"
        )
    
    facebook_service = FacebookService()
    page_access_token = decrypt_token(page.page_access_token)

    logger.info(f"🔗 Attempting webhook subscription for page {page.page_name} (FB Page ID: {page.fb_page_id})")

    success = await facebook_service.subscribe_to_webhooks(
        page.fb_page_id, page_access_token
    )

    if success:
        # Double-check the subscription status
        is_subscribed = await facebook_service.check_webhook_subscription(
            page.fb_page_id, page_access_token
        )

        page.webhook_subscribed = is_subscribed
        db.commit()

        if is_subscribed:
            logger.info(f"✅ Webhook subscription verified for page {page.page_name}")
            return {"message": "Webhook subscription successful and verified"}
        else:
            logger.warning(f"⚠️ Webhook subscription may have failed for page {page.page_name}")
            return {"message": "Webhook subscription completed but verification failed"}
    else:
        logger.error(f"❌ Webhook subscription failed for page {page.page_name}")
        raise HTTPException(
            status_code=400,
            detail="Failed to subscribe to webhooks"
        )

@router.post("/{page_id}/refresh-webhook-status")
async def refresh_webhook_status(
    page_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Refresh webhook subscription status for a page"""
    page = db.query(Page).filter(
        Page.id == page_id,
        Page.user_id == current_user.id
    ).first()

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    if not page.ig_business_id or page.ig_business_id.startswith("ig_placeholder_"):
        raise HTTPException(
            status_code=400,
            detail="No Instagram Business account connected to this page"
        )

    facebook_service = FacebookService()
    page_access_token = decrypt_token(page.page_access_token)

    is_subscribed = await facebook_service.check_webhook_subscription(
        page.fb_page_id, page_access_token
    )

    page.webhook_subscribed = is_subscribed
    db.commit()

    return {
        "page_id": page_id,
        "webhook_subscribed": is_subscribed,
        "message": f"Webhook status refreshed: {'Active' if is_subscribed else 'Inactive'}"
    }
