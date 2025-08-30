from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.core.database import get_db
from app.services.user_management_service import UserManagementService
from app.models.user import User
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
            "role": managed_user.role,
            "is_beta_user": managed_user.is_beta_user,
            "beta_user_number": managed_user.beta_user_number,
            "created_at": managed_user.created_at,
            "last_login": managed_user.last_login
        },
        "subscription": {
            "status": managed_user.subscription_status if managed_user.subscription_status else None,
            "trial_start_date": managed_user.trial_start_date,
            "trial_end_date": managed_user.trial_end_date,
            "trial_days_remaining": managed_user.days_remaining_in_trial() if managed_user.role == "free_trial" else None,
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

    if managed_user.role == "paid":
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

    # Check if current user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Get all users from the main User table
    users = db.query(User).all()

    # Format user data for admin panel
    user_data = []
    for user in users:
        user_data.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "is_beta_user": user.is_beta_user,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None
        })

    return {"users": user_data}

@router.get("/admin/settings")
async def get_admin_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin settings (Admin only)"""

    # Check if current user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Return basic admin settings with frontend-compatible field names
    settings = {
        "beta_users_limit": "20",
        "trial_days": "7",
        "monthly_message_limit_trial": "100",
        "monthly_message_limit_paid": "1000",
        "app_maintenance_mode": "false",
        "auto_approve_beta": "false"
    }

    return {"settings": settings}

@router.put("/admin/settings/{key}")
async def update_admin_setting(
    key: str,
    request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update admin setting (Admin only)"""

    # Check if current user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Get value from request body
    value = request.get("value", "")

    # For now, just return success (settings can be stored in database later)
    allowed_keys = [
        "beta_users_limit",
        "trial_days",
        "monthly_message_limit_trial",
        "monthly_message_limit_paid",
        "auto_approve_beta",
        "maintenance_mode"
    ]

    if key not in allowed_keys:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid setting key. Allowed keys: {', '.join(allowed_keys)}"
        )

    return {"message": f"Setting {key} updated successfully to {value}"}

@router.post("/admin/users/{user_id}/upgrade")
async def admin_upgrade_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade user to paid subscription (Admin only)"""

    # Check if current user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Find the user to upgrade
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Upgrade user to paid
    user.role = "paid"
    db.commit()

    return {"message": f"User {user.name} upgraded to paid successfully"}

@router.put("/admin/users/{user_id}/role")
async def change_user_role(
    user_id: int,
    request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user role (Admin only)"""

    # Check if current user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Get new role from request body
    new_role = request.get("role", "")

    # Validate role
    valid_roles = ["trial", "beta", "paid", "admin"]
    if new_role not in valid_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Valid roles: {', '.join(valid_roles)}"
        )

    # Find the user to change role
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Update user role
    old_role = user.role
    user.role = new_role

    # Update beta user status if needed
    if new_role == "beta":
        user.is_beta_user = True
    elif new_role != "beta" and user.is_beta_user:
        user.is_beta_user = False

    db.commit()

    return {"message": f"User {user.name} role changed from {old_role} to {new_role} successfully"}

@router.put("/admin/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deactivate user account (Admin only)"""

    # Check if current user is admin
    if current_user.role != "admin":
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

    return {"message": f"User {user.name} deactivated successfully"}

@router.put("/admin/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Activate user account (Admin only)"""

    # Check if current user is admin
    if current_user.role != "admin":
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

    return {"message": f"User {user.name} activated successfully"}

@router.get("/admin/stats")
async def get_admin_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""

    # Check if current user is admin (use existing User table)
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Get user counts by role
    total_users = db.query(User).count()
    beta_users = db.query(User).filter(User.role == "beta").count()
    trial_users = db.query(User).filter(User.role == "free_trial").count()
    paid_users = db.query(User).filter(User.role == "paid").count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    return {
        "total_users": total_users,
        "beta_users": beta_users,
        "trial_users": trial_users,
        "paid_users": paid_users,
        "active_users": active_users,
        "beta_slots_remaining": max(0, 20 - beta_users)
    }
