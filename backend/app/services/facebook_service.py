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
        """Get user's Facebook pages using two-step approach to avoid business_management dependency"""
        # Step 1: Get basic page info without Instagram data (only requires pages_show_list)
        url = f"{self.graph_url}/me/accounts"
        params = {
            "access_token": access_token,
            "fields": "id,name,access_token,category,tasks"  # Removed instagram_business_account to avoid business_management requirement
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
            basic_pages = data.get("data", [])
            logger.info(f"Found {len(basic_pages)} pages from Facebook API (Step 1)")

            if len(basic_pages) == 0:
                logger.warning("⚠️  No Facebook pages found for this user")
                logger.info("💡 Possible reasons:")
                logger.info("   1. User doesn't have any Facebook Pages")
                logger.info("   2. User is not admin of any Pages")
                logger.info("   3. Pages are not published/active")
                logger.info("   4. Missing 'pages_show_list' permission")
                return []

            # Step 2: Get Instagram Business Account data for each page
            logger.info("📄 Step 2: Fetching Instagram data for each page...")
            enhanced_pages = []

            for page in basic_pages:
                page_id = page.get("id")
                page_name = page.get("name", "Unknown")
                page_access_token = page.get("access_token")

                if not page_access_token:
                    logger.warning(f"No page access token for {page_name}")
                    enhanced_pages.append(page)
                    continue

                # Get Instagram Business Account for this page using page token
                try:
                    ig_response = await client.get(
                        f"{self.graph_url}/{page_id}",
                        params={
                            "access_token": page_access_token,
                            "fields": "instagram_business_account{id,username,name,profile_picture_url,followers_count}"
                        }
                    )

                    if ig_response.status_code == 200:
                        ig_data = ig_response.json()
                        instagram_account = ig_data.get("instagram_business_account")

                        if instagram_account:
                            page["instagram_business_account"] = instagram_account
                            ig_username = instagram_account.get("username", "Unknown")
                            ig_followers = instagram_account.get("followers_count", "Unknown")
                            logger.info(f"   • {page_name} → @{ig_username} ({ig_followers} followers)")
                        else:
                            logger.info(f"   • {page_name} (No Instagram connected)")
                    else:
                        logger.warning(f"Could not fetch Instagram data for {page_name}: {ig_response.status_code}")
                        logger.info(f"   • {page_name} (Instagram fetch failed)")

                except Exception as e:
                    logger.error(f"Error fetching Instagram data for {page_name}: {e}")
                    logger.info(f"   • {page_name} (Instagram error)")

                enhanced_pages.append(page)

            logger.info(f"✅ Two-step page fetch completed: {len(enhanced_pages)} pages processed")
            return enhanced_pages

    async def get_instagram_business_account(self, page_id: str, page_access_token: str, user_access_token: str = None) -> Optional[Dict]:
        """Get Instagram Business Account connected to a Facebook page"""
        try:
            # Try with page access token first
            async with httpx.AsyncClient() as client:
                # First attempt: Use page access token
                response = await client.get(
                    f"{self.graph_url}/{page_id}",
                    params={
                        "access_token": page_access_token,
                        "fields": "instagram_business_account{id,username,name,profile_picture_url,followers_count}"
                    }
                )

                if response.status_code == 200:
                    data = response.json()
                    ig_account = data.get("instagram_business_account")
                    if ig_account:
                        logger.info(f"✅ Found Instagram Business Account for page {page_id}: {ig_account.get('username', 'Unknown')}")
                        return ig_account

                # Second attempt: Use user access token if page token failed
                if user_access_token and response.status_code != 200:
                    logger.info(f"Retrying Instagram fetch for page {page_id} with user access token...")
                    response = await client.get(
                        f"{self.graph_url}/{page_id}",
                        params={
                            "access_token": user_access_token,
                            "fields": "instagram_business_account{id,username,name,profile_picture_url,followers_count}"
                        }
                    )

                    if response.status_code == 200:
                        data = response.json()
                        ig_account = data.get("instagram_business_account")
                        if ig_account:
                            logger.info(f"✅ Found Instagram Business Account for page {page_id} with user token: {ig_account.get('username', 'Unknown')}")
                            return ig_account

                # Log the error details for debugging
                logger.warning(f"Could not fetch Instagram Business Account for page {page_id}: {response.status_code}")
                if response.status_code != 200:
                    try:
                        error_data = response.json()
                        logger.warning(f"Error details: {error_data}")
                    except:
                        logger.warning(f"Error response: {response.text}")

                return None

        except Exception as e:
            logger.warning(f"Error fetching Instagram Business Account for page {page_id}: {str(e)}")
            return None

    async def get_instagram_account_info(self, ig_business_id: str, access_token: str) -> Dict:
        """Get Instagram account information"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.graph_url}/{ig_business_id}",
                    params={
                        "access_token": access_token,
                        "fields": "id,username,name,profile_picture_url"
                    }
                )

                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"Could not fetch Instagram account info for {ig_business_id}: {response.status_code}")
                    return {}

        except Exception as e:
            logger.warning(f"Error fetching Instagram account info for {ig_business_id}: {str(e)}")
            return {}

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
