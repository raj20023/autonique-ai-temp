"""
LangChain configuration and utilities for InstaReply
"""

from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import Dict, List, Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

class LangChainManager:
    """Centralized LangChain configuration and chain management"""
    
    def __init__(self):
        self.llm = GoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
            max_output_tokens=1024
        )
        
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GOOGLE_API_KEY
        )
        
        # Initialize prompt templates
        self._init_prompts()
        
        # Initialize chains
        self._init_chains()
    
    def _init_prompts(self):
        """Initialize all prompt templates"""
        
        # Customer service response prompt
        self.response_prompt = PromptTemplate(
            input_variables=["user_message", "faq_answer"],
            template="""You are a helpful customer service assistant for an Instagram business.
            Personalize the following FAQ answer to respond naturally to the user's message.
            Keep it friendly, conversational, and professional.

            User message: {user_message}
            FAQ answer: {faq_answer}

            Personalized response:"""
        )

        # Response with relevance check prompt
        self.relevance_response_prompt = PromptTemplate(
            input_variables=["user_message", "faq_answer", "faq_question"],
            template="""You are a helpful customer service assistant for an Instagram business.

            A user asked: "{user_message}"

            We found this FAQ that might be relevant:
            FAQ Question: "{faq_question}"
            FAQ Answer: "{faq_answer}"

            INSTRUCTIONS:
            1. If the FAQ is relevant to the user's question, provide a personalized, friendly response based on the FAQ answer.
            2. If the FAQ is NOT relevant to what the user is asking, respond EXACTLY with: "I couldn't find an answer to your question in our FAQs. Please wait for our team to get back to you, or feel free to ask something else!"

            Be strict about relevance - only use the FAQ if it actually answers the user's question.

            Response:"""
        )
        
        # Smart response prompt (no FAQ match)
        self.smart_response_prompt = PromptTemplate(
            input_variables=["user_message", "context"],
            template="""You are a helpful customer service assistant for an Instagram business.
            Respond to the user's message in a friendly and professional manner.
            
            {context}
            
            User message: {user_message}
            
            Provide a helpful response:"""
        )
        
        # Sentiment analysis prompt
        self.sentiment_prompt = PromptTemplate(
            input_variables=["text"],
            template="""Analyze the sentiment of the following customer message and return ONLY a valid JSON object.

Message: {text}

Return exactly this JSON format (no additional text):
{{"positive": 0.0, "negative": 0.0, "neutral": 1.0, "overall": "neutral"}}

Replace the values with your analysis:
- positive: score from 0.0 to 1.0
- negative: score from 0.0 to 1.0
- neutral: score from 0.0 to 1.0
- overall: exactly one of "positive", "negative", or "neutral"

JSON:"""
        )
        
        # Intent extraction prompt
        self.intent_prompt = PromptTemplate(
            input_variables=["text"],
            template="""Analyze the following customer message and identify the primary intent.
            
            Message: {text}
            
            Common intents include:
            - question (asking for information)
            - complaint (expressing dissatisfaction)
            - compliment (expressing satisfaction)
            - request (asking for action)
            - greeting (saying hello)
            - goodbye (ending conversation)
            - order_inquiry (asking about orders)
            - product_inquiry (asking about products)
            - support (technical support)
            - other
            
            Return only the intent category:"""
        )
        
        # FAQ suggestion prompt
        self.faq_suggestion_prompt = PromptTemplate(
            input_variables=["messages"],
            template="""Based on these similar customer messages, suggest a FAQ entry.
            
            Customer messages:
            {messages}
            
            Create a clear, concise FAQ entry that would address these inquiries.
            
            Return only a JSON object with:
            - question: A clear question that covers these inquiries
            - answer: A helpful answer that addresses the common concern
            
            JSON:"""
        )
        
        # Conversation summary prompt
        self.summary_prompt = PromptTemplate(
            input_variables=["conversation"],
            template="""Summarize the following customer conversation for internal records.
            
            Conversation:
            {conversation}
            
            Provide a brief summary including:
            - Main topic/issue
            - Customer sentiment
            - Resolution status
            - Any follow-up needed
            
            Summary:"""
        )
    
    def _init_chains(self):
        """Initialize LangChain chains using modern RunnableSequence"""

        # Response generation chain (modern pattern)
        self.response_chain = self.response_prompt | self.llm

        # Response with relevance check chain
        self.relevance_response_chain = self.relevance_response_prompt | self.llm

        # Smart response chain
        self.smart_response_chain = self.smart_response_prompt | self.llm

        # Sentiment analysis chain
        self.sentiment_chain = self.sentiment_prompt | self.llm

        # Intent extraction chain
        self.intent_chain = self.intent_prompt | self.llm
        
        # FAQ suggestion chain
        self.faq_suggestion_chain = self.faq_suggestion_prompt | self.llm

        # Conversation summary chain
        self.summary_chain = self.summary_prompt | self.llm

        # Modern conversation chain with message history
        self.conversation_history = InMemoryChatMessageHistory()

        # Create conversation prompt with message history
        conversation_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful AI assistant for Instagram customer service."),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])

        # Create conversation chain with history
        self.conversation_chain = conversation_prompt | self.llm
    
    async def generate_response(self, user_message: str, faq_answer: str) -> str:
        """Generate personalized response from FAQ"""
        try:
            response = await self.response_chain.ainvoke({
                "user_message": user_message,
                "faq_answer": faq_answer
            })
            return response.content.strip() if hasattr(response, 'content') else str(response).strip()
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return faq_answer

    async def generate_response_with_relevance_check(self, user_message: str, faq_answer: str, faq_question: str) -> str:
        """Generate response with relevance check"""
        try:
            response = await self.relevance_response_chain.ainvoke({
                "user_message": user_message,
                "faq_answer": faq_answer,
                "faq_question": faq_question
            })
            return response.content.strip() if hasattr(response, 'content') else str(response).strip()
        except Exception as e:
            logger.error(f"Error generating response with relevance check: {e}")
            return "I couldn't find an answer to your question in our FAQs. Please wait for our team to get back to you, or feel free to ask something else!"
    
    async def generate_smart_response(self, user_message: str, context: str = "") -> str:
        """Generate smart response without FAQ"""
        try:
            response = await self.smart_response_chain.ainvoke({
                "user_message": user_message,
                "context": context
            })
            return response.content.strip() if hasattr(response, 'content') else str(response).strip()
        except Exception as e:
            logger.error(f"Error generating smart response: {e}")
            return "Thank you for your message. We'll get back to you soon!"
    
    async def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of text"""
        try:
            result = await self.sentiment_chain.ainvoke({"text": text})
            result_text = result.content if hasattr(result, 'content') else str(result)

            # Clean up the result text
            result_text = result_text.strip()
            logger.debug(f"Raw sentiment result: {result_text}")

            # Try to extract JSON from the response
            import json
            import re

            # Look for JSON object in the response
            json_match = re.search(r'\{[^}]*\}', result_text)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # If no JSON found, try to parse the whole response
                return json.loads(result_text)

        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            logger.error(f"Raw response was: {result_text if 'result_text' in locals() else 'N/A'}")
            # Return default sentiment
            return {
                "positive": 0.5,
                "negative": 0.0,
                "neutral": 0.5,
                "overall": "neutral"
            }
    
    async def extract_intent(self, text: str) -> str:
        """Extract intent from text"""
        try:
            result = await self.intent_chain.ainvoke({"text": text})
            intent = result.content if hasattr(result, 'content') else str(result)
            return intent.strip().lower()
        except Exception as e:
            logger.error(f"Error extracting intent: {e}")
            return "other"
    
    async def suggest_faq(self, messages: List[str]) -> Optional[Dict]:
        """Generate FAQ suggestion from similar messages"""
        try:
            messages_text = "\n".join([f"- {msg}" for msg in messages])
            result = await self.faq_suggestion_chain.ainvoke({"messages": messages_text})
            result_text = result.content if hasattr(result, 'content') else str(result)
            import json
            return json.loads(result_text.strip())
        except Exception as e:
            logger.error(f"Error suggesting FAQ: {e}")
            return None
    
    async def summarize_conversation(self, conversation: str) -> str:
        """Summarize a conversation"""
        try:
            result = await self.summary_chain.ainvoke({"conversation": conversation})
            summary = result.content if hasattr(result, 'content') else str(result)
            return summary.strip()
        except Exception as e:
            logger.error(f"Error summarizing conversation: {e}")
            return "Conversation summary unavailable"
    
    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding for text"""
        try:
            embedding = await self.embeddings.aembed_query(text.strip())
            return embedding
        except Exception as e:
            logger.error(f"Error getting embedding: {e}")
            raise
    
    async def get_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings for multiple texts"""
        try:
            embeddings = await self.embeddings.aembed_documents([text.strip() for text in texts])
            return embeddings
        except Exception as e:
            logger.error(f"Error getting batch embeddings: {e}")
            raise

# Global instance
langchain_manager = LangChainManager()
