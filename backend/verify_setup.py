#!/usr/bin/env python3
"""
Quick verification of Instagram accounts setup
"""
import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.page import Page
from app.models.user import User

def verify_setup():
    """Verify Instagram accounts are properly configured"""

    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Users: {len(users)}")

        for user in users:
            pages = db.query(Page).filter(Page.user_id == user.id).all()
            print(f"User: {user.name} - Pages: {len(pages)}")

            for page in pages:
                print(f"  • {page.page_name} (@{page.instagram_username}) - IG ID: {page.ig_business_id}")

    finally:
        db.close()

if __name__ == "__main__":
    verify_setup()
