from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/autonique_db")

    @field_validator('DATABASE_URL')
    @classmethod
    def validate_database_url(cls, v):
        # Railway PostgreSQL URLs start with postgres:// but SQLAlchemy needs postgresql://
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
    # Facebook/Instagram API
    FACEBOOK_APP_ID: str
    FACEBOOK_APP_SECRET: str
    FACEBOOK_GRAPH_API_VERSION: str = "v18.0"
    
    # Google Gemini
    GOOGLE_API_KEY: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Webhook
    WEBHOOK_VERIFY_TOKEN: str = "autonique_webhook_2024_secure_token_xyz789"
    
    # Simple caching (no Redis)
    ENABLE_CACHING: bool = True
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:3000,https://autonique.in,https://www.autonique.in"

    @field_validator('ALLOWED_ORIGINS')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Facebook Graph API URLs
    @property
    def FACEBOOK_GRAPH_URL(self) -> str:
        return f"https://graph.facebook.com/{self.FACEBOOK_GRAPH_API_VERSION}"
    
    @property
    def FACEBOOK_OAUTH_URL(self) -> str:
        return f"https://www.facebook.com/{self.FACEBOOK_GRAPH_API_VERSION}/dialog/oauth"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
