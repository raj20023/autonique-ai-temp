from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import os
import logging
import asyncio
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.core.database import engine, Base
from app.core.cache import cleanup_expired_cache_entries

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

@app.get("/cors-test")
def cors_test(request: Request):
    """Test CORS configuration"""
    return {
        "message": "CORS test successful",
        "origin": request.headers.get("origin"),
        "user_agent": request.headers.get("user-agent"),
        "host": request.headers.get("host")
    }

@app.get("/facebook-test")
async def facebook_test():
    """Test Facebook Graph API configuration"""
    from app.services.facebook_service import FacebookService

    facebook_service = FacebookService()

    return {
        "graph_url": facebook_service.graph_url,
        "app_id": facebook_service.app_id[:10] + "..." if facebook_service.app_id else "NOT SET",
        "app_secret": "SET" if facebook_service.app_secret else "NOT SET",
        "test_url": f"{facebook_service.graph_url}/me/accounts"
    }

@app.get("/debug-permissions")
async def debug_permissions(access_token: str):
    """Debug endpoint to check Facebook permissions"""
    from app.services.facebook_service import FacebookService

    facebook_service = FacebookService()

    try:
        permissions = await facebook_service.get_user_permissions(access_token)
        pages = await facebook_service.get_user_pages(access_token)

        return {
            "permissions": permissions,
            "pages_count": len(pages),
            "pages": pages
        }
    except Exception as e:
        return {"error": str(e)}

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



port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.DEBUG
    )
