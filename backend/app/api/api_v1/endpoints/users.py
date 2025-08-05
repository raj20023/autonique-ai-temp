from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me")
def delete_current_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete current user account"""
    db.delete(current_user)
    db.commit()
    return {"message": "User account deleted successfully"}
