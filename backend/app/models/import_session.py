from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .base import Base


class ImportStatus(enum.Enum):
    """Import session status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ImportSession(Base):
    """
    Import session model for tracking data imports (CSV, Excel, etc.)
    """
    __tablename__ = "import_sessions"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Import information
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # "csv", "xlsx", etc.
    file_size = Column(Integer)  # File size in bytes

    # Import status
    status = Column(Enum(ImportStatus), default=ImportStatus.PENDING)

    # Import results
    total_rows = Column(Integer, default=0)
    successful_imports = Column(Integer, default=0)
    failed_imports = Column(Integer, default=0)

    # Error tracking
    errors = Column(JSON)  # List of error messages

    # Processing information
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="import_sessions")

    def __repr__(self):
        return f"<ImportSession(id={self.id}, filename={self.filename}, status={self.status})>"

    @property
    def success_rate(self):
        """Calculate import success rate"""
        if self.total_rows == 0:
            return 0
        return (self.successful_imports / self.total_rows) * 100