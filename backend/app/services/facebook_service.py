import httpx
from typing import Dict, List, Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

class FacebookService:
    def __init__(self):
        self.graph_url = settings.FACEBOOK_GRAPH_URL
        self.app_id = settings.FACEBOOK_APP_ID
        self.app_secret = settings.FACEBOOK_APP_SECRET

    async def get_user_info(self, access_token: str) -> Dict:
        """Get user information from Facebook"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/me",
                params={
                    "access_token": access_token,
                    "fields": "id,name,email"
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_user_pages(self, access_token: str) -> List[Dict]:
        """Get user's Facebook pages"""
        url = f"{self.graph_url}/me/accounts"
        params = {
            "access_token": access_token,
            "fields": "id,name,access_token,instagram_business_account"
        }

        logger.info(f"Fetching pages from: {url}")
        logger.info(f"Using Graph API version: {self.graph_url}")

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            logger.info(f"Facebook API response status: {response.status_code}")

            if response.status_code != 200:
                logger.error(f"Facebook API error: {response.text}")
                response.raise_for_status()

            data = response.json()
            pages = data.get("data", [])
            logger.info(f"Found {len(pages)} pages from Facebook API")

            for page in pages:
                logger.info(f"Page: {page.get('name')} - Has Instagram: {bool(page.get('instagram_business_account'))}")

            return pages

    async def get_instagram_business_account(self, page_id: str, page_access_token: str) -> Optional[Dict]:
        """Get Instagram Business Account connected to a Facebook page"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/{page_id}",
                params={
                    "access_token": page_access_token,
                    "fields": "instagram_business_account"
                }
            )
            response.raise_for_status()
            data = response.json()
            return data.get("instagram_business_account")

    async def get_instagram_account_info(self, ig_business_id: str, access_token: str) -> Dict:
        """Get Instagram account information"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/{ig_business_id}",
                params={
                    "access_token": access_token,
                    "fields": "id,username,name,profile_picture_url"
                }
            )
            response.raise_for_status()
            return response.json()

    async def subscribe_to_webhooks(self, page_id: str, page_access_token: str) -> bool:
        """Subscribe page to Instagram messaging webhooks"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.graph_url}/{page_id}/subscribed_apps",
                data={
                    "access_token": page_access_token,
                    "subscribed_fields": "messages,messaging_postbacks"
                }
            )
            return response.status_code == 200

    async def exchange_code_for_token(self, code: str, redirect_uri: str) -> Dict:
        """Exchange authorization code for access token"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/oauth/access_token",
                params={
                    "client_id": self.app_id,
                    "client_secret": self.app_secret,
                    "redirect_uri": redirect_uri,
                    "code": code
                }
            )
            response.raise_for_status()
            return response.json()

    def get_login_url(self, redirect_uri: str, state: str = None) -> str:
        """Generate Facebook OAuth login URL"""
        params = {
            "client_id": self.app_id,
            "redirect_uri": redirect_uri,
            "scope": "pages_show_list,pages_messaging,instagram_basic,instagram_manage_messages,pages_read_engagement",
            "response_type": "code"
        }
        if state:
            params["state"] = state
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{settings.FACEBOOK_OAUTH_URL}?{query_string}"
