import asyncio
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import List

from app.core.database import SessionLocal
from app.models.user import User
from app.models.page import Page
from app.services.facebook_service import FacebookService
from app.core.security import decrypt_token, encrypt_token

logger = logging.getLogger(__name__)

class TokenRefreshService:
    def __init__(self):
        self.facebook_service = FacebookService()
    
    async def refresh_user_tokens(self, db: Session, user: User) -> bool:
        """Refresh tokens for a specific user"""
        try:
            logger.info(f"Refreshing tokens for user: {user.name} (ID: {user.id})")
            
            # Decrypt current user access token
            current_token = decrypt_token(user.access_token)
            
            # Exchange for long-lived token
            fresh_token_data = await self.facebook_service.exchange_for_long_lived_token(current_token)
            fresh_user_token = fresh_token_data["access_token"]
            
            # Update user token
            user.access_token = encrypt_token(fresh_user_token)
            
            # Refresh page tokens
            pages = db.query(Page).filter(Page.user_id == user.id).all()
            for page in pages:
                try:
                    if page.page_access_token:
                        # Get fresh page token
                        page_token_data = await self.facebook_service.get_page_access_token(
                            page.fb_page_id, fresh_user_token
                        )
                        
                        if page_token_data:
                            fresh_page_token = page_token_data.get("access_token")
                            if fresh_page_token:
                                page.page_access_token = encrypt_token(fresh_page_token)
                                logger.info(f"Refreshed token for page: {page.page_name}")
                        
                except Exception as e:
                    logger.error(f"Failed to refresh token for page {page.page_name}: {e}")
            
            db.commit()
            logger.info(f"Successfully refreshed tokens for user: {user.name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to refresh tokens for user {user.name}: {e}")
            db.rollback()
            return False
    
    async def refresh_all_tokens(self):
        """Refresh tokens for all users"""
        db = SessionLocal()
        try:
            users = db.query(User).all()
            logger.info(f"Starting token refresh for {len(users)} users")
            
            success_count = 0
            for user in users:
                if await self.refresh_user_tokens(db, user):
                    success_count += 1
                
                # Small delay between users to avoid rate limiting
                await asyncio.sleep(1)
            
            logger.info(f"Token refresh completed: {success_count}/{len(users)} users successful")
            
        except Exception as e:
            logger.error(f"Error in refresh_all_tokens: {e}")
        finally:
            db.close()
    
    async def start_periodic_refresh(self, interval_hours: int = 24):
        """Start periodic token refresh - less frequent for long-lived tokens"""
        logger.info(f"Starting periodic token refresh every {interval_hours} hours (for long-lived tokens)")

        while True:
            try:
                await self.refresh_all_tokens()
                # Wait for next refresh - longer interval for long-lived tokens
                await asyncio.sleep(interval_hours * 3600)
            except Exception as e:
                logger.error(f"Error in periodic refresh: {e}")
                # Wait 30 minutes before retrying
                await asyncio.sleep(1800)

# Global instance
token_refresh_service = TokenRefreshService()
