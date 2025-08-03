# app/core/settings.py
import os
from typing import Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Environment-driven settings that work anywhere:
    Local development, Railway, Vercel, AWS, etc.
    """

    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://localhost:5432/realestate")

    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    # File Storage Configuration (flexible for any provider)
    FILE_STORAGE_TYPE: str = os.getenv("FILE_STORAGE_TYPE", "local")  # local|s3|spaces
    FILE_STORAGE_PATH: str = os.getenv("FILE_STORAGE_PATH", "./uploads")
    FILE_STORAGE_BUCKET: Optional[str] = os.getenv("FILE_STORAGE_BUCKET")

    # Email Configuration (flexible backend)
    EMAIL_BACKEND: str = os.getenv("EMAIL_BACKEND", "console")  # console|smtp|sendgrid|ses
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@realestate-app.com")

    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-make-it-long-and-random")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Frontend URL for email links
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # CORS Configuration
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        # Production origins will be added via environment variables
    ]

    # Application Configuration
    APP_NAME: str = "Real Estate Portfolio Manager"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Provider-specific settings (only used when needed)
    AWS_REGION: Optional[str] = os.getenv("AWS_REGION")
    AWS_S3_BUCKET: Optional[str] = os.getenv("AWS_S3_BUCKET")

    SENDGRID_API_KEY: Optional[str] = os.getenv("SENDGRID_API_KEY")
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from environment variable if it's a string"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()