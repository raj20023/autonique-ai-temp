#!/usr/bin/env python3
"""
Comprehensive webhook debugging script
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
import httpx
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.page import Page
from app.models.user import User
from app.core.security import decrypt_token
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def debug_webhook_complete():
    """Complete webhook debugging"""
    db = SessionLocal()
    try:
        # Find Seasonart1 page
        page = db.query(Page).filter(Page.page_name == "Seasonart1").first()
        if not page:
            logger.error("❌ Seasonart1 page not found")
            return
        
        user = db.query(User).filter(User.id == page.user_id).first()
        if not user:
            logger.error("❌ User not found")
            return
        
        logger.info(f"📄 Page: {page.page_name}")
        logger.info(f"📄 FB Page ID: {page.fb_page_id}")
        logger.info(f"📄 IG Business ID: {page.ig_business_id}")
        logger.info(f"📄 Webhook Status in DB: {page.webhook_subscribed}")
        
        # Get tokens
        try:
            page_token = decrypt_token(page.page_access_token)
            user_token = decrypt_token(user.access_token)
            logger.info("✅ Successfully decrypted tokens")
        except Exception as e:
            logger.error(f"❌ Failed to decrypt tokens: {e}")
            return
        
        async with httpx.AsyncClient() as client:
            
            # Step 1: Test webhook endpoint
            logger.info("\n🔍 Step 1: Testing webhook endpoint...")
            try:
                response = await client.get(
                    "https://api.autonique.in/api/v1/webhook",
                    params={
                        "hub.mode": "subscribe",
                        "hub.verify_token": settings.WEBHOOK_VERIFY_TOKEN,
                        "hub.challenge": "test123"
                    }
                )
                if response.status_code == 200 and response.text.strip('"') == "test123":
                    logger.info("✅ Webhook endpoint verification works")
                else:
                    logger.error(f"❌ Webhook endpoint failed: {response.status_code} - {response.text}")
                    return
            except Exception as e:
                logger.error(f"❌ Webhook endpoint error: {e}")
                return
            
            # Step 2: Check current subscription status
            logger.info("\n🔍 Step 2: Checking subscription status...")
            try:
                response = await client.get(
                    f"https://graph.facebook.com/v23.0/{page.fb_page_id}/subscribed_apps",
                    params={"access_token": user_token}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"📊 Subscription data: {data}")
                    
                    # Check if our app is subscribed
                    app_id = "2032087817551720"  # Your app ID
                    subscribed = False
                    for app in data.get("data", []):
                        if app.get("id") == app_id:
                            subscribed = True
                            logger.info(f"✅ App {app_id} is subscribed")
                            break
                    
                    if not subscribed:
                        logger.warning(f"⚠️ App {app_id} is NOT subscribed")
                else:
                    logger.error(f"❌ Failed to check subscription: {response.status_code}")
                    logger.error(f"Response: {response.text}")
            except Exception as e:
                logger.error(f"❌ Subscription check error: {e}")
            
            # Step 3: Subscribe to webhooks using App Access Token
            logger.info("\n🔍 Step 3: Subscribing to webhooks with App Access Token...")
            app_access_token = f"{settings.FACEBOOK_APP_ID}|{settings.FACEBOOK_APP_SECRET}"

            try:
                response = await client.post(
                    f"https://graph.facebook.com/v23.0/{page.fb_page_id}/subscribed_apps",
                    data={
                        "access_token": app_access_token,
                        "subscribed_fields": "messages,messaging_postbacks,messaging_optins"
                    }
                )

                if response.status_code == 200:
                    logger.info("✅ Webhook subscription successful with App Access Token")
                    logger.info(f"Response: {response.json()}")
                else:
                    logger.error(f"❌ Webhook subscription failed: {response.status_code}")
                    logger.error(f"Response: {response.text}")

                    # Try with page token as fallback
                    logger.info("🔄 Trying with page access token as fallback...")
                    response = await client.post(
                        f"https://graph.facebook.com/v23.0/{page.fb_page_id}/subscribed_apps",
                        data={
                            "access_token": page_token,
                            "subscribed_fields": "messages,messaging_postbacks,messaging_optins"
                        }
                    )

                    if response.status_code == 200:
                        logger.info("✅ Webhook subscription successful with Page Access Token")
                        logger.info(f"Response: {response.json()}")
                    else:
                        logger.error(f"❌ Page token also failed: {response.status_code}")
                        logger.error(f"Response: {response.text}")

            except Exception as e:
                logger.error(f"❌ Webhook subscription error: {e}")
            
            # Step 4: Verify subscription again
            logger.info("\n🔍 Step 4: Verifying subscription...")
            try:
                response = await client.get(
                    f"https://graph.facebook.com/v23.0/{page.fb_page_id}/subscribed_apps",
                    params={"access_token": user_token}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"📊 Updated subscription data: {data}")
                    
                    # Check if our app is now subscribed
                    app_id = "2032087817551720"
                    subscribed = False
                    for app in data.get("data", []):
                        if app.get("id") == app_id:
                            subscribed = True
                            logger.info(f"✅ App {app_id} is now subscribed")
                            break
                    
                    if subscribed:
                        # Update database
                        page.webhook_subscribed = True
                        db.commit()
                        logger.info("✅ Database updated")
                    else:
                        logger.warning(f"⚠️ App {app_id} is still NOT subscribed")
                else:
                    logger.error(f"❌ Failed to verify subscription: {response.status_code}")
            except Exception as e:
                logger.error(f"❌ Subscription verification error: {e}")
            
            # Step 5: Test message sending (optional)
            logger.info("\n🔍 Step 5: Testing message sending capability...")
            try:
                # Test if we can send a message (this will fail if not properly set up)
                test_response = await client.post(
                    f"https://graph.facebook.com/v23.0/{page.ig_business_id}/messages",
                    json={
                        "recipient": {"id": "test_user_id"},
                        "message": {"text": "Test message"}
                    },
                    headers={
                        "Authorization": f"Bearer {page_token}",
                        "Content-Type": "application/json"
                    }
                )
                
                # We expect this to fail with a specific error about invalid recipient
                if test_response.status_code == 400:
                    error_data = test_response.json()
                    if "Invalid user ID" in str(error_data) or "does not exist" in str(error_data):
                        logger.info("✅ Message sending endpoint is accessible (expected error for test user)")
                    else:
                        logger.warning(f"⚠️ Unexpected error: {error_data}")
                else:
                    logger.info(f"📊 Message test response: {test_response.status_code} - {test_response.text}")
                    
            except Exception as e:
                logger.error(f"❌ Message test error: {e}")
        
        logger.info("\n📋 Summary:")
        logger.info(f"Page: {page.page_name}")
        logger.info(f"FB Page ID: {page.fb_page_id}")
        logger.info(f"IG Business ID: {page.ig_business_id}")
        logger.info(f"Webhook Status: {page.webhook_subscribed}")
        logger.info(f"Webhook URL: https://api.autonique.in/api/v1/webhook")
        logger.info(f"Verify Token: {settings.WEBHOOK_VERIFY_TOKEN}")
        
        logger.info("\n🎯 Next Steps:")
        logger.info("1. Send a DM to @seasonart1 from another Instagram account")
        logger.info("2. Watch the backend logs for incoming webhook requests")
        logger.info("3. If no requests appear, check Facebook App Dashboard webhook configuration")
        
    except Exception as e:
        logger.error(f"Error during webhook debug: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(debug_webhook_complete())
