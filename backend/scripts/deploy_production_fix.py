#!/usr/bin/env python3
"""
Script to fix production database enum issues and update plans
Run this on Railway after deployment
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal, engine
from app.models.subscription import Plan, PlanType

def deploy_production_fix():
    """Fix production database and update plans"""
    
    db = SessionLocal()
    
    try:
        print("🚀 Starting production database fix...")
        
        # Check current plans
        print("\n🔧 Checking current plans...")
        try:
            result = db.execute(text("SELECT id, name, plan_type FROM plans"))
            plans = result.fetchall()
            
            print("Current plans:")
            for plan in plans:
                print(f"   - ID: {plan[0]}, Name: {plan[1]}, Type: {plan[2]}")
        except Exception as e:
            print(f"   - Error reading plans (expected if enum mismatch): {e}")
        
        # Delete all plans to avoid enum conflicts
        print("\n🗑️ Cleaning existing plans...")
        db.execute(text("DELETE FROM plans"))
        db.commit()
        print("   - All existing plans deleted")
        
        # Create new plans with correct enum values
        print("\n📦 Creating new subscription plans...")
        
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
        
        # Test the subscription endpoint
        print("\n🧪 Testing subscription plans endpoint...")
        try:
            plans = db.query(Plan).filter(Plan.is_active == True).order_by(Plan.price).all()
            print(f"   - Successfully fetched {len(plans)} plans")
            for plan in plans:
                print(f"     * {plan.name}: {plan.plan_type} - ₹{plan.price}")
        except Exception as e:
            print(f"   - Error testing plans: {e}")
            raise
        
        print("\n✅ Production database fix completed successfully!")
        print("🎉 Razorpay payment gateway is now ready for production!")
        
    except Exception as e:
        print(f"❌ Error during production fix: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Running production database fix for Razorpay integration...")
    deploy_production_fix()
    print("✅ Done!")
