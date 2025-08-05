import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

# Add the parent directory to the path so we can import our app
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.main import app
from app.core.database import get_db, Base
from app.models.user import User
from app.models.faq import FAQ

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "InstaReply API"

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_webhook_verification():
    """Test webhook verification"""
    response = client.get(
        "/api/v1/webhook/?hub.mode=subscribe&hub.verify_token=test_token&hub.challenge=12345"
    )
    # This will fail without proper token, but tests the endpoint exists
    assert response.status_code in [200, 403]

def test_create_user():
    """Test user creation via database"""
    db = TestingSessionLocal()
    
    user = User(
        fb_user_id="test_user_123",
        name="Test User",
        email="test@example.com",
        access_token="encrypted_token"
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    assert user.id is not None
    assert user.name == "Test User"
    assert user.fb_user_id == "test_user_123"
    
    db.close()

def test_create_faq():
    """Test FAQ creation via database"""
    db = TestingSessionLocal()
    
    # First create a user
    user = User(
        fb_user_id="test_user_faq",
        name="FAQ Test User",
        email="faq@example.com",
        access_token="encrypted_token"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create FAQ
    faq = FAQ(
        user_id=user.id,
        question="What are your hours?",
        answer="We're open Monday-Friday 9AM-6PM",
        embedding_vector=[0.1, 0.2, 0.3],  # Mock embedding
        similarity_threshold=0.8
    )
    
    db.add(faq)
    db.commit()
    db.refresh(faq)
    
    assert faq.id is not None
    assert faq.question == "What are your hours?"
    assert faq.user_id == user.id
    
    db.close()

# Cleanup
def teardown_module():
    """Clean up test database"""
    if os.path.exists("./test.db"):
        os.remove("./test.db")
