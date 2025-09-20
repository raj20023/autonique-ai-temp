#!/usr/bin/env python3
"""
Script to update production subscription plans
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal, engine
from app.models.subscription import Plan, PlanType

def update_production_plans():
    """Update production subscription plans"""
    
    db = SessionLocal()
    
    try:
        print("🔧 Checking current plans...")
        
        # Check current plans
        result = db.execute(text("SELECT id, name, plan_type FROM plans"))
        plans = result.fetchall()
        
        print("Current plans:")
        for plan in plans:
            print(f"   - ID: {plan[0]}, Name: {plan[1]}, Type: {plan[2]}")
        
        # Delete all plans
        print("\n🗑️ Deleting all existing plans...")
        db.execute(text("DELETE FROM plans"))
        db.commit()
        
        # Create new plans
        print("\n📦 Creating new plans...")
        
        # Starter Plan
        starter_plan = Plan(
            name="Starter",
            plan_type=PlanType.starter,
            price=499.0,
            currency="INR",
            monthly_messages=200,
            instagram_accounts=1,
            basic_faq=True,
            analytics=False,
            advanced_analytics=False,
            team_handoff=False,
            is_active=True,
            razorpay_plan_id="plan_starter_499"
        )
        
        # Growth Plan
        growth_plan = Plan(
            name="Growth",
            plan_type=PlanType.growth,
            price=999.0,
            currency="INR",
            monthly_messages=1000,
            instagram_accounts=1,
            basic_faq=True,
            analytics=True,
            advanced_analytics=False,
            team_handoff=False,
            is_active=True,
            razorpay_plan_id="plan_growth_999"
        )
        
        # Pro Plan
        pro_plan = Plan(
            name="Pro",
            plan_type=PlanType.pro,
            price=2999.0,
            currency="INR",
            monthly_messages=5000,
            instagram_accounts=3,
            basic_faq=True,
            analytics=True,
            advanced_analytics=True,
            team_handoff=True,
            is_active=True,
            razorpay_plan_id="plan_pro_2999"
        )
        
        db.add(starter_plan)
        db.add(growth_plan)
        db.add(pro_plan)
        db.commit()
        
        print("✅ Successfully created new subscription plans:")
        print(f"   - Starter: ₹{starter_plan.price}/month ({starter_plan.monthly_messages} messages, {starter_plan.instagram_accounts} accounts)")
        print(f"   - Growth: ₹{growth_plan.price}/month ({growth_plan.monthly_messages} messages, {growth_plan.instagram_accounts} accounts)")
        print(f"   - Pro: ₹{pro_plan.price}/month ({pro_plan.monthly_messages} messages, {pro_plan.instagram_accounts} accounts)")
        
    except Exception as e:
        print(f"❌ Error updating plans: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Updating production subscription plans...")
    update_production_plans()
    print("✅ Done!")
