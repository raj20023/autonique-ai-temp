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

@router.get("/", response_model=List[PageResponse])
def get_user_pages(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's Facebook pages with Instagram accounts"""
    pages = db.query(Page).filter(Page.user_id == current_user.id).all()
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
