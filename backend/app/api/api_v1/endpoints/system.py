from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.cache import cache_manager, cleanup_expired_cache_entries
from app.core.config import settings

router = APIRouter()



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


