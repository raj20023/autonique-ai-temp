#!/usr/bin/env python3
"""
Test admin authentication flow
"""

import asyncio
import httpx
import json

async def test_admin_auth():
    """Test admin authentication"""
    
    print("🔍 Testing Admin Authentication Flow")
    print("=" * 50)
    
    base_url = "https://api.autonique.in"
    
    print("This test will help us understand why admin access is failing.")
    print("We need to check:")
    print("1. If JWT tokens are being created correctly")
    print("2. If the /users/me endpoint works")
    print("3. If admin endpoints recognize the user as admin")
    print()
    
    print("📝 Instructions:")
    print("1. Login to your app as Raj Prajapati")
    print("2. Open browser console (F12)")
    print("3. Type: localStorage.getItem('access_token')")
    print("4. Copy the token (without quotes)")
    print("5. Paste it below when prompted")
    print()
    
    # Get token from user
    token = input("🔑 Paste your access token here: ").strip()
    
    if not token:
        print("❌ No token provided")
        return
    
    print(f"\n🔍 Token length: {len(token)} characters")
    print(f"🔍 Token starts with: {token[:20]}...")
    print()
    
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test 1: Check /users/me endpoint
        print("1️⃣ Testing /users/me endpoint...")
        try:
            response = await client.get(f"{base_url}/api/v1/users/me", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"   ✅ User: {user_data.get('name')}")
                print(f"   ✅ Role: {user_data.get('role')}")
                print(f"   ✅ ID: {user_data.get('id')}")
                
                if user_data.get('role') != 'admin':
                    print(f"   ❌ User role is '{user_data.get('role')}' not 'admin'!")
                else:
                    print(f"   ✅ User is admin")
            else:
                error_text = await response.text()
                print(f"   ❌ Failed: {error_text}")
                return
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return
        
        # Test 2: Check admin stats endpoint
        print("\n2️⃣ Testing /admin/stats endpoint...")
        try:
            response = await client.get(f"{base_url}/api/v1/user-management/admin/stats", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                stats_data = response.json()
                print(f"   ✅ Admin stats: {stats_data}")
            else:
                error_text = await response.text()
                print(f"   ❌ Failed: {error_text}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        # Test 3: Check admin users endpoint
        print("\n3️⃣ Testing /admin/users endpoint...")
        try:
            response = await client.get(f"{base_url}/api/v1/user-management/admin/users", headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                users_data = response.json()
                print(f"   ✅ Found {len(users_data.get('users', []))} users")
                for user in users_data.get('users', [])[:3]:  # Show first 3
                    print(f"      • {user.get('name')} (Role: {user.get('role')})")
            else:
                error_text = await response.text()
                print(f"   ❌ Failed: {error_text}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n🎯 Summary:")
    print("If all tests pass, the issue is in the frontend.")
    print("If tests fail, the issue is in the backend authentication.")

if __name__ == "__main__":
    asyncio.run(test_admin_auth())
