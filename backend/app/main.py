from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import time
import os
import logging
import asyncio
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.core.database import engine, Base, get_db
from app.core.cache import cleanup_expired_cache_entries
from app.api.deps import get_current_active_user
from app.models.user import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Background task for cache cleanup
async def cache_cleanup_task():
    """Background task to cleanup expired cache entries every hour"""
    while True:
        try:
            await asyncio.sleep(3600)  # Wait 1 hour
            cleanup_expired_cache_entries()
        except Exception as e:
            logger.error(f"Cache cleanup task error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting Autonique.ai API...")

    # Skip database operations during startup to avoid blocking
    logger.info("Skipping database initialization during startup")

    # Start background cache cleanup task
    try:
        cleanup_task = asyncio.create_task(cache_cleanup_task())
        logger.info("Cache cleanup task started")
    except Exception as e:
        logger.warning(f"Could not start cache cleanup task: {e}")
        cleanup_task = None

    yield

    # Shutdown
    logger.info("Shutting down Autonique.ai API...")
    if cleanup_task:
        cleanup_task.cancel()
        try:
            await cleanup_task
        except asyncio.CancelledError:
            pass

app = FastAPI(
    title="AutoniqueAI API",
    description="Instagram Business Auto-Reply SaaS Platform",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Security middleware - Allow all hosts for now
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# CORS middleware - Explicit origins for credentials support
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://autonique.in",
        "https://www.autonique.in",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Simple root endpoint for health checks"""
    return {
        "message": "AutoniqueAI API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/ping")
def ping():
    """Ultra-simple ping endpoint"""
    return {"ping": "pong"}



@app.options("/{path:path}")
async def options_handler(request: Request):
    """Handle CORS preflight requests"""
    return JSONResponse(
        content={"message": "CORS preflight OK"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )



@app.get("/ready")
def ready():
    """Readiness check"""
    return {"status": "ready"}

@app.get("/health")
async def health_check():
    """Health check endpoint that doesn't depend on database"""
    try:
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "service": "autonique-backend"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }

@app.get("/debug-system")
async def debug_system(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Debug system status for troubleshooting auto-reply issues"""
    from app.services.facebook_service import FacebookService
    from app.core.security import decrypt_token
    from app.models.page import Page
    from app.models.faq import FAQ
    from app.models.message import Message

    try:
        # Get user's pages
        pages = db.query(Page).filter(Page.user_id == current_user.id).all()

        # Get user's FAQs
        faqs = db.query(FAQ).filter(
            FAQ.user_id == current_user.id,
            FAQ.is_active == True
        ).all()

        # Get recent messages
        recent_messages = db.query(Message).filter(
            Message.user_id == current_user.id
        ).order_by(Message.created_at.desc()).limit(5).all()

        # Check webhook subscriptions
        facebook_service = FacebookService()
        webhook_status = []

        for page in pages:
            if page.ig_business_id:
                page_access_token = decrypt_token(page.page_access_token)
                # Check if webhook is subscribed (this is a simplified check)
                webhook_status.append({
                    "page_name": page.page_name,
                    "page_id": page.fb_page_id,
                    "ig_business_id": page.ig_business_id,
                    "webhook_subscribed": page.webhook_subscribed,
                    "has_access_token": bool(page.page_access_token)
                })

        return {
            "user_id": current_user.fb_user_id,
            "user_name": current_user.name,
            "pages_count": len(pages),
            "pages": webhook_status,
            "faqs_count": len(faqs),
            "faqs": [{"id": faq.id, "question": faq.question[:50] + "...", "has_embedding": bool(faq.embedding_vector)} for faq in faqs],
            "recent_messages_count": len(recent_messages),
            "recent_messages": [
                {
                    "id": msg.id,
                    "message_text": msg.message_text[:50] + "...",
                    "auto_replied": msg.auto_replied,
                    "response_text": msg.response_text[:50] + "..." if msg.response_text else None,
                    "created_at": msg.created_at.isoformat()
                } for msg in recent_messages
            ],
            "webhook_url": "https://api.autonique.in/api/v1/webhook/",
            "webhook_verify_token": settings.WEBHOOK_VERIFY_TOKEN,
            "system_status": "operational"
        }

    except Exception as e:
        return {"error": str(e), "system_status": "error"}



port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.DEBUG
    )
