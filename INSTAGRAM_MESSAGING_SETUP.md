# Instagram Business Messaging Setup Guide

## Issue: Webhooks Only Work for Tester/Admin Accounts

### Root Cause
Instagram Business Accounts filter messages from unknown users to prevent spam. Only messages from:
- Instagram tester accounts
- App admin accounts  
- Users who have previously interacted with the business
- Users who found the business through Instagram features (search, hashtags, etc.)

Will trigger webhooks for non-tester business accounts.

## Solutions

### Solution 1: Add as Instagram Tester (Development)
1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps/2032087817551720/roles/test-users/)
2. Navigate to **Instagram Testers**
3. Add Instagram username: `seasonart1`
4. Accept invitation from the Instagram account

### Solution 2: Enable Message Requests (Production)

#### On Instagram Business Account (seasonart1):
1. Open Instagram app
2. Go to **Settings** → **Privacy** → **Messages**
3. Enable:
   - ✅ **Allow message requests from everyone**
   - ✅ **Show message requests in chats list**
4. Go to **Professional Dashboard** → **Messages**
5. Enable:
   - ✅ **Allow messages from anyone**
   - ✅ **Show message requests**

#### Configure Auto-Reply for Message Requests:
1. **Professional Dashboard** → **Messages** → **Tools**
2. Set up **Away Message** or **Instant Replies**
3. This helps users know their message was received

### Solution 3: Instagram Business Discovery Setup

#### Enable Business Discovery Features:
1. **Complete Instagram Business Profile:**
   - Add business category
   - Add contact information
   - Add business hours
   - Add location (if applicable)

2. **Use Instagram Business Features:**
   - Post regularly with relevant hashtags
   - Use Instagram Stories
   - Enable location tagging
   - Use Instagram Shopping (if applicable)

3. **Encourage Organic Discovery:**
   - Users who find your business through search/hashtags can message freely
   - Messages from these users will trigger webhooks

### Solution 4: Instagram Messaging API Setup (Advanced)

#### For Production Apps with High Volume:
1. **Apply for Instagram Messaging API Access:**
   - Go to App Review in Facebook Developers
   - Request advanced access for Instagram messaging
   - Provide use case documentation

2. **Implement Instagram Messaging Webhook Events:**
   ```json
   {
     "messaging": [
       {
         "sender": {"id": "USER_ID"},
         "recipient": {"id": "PAGE_ID"},
         "timestamp": 1234567890,
         "message": {
           "mid": "MESSAGE_ID",
           "text": "Hello"
         }
       }
     ]
   }
   ```

## Testing Strategy

### Phase 1: Development Testing
- Use tester accounts for development
- Test all auto-reply scenarios
- Verify webhook delivery and processing

### Phase 2: Limited Production Testing  
- Enable message requests on business account
- Test with real users who follow the account
- Monitor webhook delivery rates

### Phase 3: Full Production
- Complete app review for Instagram messaging
- Enable all business discovery features
- Monitor and optimize auto-reply performance

## Current Status for seasonart1

### What Works:
- ✅ Messages from admin accounts (autonique.ai)
- ✅ Webhook verification
- ✅ Auto-reply functionality

### What Doesn't Work:
- ❌ Messages from random/new Instagram users
- ❌ Webhook delivery for non-admin messages

### Immediate Fix:
1. **Add seasonart1 as Instagram tester** (quickest solution)
2. **Enable message requests** in Instagram settings
3. **Test with users who follow the account first**

## Long-term Recommendations

1. **Use urbanbaza50 for development** (already working as tester)
2. **Configure seasonart1 for production** with message requests enabled
3. **Apply for advanced Instagram messaging permissions** if needed
4. **Implement proper business profile setup** for organic discovery

This setup will ensure your Instagram auto-reply bot works for all legitimate users while maintaining Instagram's spam protection.
