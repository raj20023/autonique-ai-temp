#!/usr/bin/env python3
"""
Quick script to check current user permissions and webhook subscription status
"""
import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.page import Page
from app.core.security import decrypt_token
from app.core.config import settings
import requests
import json

async def check_permissions():
    """Check current user permissions and webhook status"""
    db = SessionLocal()
    
    try:
        # Get the test user
        user = db.query(User).filter(User.email == "rajpatel2003.rp@gmail.com").first()
        if not user:
            print("❌ Test user not found")
            return
            
        print(f"✅ Found user: {user.email}")
        
        # Decrypt access token
        try:
            access_token = decrypt_token(user.access_token)
            print("✅ Access token decrypted successfully")
        except Exception as e:
            print(f"❌ Failed to decrypt access token: {e}")
            return
            
        # Check user permissions
        print("\n🔍 Checking user permissions...")
        permissions_url = f"https://graph.facebook.com/v23.0/me/permissions?access_token={access_token}"
        
        try:
            response = requests.get(permissions_url)
            if response.status_code == 200:
                permissions_data = response.json()
                granted_permissions = [p['permission'] for p in permissions_data.get('data', []) if p.get('status') == 'granted']
                
                print(f"✅ Current granted permissions: {granted_permissions}")
                
                # Check if pages_read_engagement is still present
                if 'pages_read_engagement' in granted_permissions:
                    print("⚠️  WARNING: pages_read_engagement is still granted - user needs to re-authenticate")
                else:
                    print("✅ pages_read_engagement has been removed")
                    
                # Check required permissions
                required_permissions = [
                    'pages_messaging',
                    'instagram_basic', 
                    'instagram_manage_messages',
                    'pages_show_list',
                    'business_management',
                    'pages_manage_metadata'
                ]
                
                missing_permissions = [p for p in required_permissions if p not in granted_permissions]
                if missing_permissions:
                    print(f"❌ Missing required permissions: {missing_permissions}")
                else:
                    print("✅ All required permissions are granted")
                    
            else:
                print(f"❌ Failed to get permissions: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Error checking permissions: {e}")
            
        # Check connected pages
        print("\n🔍 Checking connected pages...")
        pages = db.query(Page).filter(Page.user_id == user.id).all()
        
        for page in pages:
            print(f"\n📄 Page: {page.name} (ID: {page.page_id})")
            print(f"   Instagram ID: {page.instagram_business_account_id}")
            
            # Check webhook subscription
            try:
                page_token = decrypt_token(page.access_token)
                webhook_url = f"https://graph.facebook.com/v23.0/{page.page_id}/subscribed_apps?access_token={page_token}"
                
                webhook_response = requests.get(webhook_url)
                if webhook_response.status_code == 200:
                    webhook_data = webhook_response.json()
                    subscribed_apps = webhook_data.get('data', [])
                    
                    our_app_subscribed = any(app.get('id') == settings.FACEBOOK_APP_ID for app in subscribed_apps)
                    
                    if our_app_subscribed:
                        print("   ✅ Webhook subscription active")
                    else:
                        print("   ❌ Webhook subscription missing")
                        print(f"   📋 Subscribed apps: {[app.get('id') for app in subscribed_apps]}")
                else:
                    print(f"   ❌ Failed to check webhook subscription: {webhook_response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ Error checking webhook subscription: {e}")
                
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(check_permissions())
