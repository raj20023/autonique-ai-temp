from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.core.database import get_db
from app.core.config import settings
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.subscription import Plan, Subscription, Payment, SubscriptionStatus
from app.schemas.subscription import (
    PlanResponse, SubscriptionResponse, PaymentResponse,
    SubscriptionCreateRequest, RazorpayPaymentVerification,
    UsageStats, SubscriptionUpgradeRequest
)
from app.services.razorpay_service import RazorpayService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/plans", response_model=List[PlanResponse])
async def get_plans(db: Session = Depends(get_db)):
    """Get all available subscription plans"""
    plans = db.query(Plan).filter(Plan.is_active == True).order_by(Plan.price).all()
    return plans

@router.get("/current", response_model=SubscriptionResponse)
async def get_current_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="No subscription found"
        )
    
    return subscription

@router.post("/create-order")
async def create_subscription_order(
    request: SubscriptionCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create Razorpay order for subscription"""
    try:
        razorpay_service = RazorpayService()
        
        # Check if user already has an active subscription
        existing_subscription = db.query(Subscription).filter(
            Subscription.user_id == current_user.id,
            Subscription.status == "active"  # Use string directly
        ).first()
        
        if existing_subscription:
            raise HTTPException(
                status_code=400,
                detail="User already has an active subscription"
            )
        
        # Create order
        order_data = razorpay_service.create_subscription_order(
            db, current_user.id, request.plan_id
        )
        
        return {
            "order_id": order_data["order"]["id"],
            "amount": order_data["order"]["amount"],
            "currency": order_data["order"]["currency"],
            "plan_name": order_data["plan"].name,
            "plan_price": order_data["plan"].price,
            "razorpay_key": settings.RAZORPAY_KEY_ID  # Use the configured key (test or live)
        }
        
    except Exception as e:
        logger.error(f"Failed to create subscription order: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create order: {str(e)}"
        )

@router.post("/verify-payment")
async def verify_payment(
    verification_data: RazorpayPaymentVerification,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Verify payment and activate subscription"""
    try:
        razorpay_service = RazorpayService()
        
        # Process payment
        result = razorpay_service.process_successful_payment(db, verification_data)
        
        return {
            "success": True,
            "message": "Payment verified and subscription activated",
            "subscription_id": result["subscription"].id,
            "plan_name": result["plan"].name,
            "valid_until": result["subscription"].end_date.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Payment verification failed: {str(e)}"
        )

@router.post("/upgrade")
async def upgrade_subscription(
    request: SubscriptionUpgradeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upgrade to a higher plan"""
    try:
        # Get current subscription
        current_subscription = db.query(Subscription).filter(
            Subscription.user_id == current_user.id,
            Subscription.status == "active"  # Use string directly
        ).first()
        
        if not current_subscription:
            raise HTTPException(
                status_code=404,
                detail="No active subscription found"
            )
        
        # Get new plan
        new_plan = db.query(Plan).filter(
            Plan.id == request.new_plan_id,
            Plan.is_active == True
        ).first()
        
        if not new_plan:
            raise HTTPException(
                status_code=404,
                detail="Plan not found"
            )
        
        # Check if it's actually an upgrade
        if new_plan.price <= current_subscription.plan.price:
            raise HTTPException(
                status_code=400,
                detail="Can only upgrade to a higher plan"
            )
        
        # Create order for the difference
        razorpay_service = RazorpayService()
        order_data = razorpay_service.create_subscription_order(
            db, current_user.id, request.new_plan_id
        )
        
        return {
            "order_id": order_data["order"]["id"],
            "amount": order_data["order"]["amount"],
            "currency": order_data["order"]["currency"],
            "current_plan": current_subscription.plan.name,
            "new_plan": new_plan.name,
            "razorpay_key": "rzp_live_RJqmheBoVjM38M"
        }
        
    except Exception as e:
        logger.error(f"Failed to create upgrade order: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create upgrade order: {str(e)}"
        )

@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cancel current subscription"""
    try:
        razorpay_service = RazorpayService()
        
        success = razorpay_service.cancel_subscription(
            db, current_user.id, "User requested cancellation"
        )
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="No active subscription found to cancel"
            )
        
        return {
            "success": True,
            "message": "Subscription cancelled successfully"
        }
        
    except Exception as e:
        logger.error(f"Failed to cancel subscription: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to cancel subscription: {str(e)}"
        )

@router.get("/usage", response_model=UsageStats)
async def get_usage_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current usage statistics"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"  # Use string directly
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="No active subscription found"
        )
    
    usage_percentage = (subscription.messages_used_this_month / subscription.plan.monthly_messages) * 100
    
    return UsageStats(
        messages_used=subscription.messages_used_this_month,
        messages_limit=subscription.plan.monthly_messages,
        usage_percentage=min(usage_percentage, 100),
        days_remaining=subscription.days_remaining(),
        next_reset_date=subscription.next_billing_date
    )

@router.get("/payments", response_model=List[PaymentResponse])
async def get_payment_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get payment history"""
    payments = db.query(Payment).filter(
        Payment.user_id == current_user.id
    ).order_by(Payment.created_at.desc()).all()
    
    return payments
