from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.page import Page
from app.schemas.page import PageResponse, PageUpdate
from app.services.facebook_service import FacebookService
from app.core.security import decrypt_token

router = APIRouter()

@router.get("/debug")
async def debug_pages(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Debug endpoint to check Facebook pages"""
    try:
        from app.core.security import decrypt_token

        # Get user's access token
        if not current_user.access_token:
            return {"error": "No access token found"}

        access_token = decrypt_token(current_user.access_token)

        # Get pages from Facebook API
        facebook_service = FacebookService()
        fb_pages = await facebook_service.get_user_pages(access_token)

        # Get pages from database
        db_pages = db.query(Page).filter(Page.user_id == current_user.id).all()

        return {
            "user_id": current_user.id,
            "facebook_pages_count": len(fb_pages),
            "facebook_pages": fb_pages,
            "database_pages_count": len(db_pages),
            "database_pages": [
                {
                    "id": p.id,
                    "page_name": p.page_name,
                    "fb_page_id": p.fb_page_id,
                    "ig_business_id": p.ig_business_id,
                    "instagram_username": p.instagram_username
                } for p in db_pages
            ]
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/", response_model=List[PageResponse])
def get_user_pages(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's Facebook pages with Instagram accounts"""
    pages = db.query(Page).filter(Page.user_id == current_user.id).all()
    print(f"DEBUG: Found {len(pages)} pages for user {current_user.id}")
    for page in pages:
        print(f"DEBUG: Page {page.page_name} - IG: {page.instagram_username}")
    return pages

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
    
    if not page.ig_business_id:
        raise HTTPException(
            status_code=400, 
            detail="No Instagram Business account connected to this page"
        )
    
    facebook_service = FacebookService()
    page_access_token = decrypt_token(page.page_access_token)
    
    success = await facebook_service.subscribe_to_webhooks(
        page.fb_page_id, page_access_token
    )
    
    if success:
        page.webhook_subscribed = True
        db.commit()
        return {"message": "Webhook subscription successful"}
    else:
        raise HTTPException(
            status_code=400,
            detail="Failed to subscribe to webhooks"
        )
