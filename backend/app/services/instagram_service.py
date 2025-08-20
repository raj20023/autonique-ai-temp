import httpx
from typing import Dict, Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

class InstagramService:
    def __init__(self):
        self.graph_url = settings.FACEBOOK_GRAPH_URL

    async def send_message(self, ig_business_id: str, recipient_id: str, message_text: str, access_token: str) -> bool:
        """Send a message via Instagram Messaging API"""
        try:
            url = f"{self.graph_url}/{ig_business_id}/messages"
            payload = {
                "recipient": {"id": recipient_id},
                "message": {"text": message_text}
            }

            logger.info(f"Attempting to send message to {recipient_id}")
            logger.info(f"URL: {url}")
            logger.info(f"Instagram Business ID: {ig_business_id}")
            logger.info(f"Message: {message_text}")

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    json=payload,
                    params={"access_token": access_token}
                )

                logger.info(f"Instagram API response status: {response.status_code}")
                logger.info(f"Instagram API response: {response.text}")

                if response.status_code == 200:
                    logger.info(f"Message sent successfully to {recipient_id}")
                    return True
                else:
                    logger.error(f"Failed to send message - Status: {response.status_code}")
                    logger.error(f"Error response: {response.text}")

                    # Parse error for common issues
                    try:
                        error_data = response.json()
                        if "error" in error_data:
                            error_msg = error_data["error"].get("message", "Unknown error")
                            error_code = error_data["error"].get("code", "Unknown code")
                            logger.error(f"Instagram API Error - Code: {error_code}, Message: {error_msg}")
                    except:
                        pass

                    return False

        except Exception as e:
            logger.error(f"Exception sending Instagram message: {e}")
            return False

    async def get_message_details(self, message_id: str, access_token: str) -> Optional[Dict]:
        """Get details of a specific message"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.graph_url}/{message_id}",
                    params={
                        "access_token": access_token,
                        "fields": "id,created_time,from,to,message"
                    }
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Failed to get message details: {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error getting message details: {e}")
            return None

    async def mark_message_as_read(self, ig_business_id: str, message_id: str, access_token: str) -> bool:
        """Mark a message as read"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.graph_url}/{ig_business_id}/messages",
                    json={
                        "recipient": {"id": message_id},
                        "sender_action": "mark_seen"
                    },
                    params={"access_token": access_token}
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error marking message as read: {e}")
            return False

    def extract_message_data(self, webhook_data: Dict) -> Optional[Dict]:
        """Extract message data from webhook payload"""
        try:
            entry = webhook_data.get("entry", [{}])[0]
            messaging = entry.get("messaging", [{}])[0]
            
            if "message" not in messaging:
                return None
                
            message = messaging["message"]
            sender = messaging["sender"]
            recipient = messaging["recipient"]
            
            return {
                "message_id": message.get("mid"),
                "sender_id": sender.get("id"),
                "recipient_id": recipient.get("id"),
                "message_text": message.get("text", ""),
                "timestamp": messaging.get("timestamp")
            }
            
        except Exception as e:
            logger.error(f"Error extracting message data: {e}")
            return None
