# 🚀 Railway Deployment Guide

## Environment Variables for Railway

Set these environment variables in your Railway dashboard:

### Required Variables
```bash
# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://username:password@host:port/database

# Facebook/Instagram API
FACEBOOK_APP_ID=2032087817551720
FACEBOOK_APP_SECRET=26d352ae6414eb95c1fba677ecfa6e0d
FACEBOOK_GRAPH_API_VERSION=v23.0

# Google Gemini
GOOGLE_API_KEY=AIzaSyBeQ8iKyP-_6r4F5QtOG2QU-jErZSNO7cc

# JWT Security
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=autonique_webhook_2024_secure_token_xyz789

# Environment Settings
ENVIRONMENT=production
DEBUG=False

# Caching
ENABLE_CACHING=True

# CORS (Update with your frontend domain)
ALLOWED_ORIGINS=https://autonique.in,https://www.autonique.in

# Railway Port (Railway sets this automatically)
PORT=8000
```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready with v23.0 webhook"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend folder as root

3. **Set Environment Variables**
   - Copy the variables above into Railway dashboard
   - Railway will auto-generate DATABASE_URL

4. **Update Facebook Webhook URL**
   - Get your Railway URL: `https://your-app.railway.app`
   - Update Facebook webhook to: `https://your-app.railway.app/api/v1/webhook`
   - Verify token: `autonique_webhook_2024_secure_token_xyz789`

## Testing After Deployment

1. **Test Webhook Verification**
   ```bash
   curl "https://your-app.railway.app/api/v1/webhook?hub.mode=subscribe&hub.verify_token=autonique_webhook_2024_secure_token_xyz789&hub.challenge=test123"
   ```

2. **Test Health Endpoint**
   ```bash
   curl https://your-app.railway.app/health
   ```

3. **Send Instagram DM**
   - Send a message to your Instagram Business account
   - Check Railway logs for webhook events
   - Verify auto-reply is sent

## Important Notes

- ✅ Webhook verification fix applied
- ✅ Updated to Facebook Graph API v23.0 (both backend and frontend)
- ✅ Production environment configured
- ✅ Debug scripts removed
- ✅ CORS configured for production domains
- ✅ All hardcoded URLs updated to v23.0
- ✅ Removed business_management permission (kept essential permissions only)

## Frontend Deployment (Vercel)

Set these environment variables in Vercel:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_FACEBOOK_APP_ID=2032087817551720
NEXT_PUBLIC_FRONTEND_URL=https://autonique.in
```

Your auto-reply system is now ready for production! 🎉
