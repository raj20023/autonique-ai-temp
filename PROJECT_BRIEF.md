# AutoniqueAI - Project Brief

## 📋 Executive Summary

**AutoniqueAI** is a production-ready SaaS platform that provides automated Instagram Direct Message responses for businesses. The platform uses AI-powered FAQ matching to deliver instant, contextual replies to customer inquiries 24/7, helping businesses improve customer service efficiency and response times.

## 🎯 Business Value Proposition

- **Automated Customer Service**: Instant responses to Instagram DMs using AI-powered FAQ matching
- **24/7 Availability**: Never miss a customer inquiry, even outside business hours
- **Scalable Solution**: Handle unlimited messages across multiple Instagram business accounts
- **Easy Setup**: Simple Facebook OAuth integration with minimal configuration required
- **Cost Effective**: Reduce customer service workload while improving response quality

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Landing Page  │    │ • REST API      │    │ • Facebook API  │
│ • Dashboard     │    │ • Webhooks      │    │ • Instagram API │
│ • FAQ Manager   │    │ • AI Processing │    │ • Google Gemini │
│ • Settings      │    │ • Database      │    │ • PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

#### 1. **Frontend Application** (Next.js 14 + TypeScript)
- **Landing Page**: Marketing site with feature showcase
- **Authentication**: Facebook OAuth integration
- **Dashboard**: Real-time analytics and system overview
- **FAQ Management**: CRUD operations for knowledge base
- **Settings**: Account and notification preferences
- **Live Monitor**: Real-time message processing visualization

#### 2. **Backend API** (FastAPI + Python 3.11)
- **RESTful API**: Complete CRUD operations for all entities
- **Webhook Handler**: Instagram message processing pipeline
- **AI Service**: Google Gemini integration for FAQ matching
- **Authentication**: JWT tokens with Facebook OAuth
- **Background Tasks**: Token refresh and cache cleanup

#### 3. **Database Layer** (PostgreSQL 15)
- **Users**: Account management and authentication
- **Pages**: Instagram business account connections
- **FAQs**: Knowledge base with AI embeddings
- **Messages**: Conversation history and analytics

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL 15 with SQLAlchemy ORM
- **AI/ML**: Google Gemini 2.0 Flash + LangChain
- **Authentication**: JWT + Facebook OAuth 2.0
- **Caching**: In-memory caching system
- **Migrations**: Alembic
- **Deployment**: Railway (production)

### Frontend Technologies
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Deployment**: Vercel (production)

### External Integrations
- **Facebook Graph API**: Instagram Business API access
- **Google Gemini API**: AI-powered text processing
- **Instagram Webhooks**: Real-time message notifications

## 📊 Core Features

### 1. **Automated Message Processing**
- Real-time Instagram DM webhook processing
- AI-powered FAQ matching using semantic similarity
- Automatic response generation and delivery
- Echo detection to prevent infinite loops
- Cross-account messaging support

### 2. **FAQ Management System**
- Create, edit, and delete FAQ entries
- AI embedding generation for semantic search
- Bulk FAQ import functionality
- FAQ performance analytics
- Active/inactive status management

### 3. **Multi-Account Support**
- Connect multiple Instagram business accounts
- Per-account FAQ customization
- Centralized management dashboard
- Account-specific analytics

### 4. **Real-Time Monitoring**
- Live message processing visualization
- System health monitoring
- Response time analytics
- Error tracking and logging

### 5. **User Management**
- Facebook OAuth authentication
- Account settings and preferences
- Notification preferences
- Data export capabilities

## 🔧 API Architecture

### Core Endpoints
```
/api/v1/
├── auth/                 # Authentication
│   ├── POST /login      # Facebook OAuth login
│   └── POST /callback   # OAuth callback
├── users/               # User management
│   ├── GET /me         # Current user info
│   ├── PUT /me         # Update profile
│   └── DELETE /me      # Delete account
├── pages/              # Instagram accounts
│   ├── GET /           # List connected accounts
│   └── POST /connect   # Connect new account
├── faqs/               # FAQ management
│   ├── GET /           # List FAQs
│   ├── POST /          # Create FAQ
│   ├── PUT /{id}       # Update FAQ
│   └── DELETE /{id}    # Delete FAQ
├── webhook/            # Instagram webhooks
│   ├── GET /           # Webhook verification
│   └── POST /          # Message processing
└── live/               # Real-time monitoring
    └── GET /messages   # Live message stream
```

## 🗄️ Database Schema

### Core Tables
```sql
users (
    id, fb_user_id, name, email, access_token,
    token_expires_at, is_active, created_at, updated_at
)

pages (
    id, user_id, fb_page_id, ig_business_id, page_name,
    page_access_token, instagram_username, webhook_subscribed,
    is_active, created_at, updated_at
)

faqs (
    id, user_id, question, answer, embedding_vector,
    is_active, usage_count, created_at, updated_at
)

messages (
    id, user_id, ig_user_id, ig_message_id, message_text,
    matched_faq_id, response_text, similarity_score,
    auto_replied, reply_sent_at, is_incoming, created_at
)
```

## 🔐 Security Features

### Authentication & Authorization
- Facebook OAuth 2.0 integration
- JWT token-based authentication
- Secure token encryption/decryption
- Automatic token refresh mechanism

### Data Protection
- Encrypted storage of access tokens
- CORS protection with specific origins
- Rate limiting on API endpoints
- Input validation and sanitization

### Privacy Compliance
- User data deletion capabilities
- Data export functionality
- Minimal permission requests (3 Facebook permissions only)
- Transparent data usage policies

## 🚀 Deployment Architecture

### Production Environment
- **Frontend**: Vercel (https://autonique.in)
- **Backend**: Railway (https://api.autonique.in)
- **Database**: Railway PostgreSQL
- **Domain**: Custom domain with SSL

### Environment Configuration
- Production-ready configuration
- Environment-based settings
- Secure secret management
- Health check endpoints

## 📈 Performance & Scalability

### Optimization Features
- In-memory caching for FAQ embeddings
- Efficient database queries with indexes
- Background task processing
- Automatic cache cleanup

### Monitoring & Reliability
- Health check endpoints
- Error logging and tracking
- Automatic token refresh
- Graceful error handling

## 🎯 Target Market

### Primary Users
- Small to medium businesses with Instagram presence
- E-commerce stores using Instagram for customer service
- Service providers needing 24/7 customer support
- Marketing agencies managing multiple client accounts

### Use Cases
- Product inquiries and support
- Order status and shipping information
- Business hours and location queries
- General customer service automation

## 💼 Business Model

### SaaS Subscription Model
- Freemium tier with basic features
- Paid tiers based on message volume
- Multi-account support in premium plans
- Enterprise solutions for large businesses

## 📋 Technical Specifications

### System Requirements
- **Backend**: Python 3.11+, PostgreSQL 15+
- **Frontend**: Node.js 18+, Modern browsers
- **External APIs**: Facebook Graph API v19.0, Google Gemini API

### Performance Metrics
- **Response Time**: < 2 seconds for FAQ matching
- **Throughput**: 1000+ messages per minute
- **Uptime**: 99.9% availability target
- **Scalability**: Horizontal scaling support

### Code Quality
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test coverage
- **Documentation**: Complete API documentation
- **Code Standards**: ESLint, Prettier, Black formatting

## 🔧 Development Workflow

### Project Structure
```
AutoniqueAI/
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/            # API routes and endpoints
│   │   ├── core/           # Configuration and database
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic data schemas
│   │   ├── services/       # Business logic services
│   │   └── main.py         # FastAPI application
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Next.js pages and routing
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # CSS and styling
│   └── package.json        # Node.js dependencies
└── docs/                   # Project documentation
```

### Key Dependencies
**Backend:**
- FastAPI, SQLAlchemy, Alembic
- Google Generative AI, LangChain
- Cryptography, Python-JOSE
- Uvicorn, Gunicorn

**Frontend:**
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Framer Motion
- React Query, React Hook Form
- Axios, React Hot Toast

## 🔮 Future Enhancements

### Planned Features
- Multi-language support with translation
- Advanced analytics and reporting dashboard
- Custom AI model training capabilities
- Integration with WhatsApp and Messenger
- Team collaboration and role management
- Advanced workflow automation and triggers
- A/B testing for response optimization
- Integration with CRM systems

### Technical Roadmap
- **Q1 2025**: Multi-language support
- **Q2 2025**: Advanced analytics dashboard
- **Q3 2025**: WhatsApp integration
- **Q4 2025**: Enterprise features and API

---

**Project Status**: ✅ Production Ready
**Last Updated**: January 2025
**Version**: 1.0.0
**License**: Proprietary
**Maintainer**: AutoniqueAI Team
