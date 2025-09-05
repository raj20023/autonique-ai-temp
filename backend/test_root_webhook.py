#!/usr/bin/env python3
"""
Test root-level webhook endpoint specifically
"""

import asyncio
import httpx
import json
import hmac
import hashlib
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

async def test_root_webhook():
    """Test the root-level webhook endpoint that Facebook actually calls"""
    
    print("🧪 TESTING ROOT-LEVEL WEBHOOK ENDPOINT")
    print("URL: https://api.autonique.in/api/v1/webhook")
    print("=" * 60)
    
    # Test 1: GET verification (this works)
    print("\n1️⃣ Testing GET verification (should work)...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.autonique.in/api/v1/webhook",
                params={
                    "hub.mode": "subscribe",
                    "hub.verify_token": settings.WEBHOOK_VERIFY_TOKEN,
                    "hub.challenge": "root_test_123"
                }
            )
            print(f"✅ GET Status: {response.status_code}")
            print(f"📄 GET Response: {response.text}")
    except Exception as e:
        print(f"❌ GET request failed: {e}")
    
    # Test 2: POST with valid signature (this was failing)
    print("\n2️⃣ Testing POST with valid signature (was failing before fix)...")
    try:
        # Create Instagram message test payload
        test_payload = {
            "object": "instagram",
            "entry": [
                {
                    "id": "17841476305716985",  # Your IG Business ID
                    "time": 1234567890,
                    "messaging": [
                        {
                            "sender": {"id": "test_facebook_sender"},
                            "recipient": {"id": "17841476305716985"},
                            "timestamp": 1234567890,
                            "message": {
                                "mid": "test_facebook_message_id",
                                "text": "Test message from Facebook"
                            }
                        }
                    ]
                }
            ]
        }
        
        # Convert to JSON bytes (exactly as Facebook sends)
        payload_bytes = json.dumps(test_payload, separators=(',', ':')).encode('utf-8')
        
        # Generate valid signature (exactly as Facebook does)
        app_secret = settings.FACEBOOK_APP_SECRET.encode('utf-8')
        signature_hash = hmac.new(app_secret, payload_bytes, hashlib.sha256).hexdigest()
        signature = f"sha256={signature_hash}"
        
        print(f"📦 Payload size: {len(payload_bytes)} bytes")
        print(f"🔐 Signature: {signature[:20]}...")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.autonique.in/api/v1/webhook",  # Root level endpoint
                content=payload_bytes,
                headers={
                    "Content-Type": "application/json",
                    "X-Hub-Signature-256": signature,
                    "User-Agent": "facebookplatform/1.0 (+http://developers.facebook.com)"
                }
            )
            print(f"✅ POST Status: {response.status_code}")
            print(f"📄 POST Response: {response.text}")
            
            if response.status_code == 200 and response.text == "EVENT_RECEIVED":
                print("🎉 ROOT-LEVEL POST WEBHOOK IS NOW WORKING!")
            else:
                print("❌ Root-level POST webhook still has issues")
                
    except Exception as e:
        print(f"❌ POST request failed: {e}")
    
    # Test 3: POST without signature (should be rejected)
    print("\n3️⃣ Testing POST without signature (should be rejected)...")
    try:
        test_payload = {"object": "instagram", "entry": []}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.autonique.in/api/v1/webhook",
                json=test_payload,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "facebookplatform/1.0 (+http://developers.facebook.com)"
                }
            )
            print(f"✅ POST Status: {response.status_code}")
            print(f"📄 POST Response: {response.text}")
            
            if response.status_code == 403:
                print("✅ Correctly rejected request without signature")
            else:
                print("⚠️ Unexpected response for request without signature")
                
    except Exception as e:
        print(f"❌ POST request failed: {e}")
    
    print("\n" + "=" * 60)
    print("🎯 ROOT-LEVEL WEBHOOK TEST COMPLETE!")
    print("\n📋 What to check in Railway logs:")
    print("1. Look for: 🔍 ROOT-LEVEL WEBHOOK GET REQUEST RECEIVED!")
    print("2. Look for: 🚨 ROOT-LEVEL WEBHOOK POST REQUEST RECEIVED!")
    print("3. Look for: 🚨 WEBHOOK POST REQUEST RECEIVED!")
    print("4. Check for signature verification logs")
    print("\n💡 If you see these logs, the fix worked!")
    print("💡 Now try Facebook's 'Send Test' again and watch for logs")

if __name__ == "__main__":
    asyncio.run(test_root_webhook())
