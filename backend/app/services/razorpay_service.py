import razorpay
import hmac
import hashlib
import logging
from typing import Dict, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.subscription import Plan, Subscription, Payment, SubscriptionStatus, PaymentStatus
from app.models.user import User
from app.schemas.subscription import RazorpayOrderCreate, RazorpayPaymentVerification

logger = logging.getLogger(__name__)

class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
    def create_order(self, amount: float, currency: str = "INR", receipt: str = None, notes: Dict = None) -> Dict:
        """Create a Razorpay order"""
        try:
            # Convert amount to paise (Razorpay expects amount in smallest currency unit)
            amount_in_paise = int(amount * 100)
            
            order_data = {
                "amount": amount_in_paise,
                "currency": currency,
                "receipt": receipt or f"order_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "notes": notes or {}
            }
            
            order = self.client.order.create(data=order_data)
            logger.info(f"✅ Razorpay order created: {order['id']}")
            return order
            
        except Exception as e:
            logger.error(f"❌ Failed to create Razorpay order: {e}")
            raise

    def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verify Razorpay payment signature"""
        try:
            # Create the signature verification string
            message = f"{order_id}|{payment_id}"
            
            # Generate expected signature
            expected_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            # Compare signatures
            is_valid = hmac.compare_digest(expected_signature, signature)
            
            if is_valid:
                logger.info(f"✅ Payment signature verified for order: {order_id}")
            else:
                logger.error(f"❌ Payment signature verification failed for order: {order_id}")
                
            return is_valid
            
        except Exception as e:
            logger.error(f"❌ Error verifying payment signature: {e}")
            return False

    def get_payment_details(self, payment_id: str) -> Dict:
        """Get payment details from Razorpay"""
        try:
            payment = self.client.payment.fetch(payment_id)
            logger.info(f"✅ Retrieved payment details for: {payment_id}")
            return payment
            
        except Exception as e:
            logger.error(f"❌ Failed to get payment details: {e}")
            raise

    def create_subscription_order(self, db: Session, user_id: int, plan_id: int) -> Dict:
        """Create order for subscription payment"""
        try:
            # Get plan details
            plan = db.query(Plan).filter(Plan.id == plan_id, Plan.is_active == True).first()
            if not plan:
                raise ValueError(f"Plan {plan_id} not found or inactive")
            
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError(f"User {user_id} not found")
            
            # Create order
            receipt = f"sub_{user_id}_{plan_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            notes = {
                "user_id": str(user_id),
                "plan_id": str(plan_id),
                "plan_name": plan.name,
                "user_email": user.email or "",
                "user_name": user.name
            }
            
            order = self.create_order(
                amount=plan.price,
                receipt=receipt,
                notes=notes
            )
            
            logger.info(f"✅ Subscription order created for user {user_id}, plan {plan.name}")
            return {
                "order": order,
                "plan": plan,
                "user": user
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to create subscription order: {e}")
            raise

    def process_successful_payment(self, db: Session, verification_data: RazorpayPaymentVerification) -> Dict:
        """Process successful payment and activate subscription"""
        try:
            # Verify signature first
            if not self.verify_payment_signature(
                verification_data.razorpay_order_id,
                verification_data.razorpay_payment_id,
                verification_data.razorpay_signature
            ):
                raise ValueError("Invalid payment signature")
            
            # Get payment details from Razorpay
            payment_details = self.get_payment_details(verification_data.razorpay_payment_id)
            
            # Extract user_id and plan_id from order notes
            notes = payment_details.get("notes", {})
            user_id = int(notes.get("user_id"))
            plan_id = int(notes.get("plan_id"))
            
            # Get user and plan
            user = db.query(User).filter(User.id == user_id).first()
            plan = db.query(Plan).filter(Plan.id == plan_id).first()
            
            if not user or not plan:
                raise ValueError("User or plan not found")
            
            # Create or update subscription
            existing_subscription = db.query(Subscription).filter(Subscription.user_id == user_id).first()
            
            if existing_subscription:
                # Update existing subscription
                existing_subscription.plan_id = plan_id
                existing_subscription.status = "active"  # Use string directly
                existing_subscription.start_date = datetime.utcnow()
                existing_subscription.end_date = datetime.utcnow() + timedelta(days=30)  # 1 month
                existing_subscription.next_billing_date = datetime.utcnow() + timedelta(days=30)
                existing_subscription.updated_at = datetime.utcnow()
                subscription = existing_subscription
            else:
                # Create new subscription
                subscription = Subscription(
                    user_id=user_id,
                    plan_id=plan_id,
                    status="active",  # Use string directly
                    start_date=datetime.utcnow(),
                    end_date=datetime.utcnow() + timedelta(days=30),  # 1 month
                    next_billing_date=datetime.utcnow() + timedelta(days=30)
                )
                db.add(subscription)
                db.flush()  # Get subscription ID
            
            # Create payment record
            payment_record = Payment(
                subscription_id=subscription.id,
                user_id=user_id,
                razorpay_payment_id=verification_data.razorpay_payment_id,
                razorpay_order_id=verification_data.razorpay_order_id,
                razorpay_signature=verification_data.razorpay_signature,
                amount=payment_details["amount"] / 100,  # Convert from paise to rupees
                currency=payment_details["currency"],
                status="completed",  # Use string directly to avoid enum conversion issues
                payment_method=payment_details.get("method"),
                billing_start=subscription.start_date,
                billing_end=subscription.end_date,
                paid_at=datetime.utcnow()
            )
            db.add(payment_record)
            
            # Update user role to paid
            user.role = "paid"
            user.subscription_status = "active"
            user.subscription_start_date = subscription.start_date
            user.subscription_end_date = subscription.end_date
            
            db.commit()
            
            logger.info(f"✅ Payment processed successfully for user {user_id}, plan {plan.name}")
            
            return {
                "success": True,
                "subscription": subscription,
                "payment": payment_record,
                "user": user,
                "plan": plan
            }
            
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to process payment: {e}")
            raise

    def cancel_subscription(self, db: Session, user_id: int, reason: str = None) -> bool:
        """Cancel user subscription"""
        try:
            subscription = db.query(Subscription).filter(
                Subscription.user_id == user_id,
                Subscription.status == "active"  # Use string directly
            ).first()
            
            if not subscription:
                logger.warning(f"No active subscription found for user {user_id}")
                return False
            
            # Update subscription status
            subscription.status = "cancelled"  # Use string directly
            subscription.cancelled_at = datetime.utcnow()
            subscription.cancellation_reason = reason
            
            # Update user role back to normal
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.role = "normal"
                user.subscription_status = "cancelled"
            
            db.commit()
            
            logger.info(f"✅ Subscription cancelled for user {user_id}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to cancel subscription: {e}")
            return False
