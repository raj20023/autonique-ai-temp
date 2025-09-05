# Facebook App Setup Guide

Complete guide to setting up your Facebook App for InstaReply.

## 📋 Prerequisites

- Facebook Developer Account
- Instagram Business Account
- Facebook Page connected to Instagram Business Account

## 🚀 Step-by-Step Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Business" as app type
4. Fill in app details:
   - App Name: "YourBusiness InstaReply"
   - App Contact Email: your-email@domain.com
   - Business Account: Select your business account

### 2. Add Required Products

#### Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Go to Instagram Basic Display > Basic Display
4. Add Instagram Testers (your Instagram account)

#### Instagram Messaging
1. Add "Instagram Messaging" product
2. This allows your app to receive and send messages

#### Webhooks
1. Add "Webhooks" product
2. This enables real-time message notifications

### 3. Configure Instagram Basic Display

1. Go to Instagram Basic Display > Basic Display
2. Create New App:
   - Display Name: "YourBusiness InstaReply"
   - Valid OAuth Redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     ```
   - Deauthorize Callback URL: `https://yourdomain.com/auth/deauthorize`
   - Data Deletion Request URL: `https://yourdomain.com/auth/delete`

### 4. Configure App Settings

1. Go to Settings > Basic
2. Add App Domains:
   ```
   localhost
   yourdomain.com
   ```
3. Add Privacy Policy URL: `https://yourdomain.com/privacy`
4. Add Terms of Service URL: `https://yourdomain.com/terms`

### 5. Set Up Webhooks

1. Go to Webhooks in your app dashboard
2. Create a webhook for Instagram:
   - Callback URL: `https://yourdomain.com/api/v1/webhook`
   - Verify Token: Generate a secure random string (save this for your .env)
   - Subscription Fields: Select `messages`

### 6. Configure Permissions

#### Required Permissions
- `pages_show_list` - Access user's pages
- `pages_manage_metadata` - Manage page metadata (required for Instagram business account access)
- `pages_messaging` - Send/receive messages on behalf of pages
- `instagram_basic` - Access basic Instagram account info
- `instagram_manage_messages` - Manage Instagram messages
- `business_management` - Manage business assets

### 7. App Review Process

For production use, you'll need to submit your app for review:

1. Go to App Review > Permissions and Features
2. Request these permissions:
   - `pages_show_list`
   - `pages_manage_metadata`
   - `pages_messaging`
   - `instagram_basic`
   - `instagram_manage_messages`
   - `business_management`

3. Provide required information:
   - Detailed description of how you use each permission
   - Screencast showing the user flow
   - Privacy policy and terms of service

## 🔧 Environment Configuration

After setup, add these to your environment files:

### Backend (.env)
```bash
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
```

## 🧪 Testing Setup

### 1. Test Users
1. Go to Roles > Test Users
2. Create test users for development
3. Add Instagram accounts to test users

### 2. Webhook Testing
Use ngrok for local webhook testing:
```bash
# Install ngrok
npm install -g ngrok

# Expose local backend
ngrok http 8000

# Use the HTTPS URL for webhook callback
```

### 3. OAuth Flow Testing
1. Start your local development servers
2. Visit `http://localhost:3000`
3. Click "Continue with Instagram Business"
4. Complete OAuth flow

## 🔒 Security Best Practices

### App Secret Security
- Never expose App Secret in client-side code
- Use environment variables
- Rotate secrets regularly

### Webhook Security
- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement proper error handling

### Token Management
- Store access tokens encrypted
- Implement token refresh logic
- Handle token expiration gracefully

## 📊 Monitoring & Analytics

### App Dashboard Metrics
Monitor these in Facebook App Dashboard:
- API calls volume
- Error rates
- User engagement
- Webhook delivery success

### Custom Analytics
Track in your application:
- OAuth conversion rates
- Message response rates
- FAQ match accuracy
- User retention

## 🆘 Common Issues & Solutions

### Issue: "Invalid OAuth access token"
**Solution:** Check if token has expired, refresh if needed

### Issue: "Webhook verification failed"
**Solution:** Ensure verify token matches exactly

### Issue: "Permission denied for pages_messaging"
**Solution:** Ensure page admin has granted permissions

### Issue: "Instagram account not found"
**Solution:** Verify Instagram Business account is connected to Facebook page

### Issue: "App not approved for production"
**Solution:** Submit app for review with required documentation

## 📚 Additional Resources

- [Facebook for Developers Documentation](https://developers.facebook.com/docs/)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Messaging API](https://developers.facebook.com/docs/messenger-platform/instagram)
- [Webhooks Guide](https://developers.facebook.com/docs/graph-api/webhooks)

## 🔄 App Review Checklist

Before submitting for review:

- [ ] App functionality is complete and working
- [ ] Privacy policy is published and accessible
- [ ] Terms of service are published and accessible
- [ ] App description clearly explains functionality
- [ ] Screencast demonstrates user flow
- [ ] All required permissions are justified
- [ ] Test users can successfully use the app
- [ ] Webhook endpoints are secure and working
- [ ] Error handling is implemented
- [ ] User data handling complies with policies
