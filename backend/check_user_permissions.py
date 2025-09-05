#!/usr/bin/env python3
"""
Check user permissions for webhook functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
import httpx
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.page import Page
from app.core.security import decrypt_token
from app.config.facebook import facebook_config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_user_permissions():
    """Check if user has all required permissions for webhook functionality"""
    
    print("🔍 CHECKING USER PERMISSIONS FOR WEBHOOK FUNCTIONALITY")
    print("=" * 60)
    
    db = SessionLocal()
    try:
        # Find the user (assuming there's only one user for now)
        user = db.query(User).first()
        if not user:
            print("❌ No user found in database")
            return
        
        print(f"👤 User: {user.name} ({user.email})")
        
        # Get user access token
        try:
            user_access_token = decrypt_token(user.access_token)
            print("✅ Successfully decrypted user access token")
        except Exception as e:
            print(f"❌ Failed to decrypt user access token: {e}")
            return
        
        # Check user permissions
        async with httpx.AsyncClient() as client:
            print("\n🔍 Checking user permissions...")
            
            # Get user permissions
            response = await client.get(
                "https://graph.facebook.com/v23.0/me/permissions",
                params={"access_token": user_access_token}
            )
            
            if response.status_code == 200:
                permissions_data = response.json()
                granted_permissions = []
                
                for perm in permissions_data.get("data", []):
                    if perm.get("status") == "granted":
                        granted_permissions.append(perm.get("permission"))
                
                print(f"✅ Successfully retrieved user permissions")
                print(f"📊 Total granted permissions: {len(granted_permissions)}")
                
                # Check required permissions
                print(f"\n📋 Required permissions check:")
                required_permissions = facebook_config.REQUIRED_PERMISSIONS
                missing_permissions = []
                
                for perm in required_permissions:
                    if perm in granted_permissions:
                        print(f"✅ {perm}: GRANTED")
                    else:
                        print(f"❌ {perm}: MISSING")
                        missing_permissions.append(perm)
                
                # Check for pages_read_engagement (should NOT be present)
                if "pages_read_engagement" in granted_permissions:
                    print(f"⚠️ pages_read_engagement: GRANTED (not needed, but present)")
                else:
                    print(f"✅ pages_read_engagement: NOT GRANTED (correct - not needed)")
                
                print(f"\n📊 Permission Summary:")
                print(f"✅ Required permissions granted: {len(required_permissions) - len(missing_permissions)}/{len(required_permissions)}")
                print(f"❌ Missing permissions: {len(missing_permissions)}")
                
                if missing_permissions:
                    print(f"\n🚨 MISSING PERMISSIONS:")
                    for perm in missing_permissions:
                        print(f"   - {perm}: {facebook_config.PERMISSION_DESCRIPTIONS.get(perm, 'No description')}")
                    
                    print(f"\n🔧 To fix missing permissions:")
                    print(f"1. User needs to re-authenticate with OAuth")
                    print(f"2. Ensure all required permissions are requested in OAuth scope")
                    print(f"3. User must grant all permissions during OAuth flow")
                else:
                    print(f"\n🎉 ALL REQUIRED PERMISSIONS ARE GRANTED!")
                
                # Check page access tokens
                print(f"\n🔍 Checking page access tokens...")
                pages = db.query(Page).filter(Page.user_id == user.id).all()
                
                for page in pages:
                    print(f"\n📄 Page: {page.page_name}")
                    print(f"   FB Page ID: {page.fb_page_id}")
                    print(f"   IG Business ID: {page.ig_business_id}")
                    print(f"   Webhook Status: {page.webhook_subscribed}")
                    
                    try:
                        page_access_token = decrypt_token(page.page_access_token)
                        
                        # Test page access token
                        page_response = await client.get(
                            f"https://graph.facebook.com/v23.0/{page.fb_page_id}",
                            params={
                                "access_token": page_access_token,
                                "fields": "id,name,access_token"
                            }
                        )
                        
                        if page_response.status_code == 200:
                            print(f"   ✅ Page access token: VALID")
                        else:
                            print(f"   ❌ Page access token: INVALID ({page_response.status_code})")
                            print(f"   Error: {page_response.text}")
                            
                    except Exception as e:
                        print(f"   ❌ Page access token: ERROR - {e}")
                
                # Final recommendation
                print(f"\n🎯 RECOMMENDATIONS:")
                if missing_permissions:
                    print(f"1. ❌ User needs to re-authenticate to grant missing permissions")
                    print(f"2. 🔧 Update OAuth scope if needed")
                    print(f"3. 🔄 Re-run webhook subscription after re-authentication")
                else:
                    print(f"1. ✅ All permissions are granted")
                    print(f"2. 🔧 Check webhook subscription status")
                    print(f"3. 🧪 Test webhook delivery with Facebook's 'Send Test'")
                
            else:
                print(f"❌ Failed to get user permissions: {response.status_code}")
                print(f"Response: {response.text}")
                
    except Exception as e:
        print(f"❌ Error checking permissions: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(check_user_permissions())
