from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.business_profile import BusinessProfile
from app.schemas.business_profile import (
    BusinessProfileCreate, 
    BusinessProfileUpdate, 
    BusinessProfileResponse,
    OnboardingFormData
)

router = APIRouter()

@router.get("/profile", response_model=Optional[BusinessProfileResponse])
async def get_business_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's business profile"""
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == current_user.id
    ).first()
    
    return profile

@router.post("/profile", response_model=BusinessProfileResponse)
async def create_or_update_business_profile(
    profile_data: BusinessProfileCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create or update business profile"""
    # Check if profile already exists
    existing_profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        
        existing_profile.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_profile)
        return existing_profile
    else:
        # Create new profile
        new_profile = BusinessProfile(
            user_id=current_user.id,
            **profile_data.dict(exclude_unset=True)
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return new_profile

@router.put("/profile", response_model=BusinessProfileResponse)
async def update_business_profile(
    profile_data: BusinessProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update business profile"""
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Business profile not found")
    
    # Update fields
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    profile.updated_at = datetime.utcnow()
    
    # Mark as completed if specified
    if profile_data.is_completed and not profile.completed_at:
        profile.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/onboarding/complete")
async def complete_onboarding(
    form_data: OnboardingFormData,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Complete the onboarding process with all form data"""
    # Check if profile already exists
    existing_profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in form_data.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        
        existing_profile.is_completed = True
        existing_profile.completed_at = datetime.utcnow()
        existing_profile.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(existing_profile)
        return {"message": "Onboarding completed successfully", "profile": existing_profile}
    else:
        # Create new profile
        new_profile = BusinessProfile(
            user_id=current_user.id,
            is_completed=True,
            completed_at=datetime.utcnow(),
            **form_data.dict(exclude_unset=True)
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return {"message": "Onboarding completed successfully", "profile": new_profile}

@router.get("/onboarding/status")
async def get_onboarding_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Check if user has completed onboarding"""
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == current_user.id
    ).first()
    
    return {
        "completed": profile.is_completed if profile else False,
        "has_profile": profile is not None,
        "completed_at": profile.completed_at if profile else None
    }

@router.get("/context")
async def get_business_context(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get business context for AI prompts"""
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == current_user.id
    ).first()
    
    if not profile or not profile.is_completed:
        return {"context": "", "has_context": False}
    
    return {
        "context": profile.to_prompt_context(),
        "has_context": True,
        "business_name": profile.business_name
    }
