from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine with better connection handling
if "postgresql" in settings.DATABASE_URL:
    # PostgreSQL specific configuration
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=300,    # Recycle connections every 5 minutes
        pool_size=5,         # Connection pool size
        max_overflow=10,     # Max overflow connections
        connect_args={
            "sslmode": "require",
            "connect_timeout": 10,
        },
        echo=False
    )
else:
    # SQLite or other databases
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=StaticPool,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
        echo=False
    )

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

# Database connection test
def test_db_connection():
    try:
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
