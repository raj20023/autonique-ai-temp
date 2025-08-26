from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import base64
import os

from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token encryption key (for storing Facebook tokens)
def get_encryption_key() -> bytes:
    """Get or generate encryption key for token storage"""
    key = os.environ.get("ENCRYPTION_KEY")
    if not key:
        # Use JWT secret as base for encryption key to ensure consistency
        jwt_secret = settings.JWT_SECRET_KEY.encode()
        # Pad or truncate to 32 bytes for Fernet
        if len(jwt_secret) < 32:
            jwt_secret = jwt_secret + b'0' * (32 - len(jwt_secret))
        else:
            jwt_secret = jwt_secret[:32]
        key = base64.urlsafe_b64encode(jwt_secret)
    else:
        key = key.encode()
    return key

fernet = Fernet(get_encryption_key())

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def encrypt_token(token: str) -> str:
    """Encrypt sensitive tokens for database storage"""
    return fernet.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    """Decrypt tokens from database"""
    try:
        return fernet.decrypt(encrypted_token.encode()).decode()
    except Exception as e:
        # Log the specific error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Token decryption failed: {e}")
        raise Exception(f"Token decryption failed - user may need to re-authenticate")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)
