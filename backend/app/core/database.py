from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from .settings import settings
from ..models.base import Base
import logging

logger = logging.getLogger(__name__)

# Create database engine
# Works with any PostgreSQL provider (local, Railway, AWS RDS, etc.)
engine = create_engine(
    settings.DATABASE_URL,
    # Connection pool settings
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Refresh connections every 5 minutes
    echo=settings.DEBUG,  # Log SQL queries in debug mode
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_database_url() -> str:
    """Get the current database URL (for debugging)"""
    return settings.DATABASE_URL


def create_tables():
    """
    Create all tables in the database
    This is mainly for development - use Alembic migrations in production
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise


def drop_tables():
    """
    Drop all tables (be careful with this!)
    Only use in development
    """
    if not settings.DEBUG:
        raise Exception("Cannot drop tables in production mode")

    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
    except Exception as e:
        logger.error(f"Error dropping database tables: {str(e)}")
        raise


def get_db():
    """
    Dependency to get database session
    This will be used in FastAPI routes
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> bool:
    """
    Test database connection
    Returns True if connection is successful
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return False


def get_database_info() -> dict:
    """
    Get database information for debugging
    """
    try:
        with engine.connect() as connection:
            # Get database version
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]

            # Get current database name
            result = connection.execute(text("SELECT current_database()"))
            database_name = result.fetchone()[0]

            return {
                "connected": True,
                "database_name": database_name,
                "version": version,
                "url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "Local",
            }
    except Exception as e:
        return {
            "connected": False,
            "error": str(e),
            "url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "Local",
        }