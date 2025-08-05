# InstaReply - Instagram Business Auto-Reply SaaS

A complete SaaS platform that automatically responds to Instagram DMs using AI-powered FAQ matching.

## 🚀 Features

- **Instagram Business Integration**: Connect via Facebook OAuth
- **AI-Powered Responses**: Uses Google Gemini 2.0 Flash with LangChain for intelligent FAQ matching
- **Real-time Webhooks**: Instant response to incoming DMs
- **User-Friendly Dashboard**: Upload, manage, and test your FAQs
- **Secure & Scalable**: Built with modern security practices

## 🏗️ Architecture

```
InstaReply/
├── frontend/          # Next.js React app
├── backend/           # FastAPI Python backend
├── database/          # PostgreSQL schemas and migrations
├── docker/            # Docker configuration
└── docs/              # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend**: FastAPI, Python 3.11, SQLAlchemy, Alembic
- **Database**: PostgreSQL 15
- **Caching**: Simple in-memory cache (no Redis needed)
- **AI**: Google Gemini 2.0 Flash & LangChain
- **Auth**: Facebook OAuth 2.0
- **Deployment**: Vercel (frontend), Railway/Render (backend)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- PostgreSQL 15+ (or SQLite for development)
- Facebook Developer Account
- Google Gemini API Key

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo>
cd InstaReply
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URLs
npm run dev
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb instareply_db

# Run migrations
cd backend
alembic upgrade head
```

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/instareply_db
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
GOOGLE_API_KEY=your_google_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

## 📱 Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Basic Display and Instagram Messaging products
4. Configure OAuth redirect URI: `http://localhost:3000/auth/callback`
5. Add webhook URL: `http://localhost:8000/webhook`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway login
railway init
railway up
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔒 Security Features

- JWT-based authentication
- Encrypted token storage
- CORS protection
- Rate limiting
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@instareply.com or create an issue on GitHub.
