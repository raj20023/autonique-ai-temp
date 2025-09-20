#!/usr/bin/env python3
"""
Script to fix plan enum values in the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal, engine

def fix_plan_enums():
    """Fix plan enum values from lowercase to uppercase"""
    
    db = SessionLocal()
    
    try:
        print("🔧 Fixing plan enum values...")
        
        # Update plan_type values to uppercase
        db.execute(text("UPDATE plans SET plan_type = 'STARTER' WHERE plan_type = 'starter'"))
        db.execute(text("UPDATE plans SET plan_type = 'GROWTH' WHERE plan_type = 'growth'"))
        db.execute(text("UPDATE plans SET plan_type = 'PRO' WHERE plan_type = 'pro'"))
        
        db.commit()
        
        # Verify the changes
        result = db.execute(text("SELECT name, plan_type FROM plans"))
        plans = result.fetchall()
        
        print("✅ Successfully updated plan enum values:")
        for plan in plans:
            print(f"   - {plan[0]}: {plan[1]}")
        
    except Exception as e:
        print(f"❌ Error fixing plan enums: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Fixing plan enum values...")
    fix_plan_enums()
    print("✅ Done!")
