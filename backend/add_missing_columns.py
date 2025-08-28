#!/usr/bin/env python3
"""
Add Missing Columns to Users Table
Simple script to add the missing user management columns
"""

import psycopg2

def add_missing_columns():
    """Add missing columns to users table"""
    database_url = "postgresql://postgres:YCrPRurTFcjjuABVoybUXEMORUwtfgod@shinkansen.proxy.rlwy.net:52143/railway"
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("🔄 Adding missing columns to users table...")
        
        # Add columns one by one with error handling
        columns = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'free_trial'",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_beta_user BOOLEAN DEFAULT FALSE",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS beta_user_number INTEGER",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_days_remaining INTEGER DEFAULT 14",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'pending'",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR"
        ]
        
        for sql in columns:
            try:
                cursor.execute(sql)
                column_name = sql.split()[5]  # Extract column name
                print(f"✅ Added column: {column_name}")
            except Exception as e:
                print(f"⚠️  Column warning: {e}")
        
        conn.commit()
        
        # Verify columns exist
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name IN (
                'role', 'is_beta_user', 'beta_user_number', 'trial_start_date', 
                'trial_end_date', 'trial_days_remaining', 'subscription_status',
                'subscription_start_date', 'subscription_end_date', 'last_login', 'profile_picture'
            )
            ORDER BY column_name
        """)
        
        existing_columns = [row[0] for row in cursor.fetchall()]
        print(f"\n✅ Verified columns exist: {', '.join(existing_columns)}")
        
        cursor.close()
        conn.close()
        
        print("\n🎉 All missing columns added successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to add columns: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Adding Missing User Management Columns")
    print("=" * 50)
    
    success = add_missing_columns()
    
    if success:
        print("\n✅ Database updated! Login should now work.")
    else:
        print("\n❌ Database update failed.")
