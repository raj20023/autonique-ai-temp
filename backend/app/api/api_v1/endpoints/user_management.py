from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.core.database import get_db
from app.services.user_management_service import UserManagementService
from app.models.user import User, UserRole
from app.api.deps import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# REMOVE THIS BLOCK AFTER SETTING UP ADMIN USER

@router.get("/profile")
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile and subscription status"""
    user_service = UserManagementService(db)

    # Initialize user management fields if needed
    if current_user.role is None:
        managed_user = user_service.get_or_create_user(
            facebook_id=current_user.fb_user_id,
            email=current_user.email or "",
            name=current_user.name,
            profile_picture=current_user.profile_picture or ""
        )
    else:
        managed_user = current_user

    access_info = user_service.check_user_access(managed_user.id)
    stats = user_service.get_user_stats(managed_user.id)
    
    return {
        "user": {
            "id": managed_user.id,
            "name": managed_user.name,
            "email": managed_user.email,
            "profile_picture": managed_user.profile_picture,
            "role": managed_user.role.value,
            "is_beta_user": managed_user.is_beta_user,
            "beta_user_number": managed_user.beta_user_number,
            "created_at": managed_user.created_at,
            "last_login": managed_user.last_login
        },
        "subscription": {
            "status": managed_user.subscription_status.value if managed_user.subscription_status else None,
            "trial_start_date": managed_user.trial_start_date,
            "trial_end_date": managed_user.trial_end_date,
            "trial_days_remaining": managed_user.days_remaining_in_trial() if managed_user.role == UserRole.FREE_TRIAL else None,
            "subscription_start_date": managed_user.subscription_start_date,
            "subscription_end_date": managed_user.subscription_end_date
        },
        "access": access_info,
        "usage": stats
    }

@router.get("/access-check")
async def check_access(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user has access to premium features"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    access_info = user_service.check_user_access(managed_user.id)

    return access_info

@router.post("/upgrade-to-paid")
async def upgrade_to_paid(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade user to paid subscription"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role == UserRole.PAID:
        raise HTTPException(
            status_code=400,
            detail="User already has paid subscription"
        )

    success = user_service.upgrade_to_paid(managed_user.id)
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to upgrade subscription"
        )
    
    return {"message": "Successfully upgraded to paid subscription"}

@router.get("/usage-stats")
async def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's usage statistics"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    stats = user_service.get_user_stats(managed_user.id)

    return stats

# Admin endpoints
@router.get("/admin/users")
async def get_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all users for admin panel (Admin only)"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    users = user_service.get_all_users_for_admin()

    return {"users": users}

@router.get("/admin/settings")
async def get_admin_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin settings (Admin only)"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    user_service = UserManagementService(db)
    settings = user_service.get_admin_settings()
    
    return {"settings": settings}

@router.put("/admin/settings/{key}")
async def update_admin_setting(
    key: str,
    value: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update admin setting (Admin only)"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    success = user_service.update_admin_setting(key, value)
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to update setting"
        )
    
    return {"message": f"Setting {key} updated successfully"}

@router.post("/admin/users/{user_id}/upgrade")
async def admin_upgrade_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade user to paid subscription (Admin only)"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    success = user_service.upgrade_to_paid(user_id)
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return {"message": "User upgraded successfully"}

@router.put("/admin/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deactivate user account (Admin only)"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    user.is_active = False
    db.commit()
    
    return {"message": "User deactivated successfully"}

@router.put("/admin/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Activate user account (Admin only)"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    user.is_active = True
    db.commit()
    
    return {"message": "User activated successfully"}

@router.get("/admin/stats")
async def get_admin_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    user_service = UserManagementService(db)

    # Get or create managed user
    managed_user = user_service.get_or_create_user(
        facebook_id=current_user.fb_user_id,
        email=current_user.email or "",
        name=current_user.name,
        profile_picture=""
    )

    if managed_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Get user counts by role
    total_users = db.query(User).count()
    beta_users = db.query(User).filter(User.role == UserRole.BETA).count()
    trial_users = db.query(User).filter(User.role == UserRole.FREE_TRIAL).count()
    paid_users = db.query(User).filter(User.role == UserRole.PAID).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    return {
        "total_users": total_users,
        "beta_users": beta_users,
        "trial_users": trial_users,
        "paid_users": paid_users,
        "active_users": active_users,
        "beta_slots_remaining": max(0, 20 - beta_users)
    }
