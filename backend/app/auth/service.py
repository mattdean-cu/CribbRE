# app/auth/service.py
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.settings import settings
from app.core.database import get_db
from app.models.user import User


class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return self.pwd_context.verify(plain_password, hashed_password)

    def hash_password(self, password: str) -> str:
        """Hash a password for storing."""
        return self.pwd_context.hash(password)

    def create_access_token(self, data: Dict[str, Any]) -> str:
        """Create a new JWT access token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token."""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None

    def create_user(self, db: Session, email: str, password: str, first_name: str = None, last_name: str = None) -> \
            Dict[str, Any]:
        """Create a new user account."""
        try:
            # Check if user exists
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                return {"error": "User with this email already exists"}

            # Create user
            hashed_password = self.hash_password(password)
            user = User(
                email=email,
                hashed_password=hashed_password,
                first_name=first_name,
                last_name=last_name,
                is_active=True,  # For now, activate immediately
                is_verified=True,  # For now, verify immediately
                subscription_tier = "pro"
            )

            db.add(user)
            db.commit()
            db.refresh(user)

            return {"message": "User created successfully", "user_id": user.id}

        except IntegrityError:
            db.rollback()
            return {"error": "User with this email already exists"}
        except Exception as e:
            db.rollback()
            return {"error": f"Failed to create user: {str(e)}"}

    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password."""
        user = db.query(User).filter(User.email == email).first()

        if not user or not self.verify_password(password, user.hashed_password):
            return None

        if not user.is_active:
            return None

        return user


# Global instance
auth_service = AuthService()

# Security scheme for JWT
security = HTTPBearer()


# Dependency to get current user from JWT token
async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db)
) -> User:
    """FastAPI dependency to get current authenticated user"""

    # Extract token from credentials
    token = credentials.credentials

    # Verify token using your existing auth service
    payload = auth_service.verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user_id from payload
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user