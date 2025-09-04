#!/usr/bin/env python3
"""
Cleanup script to remove fake Instagram placeholders from the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.page import Page
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cleanup_fake_instagram_data():
    """Remove fake Instagram placeholder data from pages"""
    db = SessionLocal()
    try:
        # Find pages with fake Instagram placeholders
        fake_pages = db.query(Page).filter(
            Page.ig_business_id.like("ig_placeholder_%")
        ).all()
        
        logger.info(f"Found {len(fake_pages)} pages with fake Instagram placeholders")
        
        for page in fake_pages:
            logger.info(f"Cleaning up fake Instagram data for page: {page.page_name}")
            page.ig_business_id = None
            page.instagram_username = None
            
        # Also clean up pages with "instagram_connected" username
        fake_username_pages = db.query(Page).filter(
            Page.instagram_username == "instagram_connected"
        ).all()
        
        logger.info(f"Found {len(fake_username_pages)} pages with fake Instagram usernames")
        
        for page in fake_username_pages:
            logger.info(f"Cleaning up fake Instagram username for page: {page.page_name}")
            page.ig_business_id = None
            page.instagram_username = None
        
        db.commit()
        logger.info("✅ Cleanup completed successfully")
        
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_fake_instagram_data()
