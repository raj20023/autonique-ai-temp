"""
Simple in-memory caching system to replace Redis
Cost-effective and lightweight for small to medium applications
"""

import time
from typing import Any, Dict, Optional
from threading import Lock
import logging

logger = logging.getLogger(__name__)

class SimpleCache:
    """Thread-safe in-memory cache with TTL support"""
    
    def __init__(self, default_ttl: int = 3600):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = Lock()
        self.default_ttl = default_ttl
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set a value in cache with optional TTL"""
        if ttl is None:
            ttl = self.default_ttl
        
        expires_at = time.time() + ttl if ttl > 0 else None
        
        with self._lock:
            self._cache[key] = {
                'value': value,
                'expires_at': expires_at,
                'created_at': time.time()
            }
    
    def get(self, key: str) -> Optional[Any]:
        """Get a value from cache"""
        with self._lock:
            if key not in self._cache:
                return None
            
            item = self._cache[key]
            
            # Check if expired
            if item['expires_at'] and time.time() > item['expires_at']:
                del self._cache[key]
                return None
            
            return item['value']
    
    def delete(self, key: str) -> bool:
        """Delete a key from cache"""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False
    
    def clear(self) -> None:
        """Clear all cache entries"""
        with self._lock:
            self._cache.clear()
    
    def exists(self, key: str) -> bool:
        """Check if key exists and is not expired"""
        return self.get(key) is not None
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count of removed items"""
        current_time = time.time()
        expired_keys = []
        
        with self._lock:
            for key, item in self._cache.items():
                if item['expires_at'] and current_time > item['expires_at']:
                    expired_keys.append(key)
            
            for key in expired_keys:
                del self._cache[key]
        
        if expired_keys:
            logger.info(f"Cleaned up {len(expired_keys)} expired cache entries")
        
        return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self._lock:
            total_items = len(self._cache)
            expired_items = 0
            current_time = time.time()
            
            for item in self._cache.values():
                if item['expires_at'] and current_time > item['expires_at']:
                    expired_items += 1
            
            return {
                'total_items': total_items,
                'active_items': total_items - expired_items,
                'expired_items': expired_items,
                'cache_size_mb': self._estimate_size_mb()
            }
    
    def _estimate_size_mb(self) -> float:
        """Rough estimate of cache size in MB"""
        import sys
        total_size = sys.getsizeof(self._cache)
        for key, item in self._cache.items():
            total_size += sys.getsizeof(key)
            total_size += sys.getsizeof(item)
            total_size += sys.getsizeof(item['value'])
        
        return total_size / (1024 * 1024)

class CacheManager:
    """Cache manager with different cache instances for different purposes"""
    
    def __init__(self):
        # Different caches for different purposes
        self.embeddings = SimpleCache(default_ttl=86400)  # 24 hours for embeddings
        self.responses = SimpleCache(default_ttl=3600)    # 1 hour for responses
        self.sessions = SimpleCache(default_ttl=1800)     # 30 minutes for sessions
        self.general = SimpleCache(default_ttl=3600)      # 1 hour for general cache
    
    def cleanup_all(self) -> Dict[str, int]:
        """Cleanup expired entries from all caches"""
        return {
            'embeddings': self.embeddings.cleanup_expired(),
            'responses': self.responses.cleanup_expired(),
            'sessions': self.sessions.cleanup_expired(),
            'general': self.general.cleanup_expired()
        }
    
    def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all caches"""
        return {
            'embeddings': self.embeddings.get_stats(),
            'responses': self.responses.get_stats(),
            'sessions': self.sessions.get_stats(),
            'general': self.general.get_stats()
        }
    
    def clear_all(self) -> None:
        """Clear all caches"""
        self.embeddings.clear()
        self.responses.clear()
        self.sessions.clear()
        self.general.clear()

# Global cache manager instance
cache_manager = CacheManager()

# Convenience functions for common operations
def cache_embedding(key: str, embedding: list, ttl: int = 86400) -> None:
    """Cache an embedding vector"""
    cache_manager.embeddings.set(key, embedding, ttl)

def get_cached_embedding(key: str) -> Optional[list]:
    """Get cached embedding vector"""
    return cache_manager.embeddings.get(key)

def cache_response(key: str, response: str, ttl: int = 3600) -> None:
    """Cache a generated response"""
    cache_manager.responses.set(key, response, ttl)

def get_cached_response(key: str) -> Optional[str]:
    """Get cached response"""
    return cache_manager.responses.get(key)

def cache_session_data(session_id: str, data: dict, ttl: int = 1800) -> None:
    """Cache session data"""
    cache_manager.sessions.set(session_id, data, ttl)

def get_cached_session_data(session_id: str) -> Optional[dict]:
    """Get cached session data"""
    return cache_manager.sessions.get(session_id)

# Background cleanup task (can be called periodically)
def cleanup_expired_cache_entries():
    """Cleanup expired entries from all caches"""
    stats = cache_manager.cleanup_all()
    total_cleaned = sum(stats.values())
    if total_cleaned > 0:
        logger.info(f"Cache cleanup completed: {stats}")
    return stats
