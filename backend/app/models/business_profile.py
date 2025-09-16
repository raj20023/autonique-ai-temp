from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Basic Business Information
    business_name = Column(String, nullable=True)
    business_type = Column(String, nullable=True)  # e.g., "restaurant", "clothing", "tech", etc.
    industry = Column(String, nullable=True)
    
    # Business Description & Personality
    business_description = Column(Text, nullable=True)
    brand_personality = Column(String, nullable=True)  # e.g., "friendly", "professional", "casual"
    target_audience = Column(String, nullable=True)
    
    # Communication Style
    communication_tone = Column(String, nullable=True)  # e.g., "formal", "casual", "enthusiastic"
    preferred_language = Column(String, default="English")
    response_style = Column(String, nullable=True)  # e.g., "detailed", "concise", "emoji-friendly"
    
    # Business Operations
    business_hours = Column(String, nullable=True)  # JSON string or formatted text
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Customer Service Preferences
    typical_customer_questions = Column(Text, nullable=True)
    common_issues = Column(Text, nullable=True)
    special_offers = Column(Text, nullable=True)
    
    # AI Response Customization
    greeting_style = Column(String, nullable=True)
    closing_style = Column(String, nullable=True)
    use_emojis = Column(Boolean, default=True)
    mention_business_name = Column(Boolean, default=True)
    
    # Completion Status
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="business_profile")

    def to_prompt_context(self) -> str:
        """Convert business profile to context string for AI prompts"""
        context_parts = []
        
        if self.business_name:
            context_parts.append(f"Business: {self.business_name}")
        
        if self.business_type:
            context_parts.append(f"Type: {self.business_type}")
        
        if self.business_description:
            context_parts.append(f"Description: {self.business_description}")
        
        if self.brand_personality:
            context_parts.append(f"Brand Personality: {self.brand_personality}")
        
        if self.target_audience:
            context_parts.append(f"Target Audience: {self.target_audience}")
        
        if self.communication_tone:
            context_parts.append(f"Communication Tone: {self.communication_tone}")
        
        if self.business_hours:
            context_parts.append(f"Business Hours: {self.business_hours}")
        
        if self.location:
            context_parts.append(f"Location: {self.location}")
        
        if self.typical_customer_questions:
            context_parts.append(f"Common Questions: {self.typical_customer_questions}")
        
        if self.special_offers:
            context_parts.append(f"Current Offers: {self.special_offers}")
        
        # Add style preferences
        style_notes = []
        if self.greeting_style:
            style_notes.append(f"Greeting: {self.greeting_style}")
        if self.closing_style:
            style_notes.append(f"Closing: {self.closing_style}")
        if self.use_emojis:
            style_notes.append("Use emojis appropriately")
        if self.mention_business_name:
            style_notes.append(f"Mention business name: {self.business_name}")
        
        if style_notes:
            context_parts.append(f"Style: {', '.join(style_notes)}")
        
        return "\n".join(context_parts)

    def __repr__(self):
        return f"<BusinessProfile(id={self.id}, user_id={self.user_id}, business_name='{self.business_name}')>"
