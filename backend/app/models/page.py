from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fb_page_id = Column(String, unique=True, index=True, nullable=False)
    ig_business_id = Column(String, unique=True, index=True, nullable=True)
    page_name = Column(String, nullable=False)
    page_access_token = Column(Text, nullable=False)  # Encrypted page access token
    instagram_username = Column(String, nullable=True)
    webhook_subscribed = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="pages")

    def __repr__(self):
        return f"<Page(id={self.id}, page_name='{self.page_name}', fb_page_id='{self.fb_page_id}')>"
