from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta, timezone
import enum
from app.core.database import Base

class PlanType(str, enum.Enum):
    starter = "starter"
    growth = "growth"
    pro = "pro"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PENDING = "pending"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # "Starter", "Growth", "Pro"
    plan_type = Column(String, nullable=False)  # Use string instead of enum
    price = Column(Float, nullable=False)  # Price in INR
    currency = Column(String, default="INR")
    
    # Plan limits
    monthly_messages = Column(Integer, nullable=False)  # 200, 1000, 5000
    instagram_accounts = Column(Integer, nullable=False)  # 1, 1, 3
    
    # Features
    basic_faq = Column(Boolean, default=True)
    analytics = Column(Boolean, default=False)
    advanced_analytics = Column(Boolean, default=False)
    team_handoff = Column(Boolean, default=False)
    
    # Metadata
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    
    # Razorpay details
    razorpay_subscription_id = Column(String, unique=True, nullable=True)
    razorpay_plan_id = Column(String, nullable=True)
    
    # Subscription details
    status = Column(String, default="pending")  # Use string instead of enum to avoid conversion issues
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    next_billing_date = Column(DateTime(timezone=True), nullable=True)
    
    # Usage tracking
    messages_used_this_month = Column(Integer, default=0)
    last_usage_reset = Column(DateTime(timezone=True), server_default=func.now())
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    cancellation_reason = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")

    def is_active(self):
        """Check if subscription is currently active"""
        if self.status != "active":
            return False
        if self.end_date and datetime.now(timezone.utc) > self.end_date:
            return False
        return True

    def days_remaining(self):
        """Get remaining days in subscription"""
        if not self.end_date:
            return 0
        remaining = self.end_date - datetime.now(timezone.utc)
        return max(0, remaining.days)

    def can_send_messages(self):
        """Check if user can send more messages this month"""
        return self.messages_used_this_month < self.plan.monthly_messages

    def reset_monthly_usage(self):
        """Reset monthly usage counter"""
        self.messages_used_this_month = 0
        self.last_usage_reset = datetime.now(timezone.utc)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Razorpay details
    razorpay_payment_id = Column(String, unique=True, nullable=True)
    razorpay_order_id = Column(String, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    
    # Payment details
    amount = Column(Float, nullable=False)  # Amount in INR
    currency = Column(String, default="INR")
    status = Column(String, default="pending")  # Use string instead of enum to avoid conversion issues
    
    # Billing period
    billing_start = Column(DateTime(timezone=True), nullable=True)
    billing_end = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    payment_method = Column(String, nullable=True)  # card, netbanking, upi, etc.
    failure_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    subscription = relationship("Subscription", back_populates="payments")
    user = relationship("User", back_populates="payments")
