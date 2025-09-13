"""
Enhanced FAQ service using ChromaDB for vector search
Searches against both questions AND answers for better matching
"""

import logging
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.models.faq import FAQ
from app.models.message import Message
from app.services.openai_service import OpenAIService
from app.core.chroma_connection import get_chroma_collection_direct
from app.schemas.faq import FAQMatch

logger = logging.getLogger(__name__)

class ChromaFAQService:
    """Enhanced FAQ service with ChromaDB vector search"""
    
    def __init__(self):
        self.openai_service = OpenAIService()
        self.collection = None
        
    def _get_collection(self):
        """Get ChromaDB collection with lazy loading"""
        if self.collection is None:
            self.collection = get_chroma_collection_direct()
        return self.collection
    
    def _create_faq_document(self, question: str, answer: str) -> str:
        """Create combined document text for better vector search"""
        # Combine question and answer with clear separation
        # Weight question higher by including it twice
        combined_text = f"Question: {question}\n\nAnswer: {answer}\n\nQ: {question}"
        return combined_text
    
    def _create_faq_id(self, user_id: int, faq_id: int) -> str:
        """Create unique ID for ChromaDB document"""
        return f"user_{user_id}_faq_{faq_id}"
    
    async def add_faq_to_chroma(self, user_id: int, faq: FAQ) -> bool:
        """Add FAQ to ChromaDB with combined question+answer embedding"""
        try:
            collection = self._get_collection()
            
            # Create combined document for better search
            combined_text = self._create_faq_document(faq.question, faq.answer)
            
            # Create metadata
            metadata = {
                "user_id": user_id,
                "faq_id": faq.id,
                "question": faq.question,
                "answer": faq.answer,
                "similarity_threshold": faq.similarity_threshold,
                "created_at": faq.created_at.isoformat() if faq.created_at else None,
                "is_active": faq.is_active
            }

            # Add to ChromaDB (let ChromaDB generate embeddings automatically)
            chroma_id = self._create_faq_id(user_id, faq.id)
            collection.add(
                ids=[chroma_id],
                documents=[combined_text],
                metadatas=[metadata]
            )
            
            logger.info(f"✅ Added FAQ {faq.id} to ChromaDB for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to add FAQ {faq.id} to ChromaDB: {e}")
            return False
    
    async def update_faq_in_chroma(self, user_id: int, faq: FAQ) -> bool:
        """Update FAQ in ChromaDB"""
        try:
            # Delete old version
            await self.delete_faq_from_chroma(user_id, faq.id)
            
            # Add updated version
            return await self.add_faq_to_chroma(user_id, faq)
            
        except Exception as e:
            logger.error(f"❌ Failed to update FAQ {faq.id} in ChromaDB: {e}")
            return False
    
    async def delete_faq_from_chroma(self, user_id: int, faq_id: int) -> bool:
        """Delete FAQ from ChromaDB"""
        try:
            collection = self._get_collection()
            chroma_id = self._create_faq_id(user_id, faq_id)
            
            collection.delete(ids=[chroma_id])
            
            logger.info(f"✅ Deleted FAQ {faq_id} from ChromaDB for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to delete FAQ {faq_id} from ChromaDB: {e}")
            return False
    
    async def search_faqs(self, user_id: int, query: str, n_results: int = 5) -> List[Dict]:
        """Search FAQs using ChromaDB vector search"""
        try:
            collection = self._get_collection()

            # Search in ChromaDB using text query with user_id filtering
            results = collection.query(
                query_texts=[query],
                where={"user_id": user_id},
                n_results=n_results
            )

            logger.info(f"🔍 ChromaDB results for user {user_id}: {len(results['ids'][0]) if results['ids'] else 0} matches")
            
            # Process results
            matches = []
            if results['ids'] and len(results['ids'][0]) > 0:
                logger.info(f"🔍 Found {len(results['ids'][0])} FAQ matches before filtering for user {user_id}")
                logger.debug(f"🔍 ChromaDB raw results: {results}")
                for i in range(len(results['ids'][0])):
                    metadata = results['metadatas'][0][i]
                    distance = results['distances'][0][i] if results['distances'] else None
                    
                    # Convert distance to similarity score (ChromaDB uses cosine distance)
                    similarity_score = 1 - distance if distance is not None else 0.0

                    # No threshold filtering - let LLM decide if FAQ is relevant
                    # ChromaDB uses cosine distance, so lower distance = better match
                    # Convert distance to similarity score for consistency
                    matches.append({
                        "faq_id": metadata['faq_id'],
                        "question": metadata['question'],
                        "answer": metadata['answer'],
                        "similarity_score": similarity_score,
                        "distance": distance
                    })
            
            logger.info(f"🔍 Found {len(matches)} FAQ matches for user {user_id}")
            return matches
            
        except Exception as e:
            logger.error(f"❌ Failed to search FAQs in ChromaDB: {e}")
            return []
    
    async def find_best_matching_faq(self, user_id: int, query: str) -> Optional[FAQMatch]:
        """Find the best matching FAQ using ChromaDB"""
        try:
            matches = await self.search_faqs(user_id, query, n_results=1)
            
            if matches:
                best_match = matches[0]
                return FAQMatch(
                    faq_id=best_match['faq_id'],
                    question=best_match['question'],
                    answer=best_match['answer'],
                    similarity_score=best_match['similarity_score']
                )
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Failed to find best matching FAQ: {e}")
            return None
    
    async def migrate_existing_faqs(self, db: Session) -> Dict[str, int]:
        """Migrate all existing FAQs from PostgreSQL to ChromaDB"""
        try:
            # Get all active FAQs
            faqs = db.query(FAQ).filter(FAQ.is_active == True).all()
            
            stats = {"total": len(faqs), "success": 0, "failed": 0}
            
            for faq in faqs:
                success = await self.add_faq_to_chroma(faq.user_id, faq)
                if success:
                    stats["success"] += 1
                else:
                    stats["failed"] += 1
            
            logger.info(f"📊 Migration complete: {stats}")
            return stats
            
        except Exception as e:
            logger.error(f"❌ Failed to migrate FAQs: {e}")
            return {"total": 0, "success": 0, "failed": 0}
