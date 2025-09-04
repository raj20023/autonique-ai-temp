#!/usr/bin/env python3
"""
Test webhook setup for Seasonart1 page
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.page import Page
from app.models.user import User
from app.services.facebook_service import FacebookService
from app.core.security import decrypt_token
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_webhook_setup():
    """Test webhook setup for Seasonart1"""
    db = SessionLocal()
    try:
        # Find Seasonart1 page
        page = db.query(Page).filter(Page.page_name == "Seasonart1").first()
        if not page:
            logger.error("Seasonart1 page not found")
            return
        
        logger.info(f"Found page: {page.page_name}")
        logger.info(f"FB Page ID: {page.fb_page_id}")
        logger.info(f"IG Business ID: {page.ig_business_id}")
        logger.info(f"Current webhook status: {page.webhook_subscribed}")
        
        # Test page access token
        try:
            page_access_token = decrypt_token(page.page_access_token)
            logger.info("✅ Successfully decrypted page access token")
        except Exception as e:
            logger.error(f"❌ Failed to decrypt page access token: {e}")
            return
        
        # Get user access token
        user = db.query(User).filter(User.id == page.user_id).first()
        if not user:
            logger.error("User not found")
            return

        try:
            user_access_token = decrypt_token(user.access_token)
            logger.info("✅ Successfully decrypted user access token")
        except Exception as e:
            logger.error(f"❌ Failed to decrypt user access token: {e}")
            return

        # Test Facebook API access with user token
        facebook_service = FacebookService()

        # Test basic page access with user token (skip page token test since it requires pages_read_engagement)
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://graph.facebook.com/v23.0/me/accounts",
                params={
                    "access_token": user_access_token,
                    "fields": "id,name"
                }
            )

            if response.status_code == 200:
                logger.info("✅ User access token is valid")
                accounts_data = response.json()
                logger.info(f"Found {len(accounts_data.get('data', []))} accounts")

                # Check if our page is in the accounts
                for account in accounts_data.get('data', []):
                    if account.get('id') == page.fb_page_id:
                        logger.info(f"✅ Found page {page.page_name} in user accounts")
                        break
                else:
                    logger.warning(f"⚠️ Page {page.page_name} not found in user accounts")
            else:
                logger.error(f"❌ User access token is invalid: {response.status_code}")
                logger.error(f"Response: {response.text}")
                return
        
        # Test webhook subscription
        logger.info("🔗 Testing webhook subscription...")
        success = await facebook_service.subscribe_to_webhooks(
            page.fb_page_id, page_access_token, user_access_token
        )

        if success:
            logger.info("✅ Webhook subscription successful")

            # Verify subscription
            is_subscribed = await facebook_service.check_webhook_subscription(
                page.fb_page_id, page_access_token, user_access_token
            )
            
            if is_subscribed:
                logger.info("✅ Webhook subscription verified")
                page.webhook_subscribed = True
                db.commit()
                logger.info("✅ Database updated")
            else:
                logger.warning("⚠️ Webhook subscription could not be verified")
        else:
            logger.error("❌ Webhook subscription failed")
        
    except Exception as e:
        logger.error(f"Error during webhook test: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_webhook_setup())
