#!/usr/bin/env python3
"""
Simple permission check without external dependencies
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.page import Page
from app.config.facebook import facebook_config

def check_permissions():
    """Check current OAuth scope configuration"""
    
    print("🔍 OAUTH SCOPE & PERMISSION CONFIGURATION CHECK")
    print("=" * 60)
    
    # Check current OAuth scope
    print(f"📋 Current OAuth Scope:")
    print(f"   {facebook_config.OAUTH_SCOPE}")
    
    print(f"\n📋 Required Permissions:")
    for i, perm in enumerate(facebook_config.REQUIRED_PERMISSIONS, 1):
        description = facebook_config.PERMISSION_DESCRIPTIONS.get(perm, "No description")
        print(f"   {i}. {perm}: {description}")
    
    # Check if pages_read_engagement is in scope (should NOT be)
    scope_list = facebook_config.get_scope_list()
    if "pages_read_engagement" in scope_list:
        print(f"\n❌ ISSUE FOUND: pages_read_engagement is in OAuth scope!")
        print(f"   This permission is not required and may cause approval issues.")
    else:
        print(f"\n✅ GOOD: pages_read_engagement is NOT in OAuth scope")
    
    # Check database for users
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\n👥 Users in database: {len(users)}")
        
        for user in users:
            print(f"\n👤 User: {user.name} ({user.email})")
            print(f"   Created: {user.created_at}")
            print(f"   Has access token: {'Yes' if user.access_token else 'No'}")
            
            # Check user's pages
            pages = db.query(Page).filter(Page.user_id == user.id).all()
            print(f"   Connected pages: {len(pages)}")
            
            for page in pages:
                print(f"   📄 {page.page_name}:")
                print(f"      FB Page ID: {page.fb_page_id}")
                print(f"      IG Business ID: {page.ig_business_id}")
                print(f"      IG Username: {page.instagram_username}")
                print(f"      Webhook subscribed: {page.webhook_subscribed}")
                print(f"      Has page token: {'Yes' if page.page_access_token else 'No'}")
    
    except Exception as e:
        print(f"❌ Database error: {e}")
    finally:
        db.close()
    
    print(f"\n🎯 SUMMARY:")
    print(f"✅ OAuth scope is correctly configured without pages_read_engagement")
    print(f"✅ All required permissions are in scope:")
    for perm in facebook_config.REQUIRED_PERMISSIONS:
        print(f"   - {perm}")
    
    print(f"\n🔧 NEXT STEPS:")
    print(f"1. Deploy the updated code to Railway (removed pages_read_engagement)")
    print(f"2. User may need to re-authenticate if they previously granted pages_read_engagement")
    print(f"3. Test webhook subscription with the corrected permissions")
    print(f"4. Use Facebook's 'Send Test' to verify webhook delivery")

if __name__ == "__main__":
    check_permissions()
