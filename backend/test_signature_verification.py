#!/usr/bin/env python3
"""
Test HMAC signature verification
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import hmac
import hashlib
import json
from app.core.config import settings

def test_signature_verification():
    """Test the HMAC signature verification"""
    
    # Sample webhook payload
    test_payload = {
        "object": "page",
        "entry": [
            {
                "id": "709105118962659",
                "time": 1234567890,
                "messaging": [
                    {
                        "sender": {"id": "test_user_id"},
                        "recipient": {"id": "709105118962659"},
                        "timestamp": 1234567890,
                        "message": {
                            "mid": "test_message_id",
                            "text": "Hello"
                        }
                    }
                ]
            }
        ]
    }
    
    # Convert to JSON bytes
    payload_bytes = json.dumps(test_payload, separators=(',', ':')).encode('utf-8')
    
    # Generate signature using app secret
    app_secret = settings.FACEBOOK_APP_SECRET.encode('utf-8')
    signature_hash = hmac.new(app_secret, payload_bytes, hashlib.sha256).hexdigest()
    signature = f"sha256={signature_hash}"
    
    print(f"📄 Test payload: {json.dumps(test_payload, indent=2)}")
    print(f"🔐 App secret: {settings.FACEBOOK_APP_SECRET[:10]}...")
    print(f"📝 Payload bytes length: {len(payload_bytes)}")
    print(f"🔑 Generated signature: {signature}")
    
    # Test the verification function
    from app.api.api_v1.endpoints.webhook import verify_webhook_signature
    
    # Test with correct signature
    is_valid = verify_webhook_signature(payload_bytes, signature)
    print(f"✅ Signature verification result: {is_valid}")
    
    # Test with incorrect signature
    wrong_signature = "sha256=wrong_signature_hash"
    is_invalid = verify_webhook_signature(payload_bytes, wrong_signature)
    print(f"❌ Wrong signature verification result: {is_invalid}")
    
    # Test with no signature
    no_signature = verify_webhook_signature(payload_bytes, None)
    print(f"🚫 No signature verification result: {no_signature}")
    
    print(f"\n🎯 Summary:")
    print(f"✅ Correct signature: {'PASS' if is_valid else 'FAIL'}")
    print(f"❌ Wrong signature: {'PASS' if not is_invalid else 'FAIL'}")
    print(f"🚫 No signature: {'PASS' if not no_signature else 'FAIL'}")
    
    if is_valid and not is_invalid and not no_signature:
        print(f"\n🎉 All signature verification tests PASSED!")
        return True
    else:
        print(f"\n💥 Some signature verification tests FAILED!")
        return False

if __name__ == "__main__":
    test_signature_verification()
