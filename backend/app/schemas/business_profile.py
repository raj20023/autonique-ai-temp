from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BusinessProfileBase(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    industry: Optional[str] = None
    business_description: Optional[str] = None
    brand_personality: Optional[str] = None
    target_audience: Optional[str] = None
    communication_tone: Optional[str] = None
    preferred_language: Optional[str] = "English"
    response_style: Optional[str] = None
    business_hours: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    typical_customer_questions: Optional[str] = None
    common_issues: Optional[str] = None
    special_offers: Optional[str] = None
    greeting_style: Optional[str] = None
    closing_style: Optional[str] = None
    use_emojis: Optional[bool] = True
    mention_business_name: Optional[bool] = True

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileUpdate(BusinessProfileBase):
    is_completed: Optional[bool] = None

class BusinessProfileResponse(BusinessProfileBase):
    id: int
    user_id: int
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Onboarding form structure for frontend
class OnboardingStep(BaseModel):
    step: int
    title: str
    description: str
    fields: list

class OnboardingFormData(BaseModel):
    # Step 1: Business Basics
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    industry: Optional[str] = None
    
    # Step 2: Brand Personality
    business_description: Optional[str] = None
    brand_personality: Optional[str] = None
    target_audience: Optional[str] = None
    
    # Step 3: Communication Style
    communication_tone: Optional[str] = None
    response_style: Optional[str] = None
    greeting_style: Optional[str] = None
    closing_style: Optional[str] = None
    use_emojis: Optional[bool] = True
    
    # Step 4: Business Operations
    business_hours: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    
    # Step 5: Customer Service
    typical_customer_questions: Optional[str] = None
    common_issues: Optional[str] = None
    special_offers: Optional[str] = None
    mention_business_name: Optional[bool] = True
