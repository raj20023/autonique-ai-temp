from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.schemas.auth import TokenData

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    import logging
    logger = logging.getLogger(__name__)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            logger.error("JWT token verification failed")
            raise credentials_exception

        user_id: int = payload.get("sub")
        if user_id is None:
            logger.error("No user ID in JWT token")
            raise credentials_exception

        token_data = TokenData(user_id=user_id)
    except Exception as e:
        logger.error(f"Token validation error: {e}")
        raise credentials_exception

    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        logger.error(f"User not found for ID: {token_data.user_id}")
        raise credentials_exception

    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    import logging
    logger = logging.getLogger(__name__)

    if not current_user.is_active:
        logger.error(f"User {current_user.id} is inactive")
        raise HTTPException(status_code=400, detail="Inactive user - please log in again")
    return current_user
