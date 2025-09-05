from fastapi import APIRouter, Request, HTTPException, Query, Header
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import json
import hmac
import hashlib

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.models.user import User
from app.models.page import Page
from app.models.message import Message
from app.services.instagram_service import InstagramService
from app.services.faq_service import FAQService
from app.services.gemini_service import GeminiService
from app.core.security import decrypt_token, encrypt_token

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/subscribe-webhook/{page_id}")
async def subscribe_webhook_to_page(page_id: str):
    """Subscribe webhook to a specific page"""
    try:
        db = SessionLocal()

        # Find the page
        page = db.query(Page).filter(Page.fb_page_id == page_id).first()
        if not page:
            db.close()
            raise HTTPException(status_code=404, detail=f"Page {page_id} not found")

        # Get user
        user = db.query(User).filter(User.id == page.user_id).first()
        if not user:
            db.close()
            raise HTTPException(status_code=404, detail="User not found")

        # Decrypt tokens
        try:
            page_access_token = decrypt_token(page.page_access_token)
            user_access_token = decrypt_token(user.access_token)
        except Exception as e:
            db.close()
            raise HTTPException(status_code=500, detail=f"Failed to decrypt tokens: {e}")

        # Subscribe webhook using page access token
        import requests

        subscribe_url = f"https://graph.facebook.com/v23.0/{page_id}/subscribed_apps"
        payload = {
            "subscribed_fields": "messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads"
        }

        response = requests.post(
            subscribe_url,
            data=payload,
            params={"access_token": page_access_token}
        )

        if response.status_code == 200:
            # Update database
            page.webhook_subscribed = True
            db.commit()

            result = {
                "success": True,
                "message": f"Webhook subscribed to page {page_id}",
                "page_name": page.page_name,
                "response": response.json()
            }
        else:
            # Try with user access token as fallback
            response2 = requests.post(
                subscribe_url,
                data=payload,
                params={"access_token": user_access_token}
            )

            if response2.status_code == 200:
                page.webhook_subscribed = True
                db.commit()
                result = {
                    "success": True,
                    "message": f"Webhook subscribed to page {page_id} (using user token)",
                    "page_name": page.page_name,
                    "response": response2.json()
                }
            else:
                result = {
                    "success": False,
                    "message": f"Failed to subscribe webhook to page {page_id}",
                    "page_token_error": response.text,
                    "user_token_error": response2.text
                }

        db.close()
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error subscribing webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-page-token/{page_id}")
async def get_page_access_token(page_id: str):
    """Get decrypted page access token for a specific page ID"""
    try:
        db = SessionLocal()

        # Find the page by fb_page_id
        page = db.query(Page).filter(Page.fb_page_id == page_id).first()

        if not page:
            db.close()
            raise HTTPException(status_code=404, detail=f"Page with ID {page_id} not found")

        # Get user info
        user = db.query(User).filter(User.id == page.user_id).first()

        # Decrypt the access token
        try:
            page_access_token = decrypt_token(page.page_access_token)

            # Verify token works by calling Facebook API
            import requests
            verify_url = f"https://graph.facebook.com/v23.0/{page_id}?fields=name,id&access_token={page_access_token}"
            response = requests.get(verify_url)

            token_valid = response.status_code == 200
            page_info = response.json() if token_valid else None

            result = {
                "page_id": page.fb_page_id,
                "page_name": page.page_name,
                "instagram_business_account_id": page.ig_business_id,
                "instagram_username": page.instagram_username,
                "page_access_token": page_access_token,
                "user_email": user.email if user else None,
                "token_valid": token_valid,
                "facebook_page_info": page_info
            }

            db.close()
            return result

        except Exception as e:
            db.close()
            raise HTTPException(status_code=500, detail=f"Failed to decrypt token: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting page access token: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/get-seasonart1-token")
async def get_seasonart1_token():
    """Get access token specifically for seasonart1 Instagram account"""
    try:
        db = SessionLocal()

        # Try to find seasonart1 by fb_page_id first
        page = db.query(Page).filter(Page.fb_page_id == "709105118962659").first()

        # If not found by fb_page_id, try by Instagram username
        if not page:
            page = db.query(Page).filter(Page.instagram_username.ilike('%seasonart1%')).first()

        if not page:
            db.close()
            # List all available pages for debugging
            all_pages = db.query(Page).all()
            available_pages = [
                {
                    "page_id": p.fb_page_id,
                    "name": p.page_name,
                    "instagram_username": p.instagram_username
                } for p in all_pages
            ]

            raise HTTPException(
                status_code=404,
                detail={
                    "message": "seasonart1 page not found",
                    "available_pages": available_pages
                }
            )

        # Get user info
        user = db.query(User).filter(User.id == page.user_id).first()

        # Decrypt the access token
        try:
            page_access_token = decrypt_token(page.page_access_token)

            # Verify token and get Instagram account info
            import requests

            # Test 1: Verify page access
            page_url = f"https://graph.facebook.com/v23.0/{page.fb_page_id}?fields=name,id,instagram_business_account&access_token={page_access_token}"
            page_response = requests.get(page_url)

            # Test 2: Get Instagram account details
            ig_url = f"https://graph.facebook.com/v23.0/{page.ig_business_id}?fields=id,username,name,followers_count&access_token={page_access_token}"
            ig_response = requests.get(ig_url)

            # Test 3: Check webhook subscription - PROPERLY
            webhook_url = f"https://graph.facebook.com/v23.0/{page.fb_page_id}/subscribed_apps?access_token={page_access_token}"
            webhook_response = requests.get(webhook_url)

            # FIXED: Actually check if our app is subscribed
            webhook_status = {
                "status_code": webhook_response.status_code,
                "our_app_subscribed": False,
                "subscribed_apps": [],
                "error": None
            }

            if webhook_response.status_code == 200:
                try:
                    webhook_data = webhook_response.json()
                    subscribed_apps = webhook_data.get('data', [])
                    webhook_status["subscribed_apps"] = [{"id": app.get("id"), "name": app.get("name")} for app in subscribed_apps]

                    # Check if OUR app is actually subscribed
                    our_app_id = settings.FACEBOOK_APP_ID
                    webhook_status["our_app_subscribed"] = any(app.get("id") == our_app_id for app in subscribed_apps)
                    webhook_status["our_app_id"] = our_app_id

                    if not webhook_status["our_app_subscribed"]:
                        webhook_status["error"] = f"Our app ({our_app_id}) is NOT subscribed to this page"

                except Exception as e:
                    webhook_status["error"] = f"Failed to parse webhook response: {e}"
            else:
                webhook_status["error"] = f"Failed to check webhook subscription: {webhook_response.text}"

            result = {
                "success": True,
                "page_id": page.fb_page_id,
                "page_name": page.page_name,
                "instagram_business_account_id": page.ig_business_id,
                "instagram_username": page.instagram_username,
                "page_access_token": page_access_token,
                "user_email": user.email if user else None,
                "verification": {
                    "page_access": {
                        "status_code": page_response.status_code,
                        "data": page_response.json() if page_response.status_code == 200 else None
                    },
                    "instagram_access": {
                        "status_code": ig_response.status_code,
                        "data": ig_response.json() if ig_response.status_code == 200 else None
                    },
                    "webhook_subscription": webhook_status
                }
            }

            db.close()
            return result

        except Exception as e:
            db.close()
            raise HTTPException(status_code=500, detail=f"Failed to decrypt token: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting seasonart1 token: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/list-all-pages")
async def list_all_pages():
    """List all connected pages with their basic info (without access tokens)"""
    try:
        db = SessionLocal()

        pages = db.query(Page).all()
        users = {user.id: user.email for user in db.query(User).all()}

        result = []
        for page in pages:
            result.append({
                "page_id": page.fb_page_id,
                "page_name": page.page_name,
                "instagram_business_account_id": page.ig_business_id,
                "instagram_username": page.instagram_username,
                "user_email": users.get(page.user_id, "Unknown"),
                "created_at": page.created_at.isoformat() if page.created_at else None
            })

        db.close()
        return {
            "total_pages": len(result),
            "pages": result
        }

    except Exception as e:
        logger.error(f"Error listing pages: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """Verify the webhook signature from Facebook"""
    if not signature:
        logger.warning("No signature provided in webhook request")
        return False

    try:
        # Facebook sends signature as 'sha256=<hash>'
        if not signature.startswith('sha256='):
            logger.warning(f"Invalid signature format: {signature}")
            return False

        # Extract the hash part
        received_hash = signature[7:]  # Remove 'sha256=' prefix

        # Calculate expected hash
        app_secret = settings.FACEBOOK_APP_SECRET.encode('utf-8')
        expected_hash = hmac.new(app_secret, payload, hashlib.sha256).hexdigest()

        # Compare hashes securely
        is_valid = hmac.compare_digest(expected_hash, received_hash)

        if is_valid:
            logger.info("✅ Webhook signature verification successful")
        else:
            logger.warning("❌ Webhook signature verification failed")
            logger.warning(f"Expected: {expected_hash}")
            logger.warning(f"Received: {received_hash}")

        return is_valid

    except Exception as e:
        logger.error(f"Error verifying webhook signature: {e}")
        return False





@router.get("/")
async def verify_webhook(
    request: Request,
    hub_mode: str = Query(alias="hub.mode", default=None),
    hub_token: str = Query(alias="hub.verify_token", default=None),
    hub_challenge: str = Query(alias="hub.challenge", default=None)
):
    """Verify webhook subscription with Facebook"""
    # 🔍 WEBHOOK VERIFICATION REQUEST RECEIVED
    logger.info("🔍 WEBHOOK GET VERIFICATION REQUEST RECEIVED!")
    logger.info(f"📍 Request URL: {request.url}")
    logger.info(f"📋 Request method: {request.method}")
    logger.info(f"🔗 Request headers: {dict(request.headers)}")
    logger.info(f"📡 Remote IP: {request.client.host if request.client else 'Unknown'}")
    logger.info(f"🌐 User-Agent: {request.headers.get('user-agent', 'Not provided')}")
    logger.info(f"🔧 Hub mode: {hub_mode}")
    logger.info(f"🔑 Hub token: {hub_token}")
    logger.info(f"🎯 Hub challenge: {hub_challenge}")
    logger.info(f"✅ Expected token: {settings.WEBHOOK_VERIFY_TOKEN}")
    logger.info(f"🔍 Token match: {hub_token == settings.WEBHOOK_VERIFY_TOKEN}")

    if hub_mode == "subscribe" and hub_token == settings.WEBHOOK_VERIFY_TOKEN:
        logger.info("Webhook verified successfully")
        # Facebook sends challenge as string, return it as-is (not as int)
        return hub_challenge if hub_challenge else "0"
    else:
        logger.error(f"Webhook verification failed. Expected token: {settings.WEBHOOK_VERIFY_TOKEN}, Got: {hub_token}")
        # Return more detailed error for debugging
        return {
            "error": "Webhook verification failed",
            "expected_token": settings.WEBHOOK_VERIFY_TOKEN,
            "received_token": hub_token,
            "mode": hub_mode,
            "challenge": hub_challenge
        }

@router.post("/")
async def handle_webhook(
    request: Request,
    x_hub_signature_256: str = Header(None, alias="X-Hub-Signature-256")
):
    """Handle incoming Instagram messages with signature verification"""
    try:
        # 🚨 WEBHOOK RECEIVED - Log immediately when function is called
        logger.info("🚨 WEBHOOK POST REQUEST RECEIVED!")
        logger.info(f"📍 Request URL: {request.url}")
        logger.info(f"📋 Request method: {request.method}")
        logger.info(f"🔗 Request headers: {dict(request.headers)}")
        logger.info(f"🔐 X-Hub-Signature-256: {x_hub_signature_256}")
        logger.info(f"📊 Content-Type: {request.headers.get('content-type', 'Not provided')}")
        logger.info(f"🌐 User-Agent: {request.headers.get('user-agent', 'Not provided')}")
        logger.info(f"📡 Remote IP: {request.client.host if request.client else 'Unknown'}")

        # Get raw body for signature verification
        raw_body = await request.body()
        logger.info(f"📦 Raw body length: {len(raw_body)} bytes")

        # Verify webhook signature for security (if enabled)
        if settings.WEBHOOK_VERIFY_SIGNATURE:
            if not verify_webhook_signature(raw_body, x_hub_signature_256):
                logger.error("❌ Webhook signature verification failed - rejecting request")
                raise HTTPException(status_code=403, detail="Invalid signature")
        else:
            logger.info("ℹ️ Webhook signature verification disabled")

        # Parse JSON body
        body = json.loads(raw_body.decode('utf-8'))
        logger.info(f"📨 Webhook received: {json.dumps(body, indent=2)}")

        # Verify this is a page or instagram subscription
        webhook_object = body.get("object")
        logger.info(f"📄 Webhook object type: {webhook_object}")

        if webhook_object not in ["page", "instagram"]:
            logger.info(f"ℹ️ Ignoring webhook object type: {webhook_object}")
            return PlainTextResponse("EVENT_RECEIVED", status_code=200)

        # Process each entry
        for entry in body.get("entry", []):
            await process_webhook_entry(entry)

        return PlainTextResponse("EVENT_RECEIVED", status_code=200)

    except HTTPException:
        # Re-raise HTTP exceptions (like signature verification failure)
        raise
    except Exception as e:
        logger.error(f"❌ Webhook processing error: {e}")
        return {"status": "error", "message": str(e)}

# Add routes without trailing slash for Facebook compatibility
@router.get("")
async def verify_webhook_no_slash(
    request: Request,
    hub_mode: str = Query(alias="hub.mode", default=None),
    hub_token: str = Query(alias="hub.verify_token", default=None),
    hub_challenge: str = Query(alias="hub.challenge", default=None)
):
    """Verify webhook subscription with Facebook (no trailing slash)"""
    logger.info("🔍 WEBHOOK GET REQUEST (NO SLASH) - Redirecting to main handler")
    return await verify_webhook(request, hub_mode, hub_token, hub_challenge)

@router.post("")
async def handle_webhook_no_slash(
    request: Request,
    x_hub_signature_256: str = Header(None, alias="X-Hub-Signature-256")
):
    """Handle incoming Instagram messages (no trailing slash)"""
    logger.info("🚨 WEBHOOK POST REQUEST (NO SLASH) - Redirecting to main handler")
    return await handle_webhook(request, x_hub_signature_256)

async def process_webhook_entry(entry: dict):
    """Process a single webhook entry"""
    try:
        page_id = entry.get("id")
        messaging_events = entry.get("messaging", [])

        logger.info(f"Processing webhook entry - Page ID: {page_id}, Messaging events: {len(messaging_events)}")

        if not messaging_events:
            logger.info("No messaging events found in webhook entry")
            return
        
        # Get database session
        db = SessionLocal()
        
        try:
            # Find the page in our database
            # For Instagram webhooks, the ID is the Instagram Business ID, not Facebook Page ID
            page = db.query(Page).filter(Page.ig_business_id == page_id).first()
            if not page:
                logger.warning(f"Instagram Business Account {page_id} not found in database")
                # Also try Facebook Page ID as fallback
                page = db.query(Page).filter(Page.fb_page_id == page_id).first()
                if not page:
                    logger.warning(f"Page {page_id} not found in database (tried both IG Business ID and FB Page ID)")
                    return
            
            logger.info(f"Found page: {page.page_name} (ID: {page.id}) for Instagram Business ID: {page.ig_business_id}")

            # Get the user
            user = db.query(User).filter(User.id == page.user_id).first()
            if not user:
                logger.warning(f"User for page {page_id} not found")
                return

            logger.info(f"Found user: {user.name} (ID: {user.id})")
            
            # Process each messaging event
            for messaging_event in messaging_events:
                await process_message_event(db, user, page, messaging_event)
                
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error processing webhook entry: {e}")

async def process_message_event(db: Session, user: User, page: Page, messaging_event: dict):
    """Process a single message event"""
    try:
        # Check if this is an incoming message
        message_data = messaging_event.get("message")
        if not message_data:
            return
        
        sender = messaging_event.get("sender", {})
        recipient = messaging_event.get("recipient", {})
        timestamp = messaging_event.get("timestamp")

        sender_id = sender.get("id")
        recipient_id = recipient.get("id")
        message_id = message_data.get("mid")
        message_text = message_data.get("text", "")
        is_echo = message_data.get("is_echo", False)

        logger.info(f"Processing message from {sender_id} to {recipient_id}")

        if not sender_id or not message_id or not message_text:
            logger.warning(f"Incomplete message data - Sender ID: {sender_id}, Message ID: {message_id}, Text: '{message_text}'")
            return

        # IMPORTANT: Check for echo messages first (Instagram's built-in echo detection)
        if is_echo:
            logger.info(f"Ignoring echo message (is_echo=true): '{message_text}'")
            return

        # IMPORTANT: Ignore messages sent by our own bot
        # When we send a message, Instagram sends it back to our webhook with sender_id = our Instagram Business ID
        if sender_id == page.ig_business_id:
            logger.info(f"Ignoring message sent by our own bot (sender_id {sender_id} matches our IG Business ID {page.ig_business_id})")
            return

        # Also check if sender_id matches recipient_id (another way to detect bot messages)
        if sender_id == recipient_id:
            logger.info(f"Ignoring message where sender equals recipient (likely bot message): {sender_id}")
            return

        # Check if we've already processed this message
        existing_message = db.query(Message).filter(
            Message.ig_message_id == message_id
        ).first()

        if existing_message:
            logger.info(f"Message {message_id} already processed")
            return

        # Enhanced safety check: See if this message text matches any recent response we sent
        # This catches cases where the bot message detection above might miss something
        from datetime import timedelta
        recent_cutoff = datetime.utcnow() - timedelta(minutes=10)  # Extended to 10 minutes for better coverage

        # FIXED: Check for exact match with recent responses FROM THE SAME INSTAGRAM ACCOUNT
        # This prevents cross-account message filtering when user has multiple IG accounts
        recent_response = db.query(Message).filter(
            Message.user_id == user.id,
            Message.ig_user_id == sender_id,  # IMPORTANT: Only check responses to the SAME sender
            Message.response_text == message_text,
            Message.reply_sent_at >= recent_cutoff
        ).first()

        if recent_response:
            logger.info(f"Ignoring message that exactly matches our recent response to same sender: '{message_text}' (sent at {recent_response.reply_sent_at})")
            return

        # FIXED: Additional check for similar responses - only from the SAME INSTAGRAM ACCOUNT
        # This prevents filtering legitimate messages between different IG accounts owned by same user
        recent_responses = db.query(Message).filter(
            Message.user_id == user.id,
            Message.ig_user_id == sender_id,  # IMPORTANT: Only check responses to the SAME sender
            Message.response_text.isnot(None),
            Message.reply_sent_at >= recent_cutoff
        ).all()

        for response in recent_responses:
            # Check if the incoming message text is very similar to any recent response
            # Using simple string similarity (could be enhanced with fuzzy matching if needed)
            if response.response_text and len(message_text) > 10:  # Only check for longer messages
                # Check if message text is contained in response or vice versa (with some tolerance)
                if (message_text.lower().strip() in response.response_text.lower().strip() or
                    response.response_text.lower().strip() in message_text.lower().strip()):
                    logger.info(f"Ignoring message that appears to be our recent response to same sender (similarity check): '{message_text}' vs recent response: '{response.response_text}'")
                    return
        
        # Create message record - explicitly mark as incoming message
        message_record = Message(
            user_id=user.id,
            ig_user_id=sender_id,
            ig_message_id=message_id,
            message_text=message_text,
            is_incoming=True,  # Explicitly mark as incoming message from customer
            created_at=datetime.fromtimestamp(timestamp / 1000) if timestamp else datetime.utcnow()
        )
        
        # Check user access to auto-reply features
        from app.services.user_management_service import UserManagementService
        user_service = UserManagementService(db)
        access_info = user_service.check_user_access(user.id)

        if not access_info.get("has_access", False):
            logger.warning(f"User {user.name} (ID: {user.id}) doesn't have access to auto-reply features. Reason: {access_info.get('reason', 'Unknown')}")
            # Still save the message but don't send auto-reply
            db.add(message_record)
            db.commit()
            return

        logger.info(f"User {user.name} has access to auto-reply features. Reason: {access_info.get('reason', 'Unknown')}")

        # Check if user has any FAQs
        from app.models.faq import FAQ
        faq_count = db.query(FAQ).filter(FAQ.user_id == user.id, FAQ.is_active == True).count()
        logger.info(f"User has {faq_count} active FAQs")

        # Find smart response (FAQ matching + AI fallback)
        logger.info(f"Looking for smart response for message: '{message_text}'")
        faq_service = FAQService()
        response_text = await faq_service.find_smart_response(db, user.id, message_text)
        logger.info(f"Smart response generated: '{response_text}'")

        if response_text:
            # Try to find FAQ match for logging
            faq_match = await faq_service.find_matching_faq(db, user.id, message_text)

            # Send reply via Instagram
            instagram_service = InstagramService()

            try:
                page_access_token = decrypt_token(page.page_access_token)
                logger.info("✅ Successfully decrypted page access token")
            except Exception as e:
                logger.error(f"Failed to decrypt page access token: {e}")
                logger.info("🔄 Attempting to get fresh page token...")

                try:
                    # Try to get fresh page token using user token
                    user_access_token = decrypt_token(user.access_token)
                    from app.services.facebook_service import FacebookService
                    facebook_service = FacebookService()

                    page_token_data = await facebook_service.get_page_access_token(
                        page.fb_page_id, user_access_token
                    )

                    if page_token_data and page_token_data.get("access_token"):
                        fresh_page_token = page_token_data["access_token"]
                        page.page_access_token = encrypt_token(fresh_page_token)
                        db.commit()
                        page_access_token = fresh_page_token
                        logger.info("✅ Got fresh page token successfully")
                    else:
                        logger.error("❌ Failed to get fresh page token")
                        return

                except Exception as token_error:
                    logger.error(f"❌ Failed to get fresh token: {token_error}")
                    return

            logger.info(f"Attempting to send auto-reply to sender_id: {sender_id}")
            logger.info(f"Using Instagram Business ID: {page.ig_business_id}")
            logger.info(f"Response text: {response_text}")

            success = await instagram_service.send_message(
                page.ig_business_id,
                sender_id,
                response_text,
                page_access_token
            )

            # If failed, try getting fresh page token and retry once
            if not success:
                logger.info("First attempt failed, trying to get fresh page token and retry...")
                try:
                    user_access_token = decrypt_token(user.access_token)
                    from app.services.facebook_service import FacebookService
                    facebook_service = FacebookService()

                    # Get fresh page token
                    page_token_data = await facebook_service.get_page_access_token(
                        page.fb_page_id, user_access_token
                    )

                    if page_token_data and page_token_data.get("access_token"):
                        fresh_page_token = page_token_data["access_token"]

                        # Retry with fresh page token
                        success = await instagram_service.send_message(
                            page.ig_business_id,
                            sender_id,
                            response_text,
                            fresh_page_token
                        )

                        if success:
                            # Update stored token if retry succeeded
                            page.page_access_token = encrypt_token(fresh_page_token)
                            db.commit()
                            logger.info("✅ Retry with fresh page token succeeded")
                        else:
                            logger.error("❌ Retry with fresh page token also failed")
                    else:
                        logger.error("❌ Failed to get fresh page token for retry")

                except Exception as retry_error:
                    logger.error(f"Token refresh retry failed: {retry_error}")

            if success:
                if faq_match:
                    message_record.matched_faq_id = faq_match.faq_id
                    message_record.similarity_score = faq_match.similarity_score
                message_record.response_text = response_text
                message_record.auto_replied = True
                message_record.reply_sent_at = datetime.utcnow()

                logger.info(f"Smart auto-reply sent to {sender_id} for message {message_id}")
            else:
                logger.error(f"Failed to send auto-reply to {sender_id}")
        else:
            logger.info(f"No response generated for message: {message_text}")
        
        # Save message record
        logger.info(f"Saving message record to database")
        db.add(message_record)
        db.commit()
        logger.info(f"Message record saved successfully")

        # Broadcast to live monitoring (for Facebook reviewers)
        try:
            from app.api.api_v1.endpoints.live_messages import broadcast_new_message
            await broadcast_new_message({
                "id": message_record.id,
                "timestamp": message_record.created_at.isoformat(),
                "page_name": page.page_name,
                "instagram_username": page.instagram_username or "Unknown",
                "customer_message": message_text,
                "our_response": response_text,
                "auto_replied": success,
                "reply_sent_at": message_record.reply_sent_at.isoformat() if message_record.reply_sent_at else None,
                "similarity_score": message_record.similarity_score,
                "ig_user_id": sender_id,
                "status": "✅ Sent" if success else "❌ Failed" if response_text else "⏳ Processing"
            })
        except Exception as e:
            logger.error(f"Failed to broadcast message update: {e}")
        
    except Exception as e:
        logger.error(f"Error processing message event: {e}")
        logger.error(f"Exception type: {type(e).__name__}")
        logger.error(f"Exception details: {str(e)}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        db.rollback()
