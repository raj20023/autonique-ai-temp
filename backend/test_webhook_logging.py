#!/usr/bin/env python3
"""
Test webhook logging to verify logs are working
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

async def test_webhook_logging():
    """Test webhook endpoints to verify logging is working"""
    
    print("🧪 TESTING WEBHOOK LOGGING")
    print("=" * 50)
    
    # Test 1: GET verification request
    print("\n1️⃣ Testing GET verification request...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.autonique.in/api/v1/webhook",
                params={
                    "hub.mode": "subscribe",
                    "hub.verify_token": settings.WEBHOOK_VERIFY_TOKEN,
                    "hub.challenge": "test_logging_123"
                }
            )
            print(f"✅ GET request sent - Status: {response.status_code}")
            print(f"📄 Response: {response.text}")
    except Exception as e:
        print(f"❌ GET request failed: {e}")
    
    # Test 2: POST request with valid signature
    print("\n2️⃣ Testing POST request with valid signature...")
    try:
        # Create test payload
        test_payload = {
            "object": "instagram",
            "entry": [
                {
                    "id": "17841476305716985",
                    "time": 1234567890,
                    "messaging": [
                        {
                            "sender": {"id": "test_sender_logging"},
                            "recipient": {"id": "17841476305716985"},
                            "timestamp": 1234567890,
                            "message": {
                                "mid": "test_logging_message_id",
                                "text": "Test logging message"
                            }
                        }
                    ]
                }
            ]
        }
        
        # Convert to JSON bytes
        payload_bytes = json.dumps(test_payload, separators=(',', ':')).encode('utf-8')
        
        # Generate valid signature
        app_secret = settings.FACEBOOK_APP_SECRET.encode('utf-8')
        signature_hash = hmac.new(app_secret, payload_bytes, hashlib.sha256).hexdigest()
        signature = f"sha256={signature_hash}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.autonique.in/api/v1/webhook/",
                content=payload_bytes,
                headers={
                    "Content-Type": "application/json",
                    "X-Hub-Signature-256": signature,
                    "User-Agent": "Test-Webhook-Logging/1.0"
                }
            )
            print(f"✅ POST request sent - Status: {response.status_code}")
            print(f"📄 Response: {response.text}")
    except Exception as e:
        print(f"❌ POST request failed: {e}")
    
    # Test 3: POST request without signature (should be rejected)
    print("\n3️⃣ Testing POST request without signature...")
    try:
        test_payload = {"object": "instagram", "entry": []}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.autonique.in/api/v1/webhook/",
                json=test_payload,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "Test-Webhook-No-Signature/1.0"
                }
            )
            print(f"✅ POST request sent - Status: {response.status_code}")
            print(f"📄 Response: {response.text}")
    except Exception as e:
        print(f"❌ POST request failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 LOGGING TEST COMPLETE!")
    print("\n📋 What to check in your server logs:")
    print("1. Look for: 🔍 WEBHOOK GET VERIFICATION REQUEST RECEIVED!")
    print("2. Look for: 🚨 WEBHOOK POST REQUEST RECEIVED!")
    print("3. Check all the detailed request information")
    print("4. Verify signature verification logs")
    print("\n💡 If you see these logs, webhook logging is working!")
    print("💡 If you don't see logs, the webhook requests aren't reaching your server")

if __name__ == "__main__":
    asyncio.run(test_webhook_logging())
