import asyncio
import logging
import time
import os
import sys
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict

from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.core.database import engine, Base, get_db
from app.core.cache import cleanup_expired_cache_entries
from app.api.deps import get_current_active_user
from app.models.user import User
from app.services.token_refresh_service import token_refresh_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def periodic_cache_cleanup():
    """Periodically clean up expired cache entries"""
    while True:
        try:
            cleanup_expired_cache_entries()
            # Wait 1 hour before next cleanup
            await asyncio.sleep(3600)
        except Exception as e:
            logger.error(f"Error in cache cleanup: {e}")
            # Wait 10 minutes before retrying
            await asyncio.sleep(600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting application...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Start background tasks
    logger.info("Starting background tasks...")
    
    # Start cache cleanup task
    cache_task = asyncio.create_task(periodic_cache_cleanup())
    
    # Start token refresh task (less frequent for long-lived tokens)
    try:
        token_task = asyncio.create_task(token_refresh_service.start_periodic_refresh(24))  # Every 24 hours
        logger.info("Token refresh service started")
    except Exception as e:
        logger.warning(f"Could not start token refresh service: {e}")
        token_task = None
    
    yield
    
    # Cleanup
    logger.info("Shutting down application...")
    
    # Cancel background tasks
    cache_task.cancel()
    try:
        await cache_task
    except asyncio.CancelledError:
        pass

    if 'token_task' in locals() and token_task:
        token_task.cancel()
        try:
            await token_task
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

# Custom middleware to bypass CORS for webhook endpoints
class WebhookCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip CORS for webhook endpoints
        if request.url.path.startswith("/api/v1/webhook"):
            response = await call_next(request)
            # Add permissive headers for webhook endpoints
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            return response
        else:
            return await call_next(request)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Add custom webhook CORS middleware first
app.add_middleware(WebhookCORSMiddleware)

# CORS middleware for regular API endpoints
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
        # Test token encryption/decryption
        from app.core.security import encrypt_token, decrypt_token
        test_token = "health_check_token"
        encrypted = encrypt_token(test_token)
        decrypted = decrypt_token(encrypted)
        encryption_ok = (test_token == decrypted)

        return {
            "status": "healthy",
            "timestamp": time.time(),
            "service": "autonique-backend",
            "encryption": "ok" if encryption_ok else "error"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }

port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.DEBUG
    )
