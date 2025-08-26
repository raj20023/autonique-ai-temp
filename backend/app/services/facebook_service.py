import httpx
from typing import Dict, List, Optional
import logging

from app.core.config import settings
from app.config.facebook import facebook_config

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
            "fields": "id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count},category,tasks"
        }

        logger.info(f"Fetching pages from: {url}")
        logger.info(f"Using Graph API version: {self.graph_url}")

        async with httpx.AsyncClient() as client:
            # First, check user permissions
            try:
                permissions_response = await client.get(
                    f"{self.graph_url}/me/permissions",
                    params={"access_token": access_token}
                )
                if permissions_response.status_code == 200:
                    permissions_data = permissions_response.json()
                    granted_perms = [p["permission"] for p in permissions_data.get("data", []) if p.get("status") == "granted"]
                    logger.info(f"✅ Granted permissions: {granted_perms}")

                    # Check if we have the required permissions
                    missing_perms = facebook_config.get_missing_permissions(granted_perms)
                    if missing_perms:
                        logger.warning(f"⚠️  Missing permissions: {missing_perms}")
                        logger.info("💡 To fix this:")
                        logger.info("   1. Visit: https://autonique.in/permission-reset")
                        logger.info("   2. Or go to Facebook Settings > Apps and remove AutoniqueAI")
                        logger.info("   3. Then log in again to grant new permissions")
                    else:
                        logger.info("✅ All required permissions granted")

            except Exception as e:
                logger.warning(f"Could not check permissions: {e}")

            # Fetch pages
            response = await client.get(url, params=params)
            logger.info(f"Facebook API response status: {response.status_code}")

            if response.status_code != 200:
                logger.error(f"Facebook API error: {response.text}")
                response.raise_for_status()

            data = response.json()
            pages = data.get("data", [])
            logger.info(f"Found {len(pages)} pages from Facebook API")

            if len(pages) == 0:
                logger.warning("⚠️  No Facebook pages found for this user")
                logger.info("💡 Possible reasons:")
                logger.info("   1. User doesn't have any Facebook Pages")
                logger.info("   2. User is not admin of any Pages")
                logger.info("   3. Pages are not published/active")
                logger.info("   4. Missing 'pages_show_list' permission")
            else:
                logger.info(f"📄 Pages found:")
                for page in pages:
                    page_name = page.get('name', 'Unknown')
                    ig_account = page.get('instagram_business_account')
                    if ig_account:
                        ig_username = ig_account.get('username', 'Unknown')
                        ig_followers = ig_account.get('followers_count', 'Unknown')
                        logger.info(f"   • {page_name} → @{ig_username} ({ig_followers} followers)")
                    else:
                        logger.info(f"   • {page_name} (No Instagram connected)")

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
            "scope": facebook_config.OAUTH_SCOPE,
            **facebook_config.OAUTH_PARAMS
        }
        if state:
            params["state"] = state

        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{settings.FACEBOOK_OAUTH_URL}?{query_string}"

    async def exchange_for_long_lived_token(self, short_lived_token: str) -> Dict:
        """Exchange short-lived token for long-lived token"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/oauth/access_token",
                params={
                    "grant_type": "fb_exchange_token",
                    "client_id": self.app_id,
                    "client_secret": self.app_secret,
                    "fb_exchange_token": short_lived_token
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_user_permissions(self, access_token: str) -> Dict:
        """Get permissions granted to the access token"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/me/permissions",
                params={"access_token": access_token}
            )
            response.raise_for_status()
            return response.json()

    async def get_user_info(self, access_token: str) -> Dict:
        """Get basic user info to validate token"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.graph_url}/me",
                    params={
                        "access_token": access_token,
                        "fields": "id,name"
                    }
                )
                response.raise_for_status()
                return response.json()
        except Exception:
            return None

    async def get_instagram_account_info(self, ig_business_id: str, access_token: str) -> Dict:
        """Get Instagram business account information"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.graph_url}/{ig_business_id}",
                params={
                    "fields": "username,name,profile_picture_url,followers_count",
                    "access_token": access_token
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_page_access_token(self, page_id: str, user_access_token: str) -> Optional[Dict]:
        """Get page access token for a specific page"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.graph_url}/{page_id}",
                    params={
                        "fields": "access_token",
                        "access_token": user_access_token
                    }
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Failed to get page access token for {page_id}: {e}")
            return None
