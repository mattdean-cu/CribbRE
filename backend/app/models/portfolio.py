from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Portfolio(Base):
    """
    Portfolio model for grouping properties
    Users can create multiple portfolios (e.g., "Rental Properties", "Fix & Flip", etc.)
    """
    __tablename__ = "portfolios"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Portfolio information
    name = Column(String(255), nullable=False)
    description = Column(Text)
    color = Column(String(7), default="#3B82F6")  # Hex color for UI

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="portfolios")
    portfolio_items = relationship("PortfolioProperty", back_populates="portfolio", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Portfolio(id={self.id}, name={self.name})>"


class PortfolioProperty(Base):
    """
    Junction table with additional data for portfolio-property relationships
    """
    __tablename__ = "portfolio_properties"

    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id"), primary_key=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)  # Portfolio-specific notes about this property

    # Relationships
    portfolio = relationship("Portfolio", back_populates="portfolio_items")
    property = relationship("Property", back_populates="portfolio_items")