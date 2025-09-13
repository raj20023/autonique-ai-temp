#!/usr/bin/env python3
"""
Script to clear ChromaDB cache and reset collections to use OpenAI embeddings
This prevents the 79MB model download by using OpenAI embeddings directly
"""

import os
import shutil
import logging
from app.core.chroma_connection import get_chroma_client, get_chroma_collection_direct

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clear_local_chroma_cache():
    """Clear local ChromaDB cache to prevent model downloads"""
    cache_paths = [
        "/root/.cache/chroma",
        os.path.expanduser("~/.cache/chroma"),
        os.path.expanduser("~/AppData/Local/chroma"),  # Windows
    ]
    
    for cache_path in cache_paths:
        if os.path.exists(cache_path):
            try:
                shutil.rmtree(cache_path)
                logger.info(f"✅ Cleared ChromaDB cache: {cache_path}")
            except Exception as e:
                logger.warning(f"⚠️ Could not clear cache {cache_path}: {e}")

def reset_chroma_collection():
    """Reset ChromaDB collection to use OpenAI embeddings"""
    try:
        client = get_chroma_client()
        
        # Delete existing collection if it exists
        try:
            client.delete_collection("faq_embeddings")
            logger.info("✅ Deleted old ChromaDB collection")
        except Exception:
            logger.info("ℹ️ No existing collection to delete")
        
        # Create new collection with OpenAI embeddings
        collection = get_chroma_collection_direct()
        logger.info("✅ Created new ChromaDB collection with OpenAI embeddings")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to reset ChromaDB collection: {e}")
        return False

if __name__ == "__main__":
    logger.info("🧹 Clearing ChromaDB cache and resetting collection...")
    
    # Clear local cache
    clear_local_chroma_cache()
    
    # Reset collection
    if reset_chroma_collection():
        logger.info("🎉 ChromaDB reset complete! No more 79MB downloads.")
    else:
        logger.error("❌ Failed to reset ChromaDB")
