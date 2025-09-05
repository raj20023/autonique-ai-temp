#!/usr/bin/env python3
"""
Simple script to test the API endpoints
"""
import requests
import json

def test_endpoint(url, description):
    """Test an API endpoint"""
    print(f"\n🧪 Testing: {description}")
    print(f"📡 URL: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"✅ Success!")
                print(f"📄 Response: {json.dumps(data, indent=2)}")
                return data
            except json.JSONDecodeError:
                print(f"✅ Success (non-JSON response)")
                print(f"📄 Response: {response.text}")
                return response.text
        else:
            print(f"❌ Failed")
            print(f"📄 Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    """Test all endpoints"""
    base_url = "https://api.autonique.in/api/v1"
    
    print("🎯 TESTING API ENDPOINTS")
    print("=" * 50)
    
    # Test 1: Health check
    test_endpoint(f"{base_url}/system/health", "System Health")
    
    # Test 2: Debug page model
    test_endpoint(f"{base_url}/webhook/debug-page-model", "Debug Page Model")
    
    # Test 3: List all pages
    test_endpoint(f"{base_url}/webhook/list-all-pages", "List All Pages")
    
    # Test 4: Get seasonart1 token
    test_endpoint(f"{base_url}/webhook/get-seasonart1-token", "Get seasonart1 Token")
    
    # Test 5: Get specific page token
    test_endpoint(f"{base_url}/webhook/get-page-token/709105118962659", "Get Page Token by ID")

if __name__ == "__main__":
    main()
