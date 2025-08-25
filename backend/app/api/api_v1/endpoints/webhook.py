from fastapi import APIRouter, Request, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import json

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.models.user import User
from app.models.page import Page
from app.models.message import Message
from app.services.instagram_service import InstagramService
from app.services.faq_service import FAQService
from app.services.gemini_service import GeminiService
from app.core.security import decrypt_token

router = APIRouter()
logger = logging.getLogger(__name__)



@router.get("/")
async def verify_webhook(
    request: Request,
    hub_mode: str = Query(alias="hub.mode", default=None),
    hub_token: str = Query(alias="hub.verify_token", default=None),
    hub_challenge: str = Query(alias="hub.challenge", default=None)
):
    """Verify webhook subscription with Facebook"""
    logger.info(f"Webhook verification request: mode={hub_mode}, token={hub_token}, challenge={hub_challenge}")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Expected token: {settings.WEBHOOK_VERIFY_TOKEN}")
    logger.info(f"Token match: {hub_token == settings.WEBHOOK_VERIFY_TOKEN}")

    if hub_mode == "subscribe" and hub_token == settings.WEBHOOK_VERIFY_TOKEN:
        logger.info("Webhook verified successfully")
        return int(hub_challenge) if hub_challenge else 0
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
async def handle_webhook(request: Request):
    """Handle incoming Instagram messages"""
    try:
        body = await request.json()
        logger.info(f"Webhook received: {json.dumps(body, indent=2)}")
        
        # Verify this is a page or instagram subscription
        webhook_object = body.get("object")
        logger.info(f"Webhook object type: {webhook_object}")

        if webhook_object not in ["page", "instagram"]:
            logger.info(f"Ignoring webhook object type: {webhook_object}")
            return {"status": "ok"}
        
        # Process each entry
        for entry in body.get("entry", []):
            await process_webhook_entry(entry)
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
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
    return await verify_webhook(request, hub_mode, hub_token, hub_challenge)

@router.post("")
async def handle_webhook_no_slash(request: Request):
    """Handle incoming Instagram messages (no trailing slash)"""
    return await handle_webhook(request)

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

        logger.info(f"Processing message - Sender ID: {sender_id}, Recipient ID: {recipient_id}, Message ID: {message_id}, Text: {message_text}")
        logger.info(f"Page Instagram Business ID: {page.ig_business_id}")
        logger.info(f"User: {user.name} (ID: {user.id}) - Page: {page.page_name} (@{page.instagram_username})")

        if not sender_id or not message_id or not message_text:
            logger.warning(f"Incomplete message data - Sender ID: {sender_id}, Message ID: {message_id}, Text: '{message_text}'")
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
            except Exception as e:
                logger.error(f"Failed to decrypt page access token: {e}")
                logger.error("User needs to logout and login again to refresh tokens")
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

            # If failed, try refreshing token and retry once
            if not success:
                logger.info("First attempt failed, trying to refresh token and retry...")
                try:
                    from app.services.facebook_service import FacebookService
                    facebook_service = FacebookService()
                    user_access_token = decrypt_token(user.access_token)
                    fresh_token_data = await facebook_service.exchange_for_long_lived_token(user_access_token)
                    fresh_page_token = fresh_token_data["access_token"]

                    # Retry with fresh token
                    success = await instagram_service.send_message(
                        page.ig_business_id,
                        sender_id,
                        response_text,
                        fresh_page_token
                    )

                    if success:
                        # Update stored token if retry succeeded
                        from app.core.security import encrypt_token
                        page.page_access_token = encrypt_token(fresh_page_token)
                        db.commit()
                        logger.info("Retry with fresh token succeeded")
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
