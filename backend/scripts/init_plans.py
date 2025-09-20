#!/usr/bin/env python3
"""
Script to initialize default subscription plans in the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.subscription import Plan, PlanType
from app.core.database import Base

# Import all models to ensure they are registered
from app.models import user, page, message, faq, business_profile, subscription

def init_plans():
    """Initialize default subscription plans"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if plans already exist
        existing_plans = db.query(Plan).count()
        if existing_plans > 0:
            print(f"Plans already exist ({existing_plans} plans found). Skipping initialization.")
            return
        
        # Create default plans
        plans = [
            Plan(
                name="Starter",
                plan_type=PlanType.STARTER,
                price=499.0,
                currency="INR",
                monthly_messages=200,
                instagram_accounts=1,
                basic_faq=True,
                analytics=False,
                advanced_analytics=False,
                team_handoff=False,
                description="Perfect for small businesses starting out. Up to 200 auto-replies/month, 1 Instagram account, Basic FAQ setup.",
                is_active=True
            ),
            Plan(
                name="Growth",
                plan_type=PlanType.GROWTH,
                price=999.0,
                currency="INR",
                monthly_messages=1000,
                instagram_accounts=1,
                basic_faq=True,
                analytics=True,
                advanced_analytics=False,
                team_handoff=False,
                description="Most popular - ideal for growing businesses. Up to 1,000 auto-replies/month, 1 Instagram account, FAQ setup + basic analytics.",
                is_active=True
            ),
            Plan(
                name="Pro",
                plan_type=PlanType.PRO,
                price=2999.0,
                currency="INR",
                monthly_messages=5000,
                instagram_accounts=3,
                basic_faq=True,
                analytics=True,
                advanced_analytics=True,
                team_handoff=True,
                description="For agencies and serious sellers. Up to 5,000 auto-replies/month, Up to 3 Instagram accounts, Advanced analytics + team handoff.",
                is_active=True
            )
        ]
        
        # Add plans to database
        for plan in plans:
            db.add(plan)
        
        db.commit()
        
        print("✅ Successfully initialized default subscription plans:")
        for plan in plans:
            print(f"   - {plan.name}: ₹{plan.price}/month ({plan.monthly_messages} messages, {plan.instagram_accounts} accounts)")
        
    except Exception as e:
        print(f"❌ Error initializing plans: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing default subscription plans...")
    init_plans()
    print("✅ Done!")
