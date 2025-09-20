from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.subscription import PlanType, SubscriptionStatus, PaymentStatus

# Plan schemas
class PlanBase(BaseModel):
    name: str
    plan_type: PlanType
    price: float
    currency: str = "INR"
    monthly_messages: int
    instagram_accounts: int
    basic_faq: bool = True
    analytics: bool = False
    advanced_analytics: bool = False
    team_handoff: bool = False
    description: Optional[str] = None

class PlanCreate(PlanBase):
    pass

class PlanResponse(PlanBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Subscription schemas
class SubscriptionBase(BaseModel):
    plan_id: int

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    razorpay_subscription_id: Optional[str] = None
    razorpay_plan_id: Optional[str] = None
    status: SubscriptionStatus
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    messages_used_this_month: int
    last_usage_reset: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    cancellation_reason: Optional[str] = None
    plan: PlanResponse

    class Config:
        from_attributes = True

# Payment schemas
class PaymentBase(BaseModel):
    subscription_id: int
    amount: float
    currency: str = "INR"

class PaymentCreate(PaymentBase):
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    user_id: int
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    status: PaymentStatus
    billing_start: Optional[datetime] = None
    billing_end: Optional[datetime] = None
    payment_method: Optional[str] = None
    failure_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Razorpay specific schemas
class RazorpayOrderCreate(BaseModel):
    amount: int  # Amount in paise
    currency: str = "INR"
    receipt: str
    notes: Optional[dict] = None

class RazorpayPaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class SubscriptionCreateRequest(BaseModel):
    plan_id: int
    payment_method: Optional[str] = "razorpay"

class SubscriptionUpgradeRequest(BaseModel):
    new_plan_id: int

class UsageStats(BaseModel):
    messages_used: int
    messages_limit: int
    usage_percentage: float
    days_remaining: int
    next_reset_date: datetime
