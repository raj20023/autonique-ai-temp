# AutoniqueAI Deployment Guide

This guide covers deploying AutoniqueAI to production environments.

## 🚀 Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
   NEXT_PUBLIC_FRONTEND_URL=https://your-app.vercel.app
   ```
4. Deploy automatically

#### Backend (Railway)
1. Connect your GitHub repo to Railway
2. Set environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET_KEY=your_jwt_secret
   WEBHOOK_VERIFY_TOKEN=your_webhook_token
   ENVIRONMENT=production
   DEBUG=False
   ```
3. Railway will auto-deploy

### Option 2: Docker Compose

```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Manual VPS Deployment

#### Prerequisites
- Ubuntu 20.04+ server
- Domain name with SSL certificate
- PostgreSQL 15+
- Redis 7+
- Node.js 18+
- Python 3.11+

#### Backend Deployment
```bash
# Clone repository
git clone <your-repo-url>
cd InstaReply/backend

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with production values

# Run migrations
alembic upgrade head

# Install process manager
pip install gunicorn

# Start with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Frontend Deployment
```bash
cd ../frontend

# Install dependencies
npm ci --only=production

# Build for production
npm run build

# Start production server
npm start
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Facebook/Instagram
FACEBOOK_APP_ID=your_production_app_id
FACEBOOK_APP_SECRET=your_production_app_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Security
JWT_SECRET_KEY=your_super_secure_jwt_key_256_bits_minimum
WEBHOOK_VERIFY_TOKEN=your_secure_webhook_token

# Environment
ENVIRONMENT=production
DEBUG=False

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your_production_app_id
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
```

## 🔒 Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure JWT secret (256+ bits)
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database connection encryption
- [ ] Webhook signature verification

## 📊 Monitoring & Logging

### Application Monitoring
```python
# Add to main.py
import logging
from app.core.config import settings

if settings.ENVIRONMENT == "production":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
```

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /`
- Database: Connection test in health endpoint

### Metrics to Monitor
- Response times
- Error rates
- Database connections
- Memory usage
- Webhook delivery success rate
- FAQ match accuracy

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 🆘 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check Facebook App webhook URL
   - Verify webhook token matches
   - Ensure HTTPS is working

2. **Database connection errors**
   - Check DATABASE_URL format
   - Verify database server is running
   - Check firewall settings

3. **Facebook OAuth errors**
   - Verify App ID and Secret
   - Check redirect URI configuration
   - Ensure app is in production mode

4. **OpenAI API errors**
   - Verify API key is valid
   - Check rate limits
   - Monitor usage quotas

### Logs Location
- Backend: Application logs via logging module
- Frontend: Browser console and Next.js logs
- Database: PostgreSQL logs
- Nginx: `/var/log/nginx/`

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Implement Redis for session storage
- Use CDN for static assets

### Database Optimization
- Add database indexes for frequently queried fields
- Implement connection pooling
- Consider read replicas for heavy read workloads

### Caching Strategy
- Redis for FAQ embeddings cache
- CDN for static assets
- Application-level caching for API responses
