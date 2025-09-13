#!/usr/bin/env python3
"""
Script to reset ChromaDB collection to use OpenAI embeddings
This fixes the embedding function conflict error
"""

import os
import sys
import logging

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.chroma_connection import get_chroma_client
from chromadb.utils import embedding_functions
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_chroma_collection():
    """Reset ChromaDB collection to use OpenAI embeddings"""
    try:
        client = get_chroma_client()
        
        # Delete existing collection if it exists
        try:
            client.delete_collection("faq_embeddings")
            logger.info("✅ Deleted existing ChromaDB collection 'faq_embeddings'")
        except Exception as e:
            logger.info(f"ℹ️ No existing collection to delete: {e}")
        
        # Create new collection with OpenAI embeddings
        openai_ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key=settings.OPENAI_API_KEY,
            model_name="text-embedding-3-small"
        )
        
        collection = client.create_collection(
            name="faq_embeddings",
            embedding_function=openai_ef,
            metadata={
                "description": "FAQ question and answer embeddings using OpenAI",
                "version": "2.0",
                "embedding_model": "text-embedding-3-small"
            }
        )
        
        logger.info("✅ Created new ChromaDB collection with OpenAI embeddings")
        logger.info("🎉 ChromaDB reset complete! No more embedding function conflicts.")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to reset ChromaDB collection: {e}")
        return False

if __name__ == "__main__":
    logger.info("🔄 Resetting ChromaDB collection to use OpenAI embeddings...")
    
    if reset_chroma_collection():
        logger.info("✅ Reset successful! You can now restart your server.")
    else:
        logger.error("❌ Reset failed! Please check your configuration.")
