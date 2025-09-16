from typing import List, Dict, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import logging
import hashlib

from app.core.langchain_config import langchain_manager
from app.core.cache import cache_embedding, get_cached_embedding, cache_response, get_cached_response
from langchain.schema import HumanMessage, AIMessage, SystemMessage

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        # Use centralized LangChain manager
        self.langchain = langchain_manager

    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for text using OpenAI with caching"""
        # Create cache key from text hash
        cache_key = f"embedding:{hashlib.md5(text.encode()).hexdigest()}"

        # Try to get from cache first
        cached_embedding = get_cached_embedding(cache_key)
        if cached_embedding:
            logger.debug(f"Cache hit for embedding: {cache_key}")
            return cached_embedding

        try:
            # Generate new embedding
            embedding = await self.langchain.get_embedding(text)

            # Cache the result
            cache_embedding(cache_key, embedding)
            logger.debug(f"Cached new embedding: {cache_key}")

            return embedding

        except Exception as e:
            logger.error(f"❌ Error generating embedding: {e}")
            raise

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
            try:
                new_embeddings = await self.langchain.get_embeddings_batch(uncached_texts)

                # Fill in the placeholders and cache new embeddings
                for idx, embedding in zip(uncached_indices, new_embeddings):
                    embeddings[idx] = embedding
                    cache_key = f"embedding:{hashlib.md5(texts[idx].encode()).hexdigest()}"
                    cache_embedding(cache_key, embedding)

            except Exception as e:
                logger.error(f"❌ Error generating batch embeddings: {e}")
                raise

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
        """Find the best matching FAQ based on embedding similarity"""
        if not faq_embeddings:
            return None

        best_match = None
        best_score = 0.0

        for faq_data in faq_embeddings:
            if faq_data.get('embedding'):
                similarity = self.calculate_similarity(query_embedding, faq_data['embedding'])
                
                # Use the FAQ's individual similarity threshold
                threshold = faq_data.get('similarity_threshold', 0.8)
                
                if similarity >= threshold and similarity > best_score:
                    best_score = similarity
                    best_match = {
                        'id': faq_data['id'],
                        'question': faq_data['question'],
                        'answer': faq_data['answer'],
                        'similarity_score': similarity
                    }

        return best_match

    async def generate_response(self, context: str, user_message: str, business_context: Optional[str] = None) -> str:
        """Generate AI response using OpenAI with caching"""
        # Create cache key from context and message
        cache_key = f"response:{hashlib.md5(f'{context}:{user_message}'.encode()).hexdigest()}"

        # Try to get from cache first
        cached_response = get_cached_response(cache_key)
        if cached_response:
            logger.debug(f"Cache hit for response: {cache_key}")
            return cached_response

    async def generate_response_with_history(self, user_message: str, faq_context: str, conversation_history: List[Dict[str, str]], business_context: str = "") -> str:
        """Generate AI response using LangChain's message format with conversation history"""
        try:
            # Build messages array in LangChain format
            messages = []

            # Add system message with detailed prompt including business context
            business_info = f"\n\nBusiness Information:\n{business_context}" if business_context else ""

            if faq_context != "No FAQ found":
                system_prompt = f"""You are a helpful customer service assistant for an Instagram business.{business_info}

Based on this FAQ information: "{faq_context}"

Please provide a natural, conversational response that:
1. Acknowledges the conversation history if relevant
2. Directly addresses their current question
3. Uses the FAQ information when appropriate
4. Incorporates business personality and tone if provided
5. Maintains a friendly, professional tone consistent with the brand
6. Feels like a continuation of the conversation, not a robotic response

Keep the response concise and helpful."""
            else:
                system_prompt = f"""You are a helpful customer service assistant for an Instagram business.{business_info}

Since no specific FAQ matches this question, please provide a helpful response that:
1. Acknowledges the conversation history if relevant
2. Addresses their message naturally using business context
3. Offers to help or asks for clarification if needed
4. Maintains conversation continuity
5. Uses the business personality and communication style if provided
6. Suggests they wait for a human representative if the query is complex

Keep the response natural and conversational, reflecting the business brand."""

            messages.append(SystemMessage(content=system_prompt))

            # Add conversation history in proper LangChain format (OpenAI handles the context)
            for entry in conversation_history[-5:]:  # Last 5 exchanges
                if entry["role"] == "customer":
                    messages.append(HumanMessage(content=entry["message"]))
                else:  # assistant
                    messages.append(AIMessage(content=entry["message"]))

            # Add current user message (no need to include context in message, it's in system prompt)
            messages.append(HumanMessage(content=user_message))

            # Generate response using LangChain with message history
            response = await self.langchain.generate_response_with_messages(messages)

            logger.info(f"✅ Generated contextual response with conversation history using LangChain messages")
            return response

        except Exception as e:
            logger.error(f"Error generating response with history: {e}")
            # Fallback to basic response
            return await self.generate_response(user_message, faq_context)

        try:
            # Generate new response using LangChain (only takes 2 parameters)
            response = await self.langchain.generate_response(user_message, context)

            # Cache the result
            cache_response(cache_key, response)
            logger.debug(f"Cached new response: {cache_key}")

            return response
        except Exception as e:
            logger.error(f"❌ Error generating response: {e}")
            raise

    async def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of text using OpenAI"""
        return await self.langchain.analyze_sentiment(text)

    async def extract_intent(self, text: str) -> str:
        """Extract user intent from message using OpenAI"""
        return await self.langchain.extract_intent(text)
