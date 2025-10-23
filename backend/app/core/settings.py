# app/core/settings.py
import os
from typing import Optional, List
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Environment-driven settings that work anywhere:
    Local development, Railway, Vercel, AWS, etc.
    """

    # Environment Detection
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development|production

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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Frontend URL for CORS and email links
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # CORS Configuration - can be overridden with comma-separated string
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:5173"
    )

    # Application Configuration
    APP_NAME: str = "Cribb Real Estate Management"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Provider-specific settings (only used when needed)
    AWS_REGION: Optional[str] = os.getenv("AWS_REGION")
    AWS_S3_BUCKET: Optional[str] = os.getenv("AWS_S3_BUCKET")

    SENDGRID_API_KEY: Optional[str] = os.getenv("SENDGRID_API_KEY")
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """
        Validate and adjust DATABASE_URL for different environments.
        Railway sometimes uses postgres:// instead of postgresql://
        """
        if v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql://", 1)
        return v

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_cors_origins(cls, v: str) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        if isinstance(v, str):
            origins = [origin.strip() for origin in v.split(",") if origin.strip()]
            return origins
        return v

    @model_validator(mode="after")
    def add_frontend_to_cors(self):
        """Automatically add FRONTEND_URL to allowed origins"""
        if self.FRONTEND_URL not in self.ALLOWED_ORIGINS:
            self.ALLOWED_ORIGINS.append(self.FRONTEND_URL)
        return self

    @model_validator(mode="after")
    def validate_production_settings(self):
        """Ensure critical settings are properly configured in production"""
        if self.ENVIRONMENT == "production":
            # Check SECRET_KEY isn't the default
            if "dev-secret-key" in self.SECRET_KEY:
                raise ValueError(
                    "SECRET_KEY must be changed from default value in production! "
                    "Generate a secure key and set it as an environment variable."
                )

            # Warn if DEBUG is enabled in production
            if self.DEBUG:
                print("WARNING: DEBUG mode is enabled in production environment!")

        return self

    @property
    def is_production(self) -> bool:
        """Helper property to check if running in production"""
        return self.ENVIRONMENT == "production"

    @property
    def cors_origins(self) -> List[str]:
        """Get CORS origins as a list (for FastAPI CORS middleware)"""
        return self.ALLOWED_ORIGINS

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

# Print configuration on startup (helpful for debugging deployment)
if __name__ == "__main__":
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Frontend URL: {settings.FRONTEND_URL}")
    print(f"Allowed Origins: {settings.ALLOWED_ORIGINS}")
    print(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'local'}")
    print(f"File Storage: {settings.FILE_STORAGE_TYPE}")
    print(f"Email Backend: {settings.EMAIL_BACKEND}")