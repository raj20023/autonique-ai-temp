from typing import List, Dict, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import logging
import hashlib

from app.core.langchain_config import langchain_manager
from app.core.cache import cache_embedding, get_cached_embedding, cache_response, get_cached_response

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        # Use centralized LangChain manager
        self.langchain = langchain_manager

    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for text using Gemini with caching"""
        # Create cache key from text hash
        cache_key = f"embedding:{hashlib.md5(text.encode()).hexdigest()}"

        # Try to get from cache first
        cached_embedding = get_cached_embedding(cache_key)
        if cached_embedding:
            logger.debug(f"Cache hit for embedding: {cache_key}")
            return cached_embedding

        # Generate new embedding
        embedding = await self.langchain.get_embedding(text)

        # Cache the result
        cache_embedding(cache_key, embedding)
        logger.debug(f"Cached new embedding: {cache_key}")

        return embedding

    async def get_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings for multiple texts with caching"""
        embeddings = []
        uncached_texts = []
        uncached_indices = []

        # Check cache for each text
        for i, text in enumerate(texts):
            cache_key = f"embedding:{hashlib.md5(text.encode()).hexdigest()}"
            cached_embedding = get_cached_embedding(cache_key)

            if cached_embedding:
                embeddings.append(cached_embedding)
            else:
                embeddings.append(None)  # Placeholder
                uncached_texts.append(text)
                uncached_indices.append(i)

        # Generate embeddings for uncached texts
        if uncached_texts:
            new_embeddings = await self.langchain.get_embeddings_batch(uncached_texts)

            # Fill in the placeholders and cache new embeddings
            for idx, embedding in zip(uncached_indices, new_embeddings):
                embeddings[idx] = embedding
                cache_key = f"embedding:{hashlib.md5(texts[idx].encode()).hexdigest()}"
                cache_embedding(cache_key, embedding)

        return embeddings

    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings"""
        try:
            # Convert to numpy arrays and reshape for sklearn
            emb1 = np.array(embedding1).reshape(1, -1)
            emb2 = np.array(embedding2).reshape(1, -1)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(emb1, emb2)[0][0]
            return float(similarity)
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0

    def find_best_match(self, query_embedding: List[float], faq_embeddings: List[Dict]) -> Optional[Dict]:
        """Find the best matching FAQ based on embeddings"""
        best_match = None
        best_score = 0.0

        for faq_data in faq_embeddings:
            if not faq_data.get("embedding"):
                continue
                
            similarity = self.calculate_similarity(query_embedding, faq_data["embedding"])
            
            # Check if similarity meets threshold and is better than current best
            threshold = faq_data.get("similarity_threshold", 0.8)
            if similarity >= threshold and similarity > best_score:
                best_score = similarity
                best_match = {
                    "faq_id": faq_data["id"],
                    "question": faq_data["question"],
                    "answer": faq_data["answer"],
                    "similarity_score": similarity
                }

        return best_match

    async def generate_response(self, user_message: str, faq_answer: str) -> str:
        """Generate a personalized response based on FAQ answer using LangChain with caching"""
        # Create cache key for response
        cache_key = f"response:{hashlib.md5(f'{user_message}:{faq_answer}'.encode()).hexdigest()}"

        # Try to get from cache first
        cached_response = get_cached_response(cache_key)
        if cached_response:
            logger.debug(f"Cache hit for response: {cache_key}")
            return cached_response

        # Generate new response
        response = await self.langchain.generate_response(user_message, faq_answer)

        # Cache the result
        cache_response(cache_key, response)
        logger.debug(f"Cached new response: {cache_key}")

        return response

    async def generate_response_with_relevance_check(self, user_message: str, faq_answer: str, faq_question: str) -> str:
        """Generate response with relevance check - if FAQ not relevant, return 'not found' message"""
        # Create cache key for response
        cache_key = f"relevance_response:{hashlib.md5(f'{user_message}:{faq_answer}:{faq_question}'.encode()).hexdigest()}"

        # Try to get from cache first
        cached_response = get_cached_response(cache_key)
        if cached_response:
            logger.debug(f"Cache hit for relevance response: {cache_key}")
            return cached_response

        # Generate response with relevance check
        response = await self.langchain.generate_response_with_relevance_check(user_message, faq_answer, faq_question)

        # Cache the result
        cache_response(cache_key, response)
        logger.debug(f"Cached new relevance response: {cache_key}")

        return response

    async def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of user message using Gemini"""
        return await self.langchain.analyze_sentiment(text)

    async def extract_intent(self, text: str) -> str:
        """Extract user intent from message using Gemini"""
        return await self.langchain.extract_intent(text)


