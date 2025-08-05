"""
LangChain configuration and utilities for InstaReply
"""

from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, ConversationChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import BaseMessage, HumanMessage, SystemMessage
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
            template="""Analyze the sentiment of the following customer message.
            
            Message: {text}
            
            Return only a JSON object with these fields:
            - positive: score from 0 to 1
            - negative: score from 0 to 1  
            - neutral: score from 0 to 1
            - overall: "positive", "negative", or "neutral"
            
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
        """Initialize LangChain chains"""
        
        # Response generation chain
        self.response_chain = LLMChain(
            llm=self.llm,
            prompt=self.response_prompt,
            verbose=False
        )
        
        # Smart response chain
        self.smart_response_chain = LLMChain(
            llm=self.llm,
            prompt=self.smart_response_prompt,
            verbose=False
        )
        
        # Sentiment analysis chain
        self.sentiment_chain = LLMChain(
            llm=self.llm,
            prompt=self.sentiment_prompt,
            verbose=False
        )
        
        # Intent extraction chain
        self.intent_chain = LLMChain(
            llm=self.llm,
            prompt=self.intent_prompt,
            verbose=False
        )
        
        # FAQ suggestion chain
        self.faq_suggestion_chain = LLMChain(
            llm=self.llm,
            prompt=self.faq_suggestion_prompt,
            verbose=False
        )
        
        # Conversation summary chain
        self.summary_chain = LLMChain(
            llm=self.llm,
            prompt=self.summary_prompt,
            verbose=False
        )
        
        # Conversation chain with memory
        self.conversation_memory = ConversationBufferWindowMemory(
            k=5,  # Remember last 5 exchanges
            return_messages=True
        )
        
        self.conversation_chain = ConversationChain(
            llm=self.llm,
            memory=self.conversation_memory,
            verbose=False
        )
    
    async def generate_response(self, user_message: str, faq_answer: str) -> str:
        """Generate personalized response from FAQ"""
        try:
            response = await self.response_chain.arun(
                user_message=user_message,
                faq_answer=faq_answer
            )
            return response.strip()
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return faq_answer
    
    async def generate_smart_response(self, user_message: str, context: str = "") -> str:
        """Generate smart response without FAQ"""
        try:
            response = await self.smart_response_chain.arun(
                user_message=user_message,
                context=context
            )
            return response.strip()
        except Exception as e:
            logger.error(f"Error generating smart response: {e}")
            return "Thank you for your message. We'll get back to you soon!"
    
    async def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of text"""
        try:
            result = await self.sentiment_chain.arun(text=text)
            import json
            return json.loads(result.strip())
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return {
                "positive": 0.5,
                "negative": 0.0,
                "neutral": 0.5,
                "overall": "neutral"
            }
    
    async def extract_intent(self, text: str) -> str:
        """Extract intent from text"""
        try:
            intent = await self.intent_chain.arun(text=text)
            return intent.strip().lower()
        except Exception as e:
            logger.error(f"Error extracting intent: {e}")
            return "other"
    
    async def suggest_faq(self, messages: List[str]) -> Optional[Dict]:
        """Generate FAQ suggestion from similar messages"""
        try:
            messages_text = "\n".join([f"- {msg}" for msg in messages])
            result = await self.faq_suggestion_chain.arun(messages=messages_text)
            import json
            return json.loads(result.strip())
        except Exception as e:
            logger.error(f"Error suggesting FAQ: {e}")
            return None
    
    async def summarize_conversation(self, conversation: str) -> str:
        """Summarize a conversation"""
        try:
            summary = await self.summary_chain.arun(conversation=conversation)
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
