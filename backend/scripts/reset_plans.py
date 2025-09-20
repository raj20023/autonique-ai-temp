#!/usr/bin/env python3
"""
Script to reset subscription plans in the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal, engine

def reset_plans():
    """Reset subscription plans"""
    
    db = SessionLocal()
    
    try:
        print("🔧 Checking current plans...")
        
        # Check current plans
        result = db.execute(text("SELECT id, name, plan_type FROM plans"))
        plans = result.fetchall()
        
        print("Current plans:")
        for plan in plans:
            print(f"   - ID: {plan[0]}, Name: {plan[1]}, Type: {plan[2]}")
        
        # Check enum values
        result = db.execute(text("SELECT unnest(enum_range(NULL::plantype))"))
        enum_values = result.fetchall()
        
        print("\nEnum values:")
        for value in enum_values:
            print(f"   - {value[0]}")
        
        # Delete all plans
        print("\n🗑️ Deleting all existing plans...")
        db.execute(text("DELETE FROM plans"))
        db.commit()
        
        print("✅ All plans deleted successfully!")
        
    except Exception as e:
        print(f"❌ Error resetting plans: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Resetting subscription plans...")
    reset_plans()
    print("✅ Done!")
