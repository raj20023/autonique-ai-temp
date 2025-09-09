"""
ChromaDB connection and collection management for FAQ vector search
"""

import chromadb
from chromadb.api import ClientAPI
from chromadb.api.models.Collection import Collection
from fastapi import Depends
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: Optional[ClientAPI] = None
_collection: Optional[Collection] = None

def get_chroma_client() -> ClientAPI:
    """Get or create ChromaDB client"""
    global _client
    if _client is None:
        try:
            _client = chromadb.CloudClient(
                api_key=settings.CHROMA_API_KEY,
                tenant=settings.CHROMA_TENANT,
                database=settings.CHROMA_DATABASE
            )
            logger.info("✅ ChromaDB client initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize ChromaDB client: {e}")
            raise
    return _client

def get_chroma_collection(client: ClientAPI = Depends(get_chroma_client)) -> Collection:
    """Get or create ChromaDB collection for FAQs with cosine similarity"""
    global _collection
    if _collection is None:
        try:
            _collection = client.get_or_create_collection(
                name="faq_embeddings",
                metadata={
                    "description": "FAQ question and answer embeddings for similarity search",
                    "version": "1.0"
                },
                configuration={
                    "hnsw": {
                        "space": "cosine"  # Use cosine similarity
                    }
                }
            )
            logger.info("✅ ChromaDB collection 'faq_embeddings' ready with cosine similarity")
        except Exception as e:
            logger.error(f"❌ Failed to get ChromaDB collection: {e}")
            raise
    return _collection

def get_chroma_collection_direct() -> Collection:
    """Get ChromaDB collection without FastAPI dependency injection with cosine similarity"""
    client = get_chroma_client()
    try:
        collection = client.get_or_create_collection(
            name="faq_embeddings",
            metadata={
                "description": "FAQ question and answer embeddings for similarity search",
                "version": "1.0"
            },
            configuration={
                "hnsw": {
                    "space": "cosine"  # Use cosine similarity
                }
            }
        )
        return collection
    except Exception as e:
        logger.error(f"❌ Failed to get ChromaDB collection directly: {e}")
        raise

def test_chroma_connection() -> bool:
    """Test ChromaDB connection"""
    try:
        client = get_chroma_client()
        collection = get_chroma_collection_direct()
        
        # Test basic operations
        test_id = "test_connection"
        test_doc = "This is a test document"
        test_metadata = {"type": "test", "timestamp": "2024-01-01"}
        
        # Add test document
        collection.add(
            ids=[test_id],
            documents=[test_doc],
            metadatas=[test_metadata]
        )
        
        # Query test document
        results = collection.query(
            query_texts=[test_doc],
            n_results=1
        )
        
        # Clean up test document
        collection.delete(ids=[test_id])
        
        logger.info("✅ ChromaDB connection test successful")
        return True
        
    except Exception as e:
        logger.error(f"❌ ChromaDB connection test failed: {e}")
        return False
