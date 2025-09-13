from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import logging

from app.models.faq import FAQ
from app.models.message import Message
from app.services.gemini_service import GeminiService
from app.services.chroma_faq_service import ChromaFAQService
from app.schemas.faq import FAQMatch

logger = logging.getLogger(__name__)

class FAQService:
    def __init__(self):
        self.gemini_service = GeminiService()
        self.chroma_service = ChromaFAQService()

    async def create_faq_with_embedding(self, db: Session, user_id: int, question: str, answer: str, similarity_threshold: float = 0.8) -> FAQ:
        """Create a new FAQ with embedding"""
        try:
            # Generate embedding for the question (for PostgreSQL compatibility)
            embedding = await self.gemini_service.get_embedding(question)

            # Create FAQ record in PostgreSQL
            faq = FAQ(
                user_id=user_id,
                question=question,
                answer=answer,
                embedding_vector=embedding,
                similarity_threshold=similarity_threshold
            )

            db.add(faq)
            db.commit()
            db.refresh(faq)

            # Also add to ChromaDB with enhanced question+answer embedding
            try:
                await self.chroma_service.add_faq_to_chroma(user_id, faq)
                logger.info(f"✅ Created FAQ in both PostgreSQL and ChromaDB: {question[:50]}...")
            except Exception as chroma_error:
                logger.warning(f"⚠️ FAQ created in PostgreSQL but failed to add to ChromaDB: {chroma_error}")
                # Don't fail the entire operation if ChromaDB fails

            return faq

        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "quota" in error_str or "rate limit" in error_str:
                logger.error(f"🚫 Gemini API quota exceeded. FAQ creation failed. Please try again later or upgrade your API plan.")
                db.rollback()
                raise ValueError("API quota exceeded. Please try again later or check your Gemini API billing.")
            else:
                logger.error(f"Error creating FAQ with embedding: {e}")
                db.rollback()
                raise

    async def bulk_create_faqs_with_embeddings(self, db: Session, user_id: int, faq_data: List[Dict]) -> List[FAQ]:
        """Create multiple FAQs with embeddings in batch"""
        try:
            # Extract questions for batch embedding
            questions = [faq["question"] for faq in faq_data]
            embeddings = await self.gemini_service.get_embeddings_batch(questions)
            
            # Create FAQ records
            faqs = []
            for i, faq_info in enumerate(faq_data):
                faq = FAQ(
                    user_id=user_id,
                    question=faq_info["question"],
                    answer=faq_info["answer"],
                    embedding_vector=embeddings[i],
                    similarity_threshold=faq_info.get("similarity_threshold", 0.8)
                )
                faqs.append(faq)
            
            db.add_all(faqs)
            db.commit()
            
            for faq in faqs:
                db.refresh(faq)
            
            logger.info(f"Created {len(faqs)} FAQs for user {user_id}")
            return faqs
            
        except Exception as e:
            logger.error(f"Error bulk creating FAQs: {e}")
            db.rollback()
            raise

    async def find_matching_faq(self, db: Session, user_id: int, user_message: str) -> Optional[FAQMatch]:
        """Find the best matching FAQ using ChromaDB vector search"""
        try:
            logger.info(f"🔍 Searching for FAQ match using ChromaDB for user {user_id}")

            # Use ChromaDB for enhanced vector search
            best_match = await self.chroma_service.find_best_matching_faq(user_id, user_message)

            if best_match:
                # Update usage count in PostgreSQL
                faq = db.query(FAQ).filter(FAQ.id == best_match.faq_id).first()
                if faq:
                    faq.usage_count += 1
                    db.commit()

                logger.info(f"✅ Found FAQ match via ChromaDB: {best_match.question} (score: {best_match.similarity_score:.3f})")
                return best_match

            logger.info(f"❌ No suitable FAQ match found in ChromaDB for user {user_id}")
            return None

        except Exception as e:
            logger.error(f"❌ Error finding matching FAQ via ChromaDB: {e}")
            # Fallback to old method if ChromaDB fails
            logger.info("🔄 Falling back to PostgreSQL vector search...")
            return await self._find_matching_faq_fallback(db, user_id, user_message)

    async def _find_matching_faq_fallback(self, db: Session, user_id: int, user_message: str) -> Optional[FAQMatch]:
        """Fallback method using PostgreSQL embeddings"""
        try:
            # Get user's FAQs
            faqs = db.query(FAQ).filter(
                FAQ.user_id == user_id,
                FAQ.is_active == True
            ).all()

            if not faqs:
                return None

            # Generate embedding for user message
            message_embedding = await self.gemini_service.get_embedding(user_message)

            # Prepare FAQ data for matching
            faq_embeddings = []
            for faq in faqs:
                if faq.embedding_vector:
                    faq_embeddings.append({
                        "id": faq.id,
                        "question": faq.question,
                        "answer": faq.answer,
                        "embedding": faq.embedding_vector,
                        "similarity_threshold": faq.similarity_threshold
                    })

            # Find best match
            best_match = self.gemini_service.find_best_match(message_embedding, faq_embeddings)

            if best_match:
                return FAQMatch(**best_match)

            return None

        except Exception as e:
            logger.error(f"Error in fallback FAQ matching: {e}")
            return None

    async def update_faq_embedding(self, db: Session, faq_id: int) -> bool:
        """Update embedding for an existing FAQ"""
        try:
            faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
            if not faq:
                return False
            
            # Generate new embedding
            embedding = await self.gemini_service.get_embedding(faq.question)
            faq.embedding_vector = embedding
            
            db.commit()
            logger.info(f"Updated embedding for FAQ {faq_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating FAQ embedding: {e}")
            db.rollback()
            return False

    def get_user_faqs(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[FAQ]:
        """Get user's FAQs with pagination"""
        return db.query(FAQ).filter(
            FAQ.user_id == user_id
        ).offset(skip).limit(limit).all()

    def delete_faq(self, db: Session, faq_id: int, user_id: int) -> bool:
        """Delete a user's FAQ"""
        faq = db.query(FAQ).filter(
            FAQ.id == faq_id,
            FAQ.user_id == user_id
        ).first()

        if faq:
            db.delete(faq)
            db.commit()
            return True
        return False

    async def analyze_message_context(self, db: Session, user_id: int, user_message: str) -> Dict:
        """Analyze message context using Gemini for better responses"""
        try:
            # Get sentiment analysis (with fallback)
            try:
                sentiment = await self.gemini_service.analyze_sentiment(user_message)
                logger.debug(f"Sentiment analysis successful: {sentiment}")
            except Exception as e:
                logger.warning(f"Sentiment analysis failed, using default: {e}")
                sentiment = {
                    "positive": 0.5,
                    "negative": 0.0,
                    "neutral": 0.5,
                    "overall": "neutral"
                }

            # Extract intent (with fallback)
            try:
                intent = await self.gemini_service.extract_intent(user_message)
                logger.debug(f"Intent extraction successful: {intent}")
            except Exception as e:
                logger.warning(f"Intent extraction failed, using default: {e}")
                intent = "other"

            # Get conversation history (last 5 messages)
            recent_messages = db.query(Message).filter(
                Message.user_id == user_id
            ).order_by(Message.created_at.desc()).limit(5).all()

            history = [msg.message_text for msg in recent_messages]

            return {
                "sentiment": sentiment,
                "intent": intent,
                "history": history,
                "message_length": len(user_message),
                "has_question_marks": "?" in user_message,
                "has_exclamation": "!" in user_message
            }

        except Exception as e:
            logger.error(f"Error analyzing message context: {e}")
            return {
                "sentiment": {"overall": "neutral"},
                "intent": "other",
                "history": [],
                "message_length": len(user_message),
                "has_question_marks": "?" in user_message,
                "has_exclamation": "!" in user_message
            }

    async def find_smart_response(self, db: Session, user_id: int, user_message: str) -> Optional[str]:
        """Find response using FAQ matching with LLM relevance check"""
        try:
            # First try FAQ matching (without strict threshold)
            faq_match = await self.find_matching_faq(db, user_id, user_message)

            if faq_match:
                # Let LLM decide if FAQ is relevant and generate appropriate response
                return await self.gemini_service.generate_response_with_relevance_check(
                    user_message, faq_match.answer, faq_match.question
                )

            # If no FAQ match found, generate a smart contextual response
            logger.info(f"❌ No FAQ match found for user {user_id}, generating smart fallback")
            return await self.gemini_service.langchain.generate_smart_fallback(user_message)

        except Exception as e:
            logger.error(f"Error finding smart response: {e}")
            return "Thank you for your message! Our team will get back to you soon."



    async def improve_faq_from_interactions(self, db: Session, user_id: int) -> List[Dict]:
        """Analyze user interactions to suggest FAQ improvements"""
        try:
            # Get messages without FAQ matches
            unmatched_messages = db.query(Message).filter(
                Message.user_id == user_id,
                Message.matched_faq_id.is_(None),
                Message.auto_replied == False
            ).limit(50).all()

            if not unmatched_messages:
                return []

            # Group similar messages
            message_texts = [msg.message_text for msg in unmatched_messages]
            embeddings = await self.gemini_service.get_embeddings_batch(message_texts)

            # Simple clustering to find common themes
            suggestions = []
            processed = set()

            for i, msg in enumerate(unmatched_messages):
                if i in processed:
                    continue

                similar_messages = [msg.message_text]
                processed.add(i)

                # Find similar messages
                for j, other_msg in enumerate(unmatched_messages):
                    if j in processed or i == j:
                        continue

                    similarity = self.gemini_service.calculate_similarity(
                        embeddings[i], embeddings[j]
                    )

                    if similarity > 0.7:  # High similarity threshold
                        similar_messages.append(other_msg.message_text)
                        processed.add(j)

                # If we have multiple similar messages, suggest an FAQ
                if len(similar_messages) >= 3:
                    # Generate suggested FAQ using Gemini
                    suggestion = await self._generate_faq_suggestion(similar_messages)
                    if suggestion:
                        suggestions.append({
                            "suggested_question": suggestion["question"],
                            "suggested_answer": suggestion["answer"],
                            "similar_messages": similar_messages,
                            "frequency": len(similar_messages)
                        })

            return suggestions

        except Exception as e:
            logger.error(f"Error improving FAQ from interactions: {e}")
            return []

    async def _generate_faq_suggestion(self, similar_messages: List[str]) -> Optional[Dict]:
        """Generate FAQ suggestion from similar messages"""
        try:
            return await self.gemini_service.langchain.suggest_faq(similar_messages)
        except Exception as e:
            logger.error(f"Error generating FAQ suggestion: {e}")
            return None
