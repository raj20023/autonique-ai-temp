#!/usr/bin/env python3
"""
Fix Database Schema - Add Missing User Management Columns
Run this to add all missing columns to the users table
"""

import os
import sys
import psycopg2
from datetime import datetime

def get_database_url():
    """Get database URL from environment"""
    return "postgresql://postgres:YCrPRurTFcjjuABVoybUXEMORUwtfgod@shinkansen.proxy.rlwy.net:52143/railway"

def check_column_exists(cursor, table_name, column_name):
    """Check if a column exists in a table"""
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = %s AND column_name = %s
    """, (table_name, column_name))
    return cursor.fetchone() is not None

def add_column_if_not_exists(cursor, table_name, column_definition):
    """Add column if it doesn't exist"""
    column_name = column_definition.split()[0]
    if not check_column_exists(cursor, table_name, column_name):
        try:
            cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_definition}")
            print(f"✅ Added column: {column_name}")
            return True
        except Exception as e:
            print(f"❌ Failed to add column {column_name}: {e}")
            return False
    else:
        print(f"⏭️  Column {column_name} already exists")
        return True

def fix_database_schema():
    """Fix the database schema by adding missing columns"""
    database_url = get_database_url()
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("🔄 Checking and fixing database schema...")
        print("=" * 50)
        
        # List of columns to add to users table (using VARCHAR for simplicity)
        columns_to_add = [
            "role VARCHAR(20) DEFAULT 'free_trial'",
            "is_beta_user BOOLEAN DEFAULT FALSE",
            "beta_user_number INTEGER",
            "trial_start_date TIMESTAMP",
            "trial_end_date TIMESTAMP",
            "trial_days_remaining INTEGER DEFAULT 14",
            "subscription_status VARCHAR(20) DEFAULT 'pending'",
            "subscription_start_date TIMESTAMP",
            "subscription_end_date TIMESTAMP",
            "last_login TIMESTAMP",
            "profile_picture VARCHAR"
        ]
        
        print("📝 Adding missing columns to users table...")
        
        success_count = 0
        for column_def in columns_to_add:
            if add_column_if_not_exists(cursor, "users", column_def):
                success_count += 1
        
        # Create other tables if they don't exist
        print("\n📝 Creating additional tables...")
        
        # Create instagram_accounts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS instagram_accounts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                instagram_id VARCHAR UNIQUE,
                username VARCHAR,
                name VARCHAR,
                profile_picture_url VARCHAR,
                followers_count INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                is_connected BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("✅ Created/verified instagram_accounts table")
        
        # Create usage_stats table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usage_stats (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                month VARCHAR NOT NULL,
                messages_sent INTEGER DEFAULT 0,
                messages_received INTEGER DEFAULT 0,
                api_calls_made INTEGER DEFAULT 0,
                faq_responses_sent INTEGER DEFAULT 0,
                auto_replies_sent INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, month)
            );
        """)
        print("✅ Created/verified usage_stats table")
        
        # Create admin_settings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_settings (
                id SERIAL PRIMARY KEY,
                key VARCHAR UNIQUE NOT NULL,
                value TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("✅ Created/verified admin_settings table")
        
        # Insert default admin settings
        cursor.execute("""
            INSERT INTO admin_settings (key, value, description) VALUES
            ('beta_users_limit', '20', 'Maximum number of beta users allowed'),
            ('trial_days', '14', 'Number of free trial days for new users'),
            ('monthly_message_limit_trial', '1000', 'Monthly message limit for trial users'),
            ('monthly_message_limit_paid', '10000', 'Monthly message limit for paid users'),
            ('app_maintenance_mode', 'false', 'Enable maintenance mode')
            ON CONFLICT (key) DO NOTHING;
        """)
        print("✅ Inserted/verified admin settings")
        
        # Create indexes
        print("\n📝 Creating indexes...")
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)",
            "CREATE INDEX IF NOT EXISTS idx_users_beta ON users(is_beta_user)",
            "CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status)",
            "CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON instagram_accounts(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_usage_stats_user_month ON usage_stats(user_id, month)",
            "CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key)"
        ]
        
        for index_sql in indexes:
            try:
                cursor.execute(index_sql)
                print(f"✅ Created index")
            except Exception as e:
                print(f"⚠️  Index creation warning: {e}")
        
        # Commit all changes
        conn.commit()
        
        # Verify the schema
        print("\n🔍 Verifying schema...")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        print(f"\n📊 Users table now has {len(columns)} columns:")
        for col in columns:
            print(f"   - {col[0]} ({col[1]})")
        
        # Get user counts
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users WHERE role IS NOT NULL")
        users_with_roles = cursor.fetchone()[0]
        
        print(f"\n📈 Database Stats:")
        print(f"   - Total Users: {total_users}")
        print(f"   - Users with Roles: {users_with_roles}")
        print(f"   - Users needing role assignment: {total_users - users_with_roles}")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Database schema fix completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Schema fix failed: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

if __name__ == "__main__":
    print("🔧 AutoniqueAI Database Schema Fix")
    print("=" * 50)
    
    success = fix_database_schema()
    
    if success:
        print("\n🎉 Schema fix completed! Your login should now work.")
        print("\n📋 Next Steps:")
        print("1. Try logging in again")
        print("2. Set yourself as admin: UPDATE users SET role = 'admin' WHERE fb_user_id = 'your-id';")
        print("3. Test the user management features")
    else:
        print("\n💥 Schema fix failed. Please check the error above.")
        sys.exit(1)
