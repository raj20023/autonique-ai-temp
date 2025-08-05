from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.cache import cache_manager, cleanup_expired_cache_entries
from app.core.config import settings

router = APIRouter()

@router.get("/cache/stats")
def get_cache_stats(
    current_user: User = Depends(get_current_active_user)
):
    """Get cache statistics"""
    return {
        "cache_stats": cache_manager.get_all_stats(),
        "message": "Cache statistics retrieved"
    }

@router.post("/cache/cleanup")
def cleanup_cache(
    current_user: User = Depends(get_current_active_user)
):
    """Cleanup expired cache entries"""
    stats = cleanup_expired_cache_entries()
    total_cleaned = sum(stats.values())
    
    return {
        "cleanup_stats": stats,
        "total_cleaned": total_cleaned,
        "message": f"Cleaned up {total_cleaned} expired cache entries"
    }

@router.post("/cache/clear")
def clear_cache(
    current_user: User = Depends(get_current_active_user)
):
    """Clear all cache entries"""
    cache_manager.clear_all()
    
    return {
        "message": "All cache entries cleared"
    }

@router.get("/health")
def health_check():
    """System health check"""
    cache_stats = cache_manager.get_all_stats()

    # Calculate total cache usage
    total_items = sum(stats['total_items'] for stats in cache_stats.values())
    total_size_mb = sum(stats['cache_size_mb'] for stats in cache_stats.values())

    return {
        "status": "healthy",
        "cache": {
            "total_items": total_items,
            "total_size_mb": round(total_size_mb, 2)
        },
        "message": "System is running normally"
    }

@router.get("/debug/webhook-token")
def debug_webhook_token():
    """Debug endpoint to check webhook token (remove in production)"""
    return {
        "webhook_token": settings.WEBHOOK_VERIFY_TOKEN,
        "token_length": len(settings.WEBHOOK_VERIFY_TOKEN),
        "message": "Debug info for webhook token"
    }
