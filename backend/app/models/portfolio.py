# backend/app/models/portfolio.py

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Portfolio(Base):
    """
    Portfolio model for folder-like organization of properties
    Users can create folders like "Rental Properties", "Atlanta Market", etc.
    """
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    color = Column(String(7), default="#10B981")  # Hex color for folder icon
    icon = Column(String(50), default="folder")  # Icon name for display

    # Folder hierarchy support (for nested folders if needed later)
    parent_id = Column(Integer, ForeignKey("portfolios.id"), nullable=True)
    is_default = Column(Boolean, default=False)  # "All Properties" default folder

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="portfolios")
    properties = relationship("Property", back_populates="portfolio")

    # Self-referential relationship for nested folders (future feature)
    children = relationship("Portfolio", backref="parent", remote_side=[id])

    def __repr__(self):
        return f"<Portfolio '{self.name}' (User: {self.user_id})>"

    @property
    def property_count(self):
        """Get count of properties in this folder"""
        return len(self.properties)

    @property
    def total_value(self):
        """Calculate total current value of all properties in folder"""
        return sum(prop.current_value or 0 for prop in self.properties)

    @property
    def total_monthly_cash_flow(self):
        """Calculate total monthly cash flow for folder"""
        total = 0
        for prop in self.properties:
            if prop.financials and prop.financials.cash_flow:
                total += prop.financials.cash_flow
        return total

    @property
    def average_cap_rate(self):
        """Calculate weighted average cap rate for folder"""
        if not self.properties:
            return 0

        total_value = 0
        weighted_cap_rate = 0

        for prop in self.properties:
            if prop.financials and prop.current_value and prop.financials.cap_rate:
                prop_value = prop.current_value
                total_value += prop_value
                weighted_cap_rate += (prop.financials.cap_rate * prop_value)

        return weighted_cap_rate / total_value if total_value > 0 else 0

    @property
    def folder_path(self):
        """Get the full folder path like 'Rentals/Atlanta/Single Family'"""
        if self.parent:
            return f"{self.parent.folder_path}/{self.name}"
        return self.name

    def get_all_properties_recursive(self):
        """Get all properties in this folder and all subfolders"""
        all_properties = list(self.properties)

        for child_folder in self.children:
            all_properties.extend(child_folder.get_all_properties_recursive())

        return all_properties


# Keep this for backward compatibility with your existing code
class PortfolioProperty(Base):
    """
    Junction table with additional data for portfolio-property relationships
    (keeping for backward compatibility)
    """
    __tablename__ = "portfolio_properties"

    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), primary_key=True)
    property_id = Column(Integer, ForeignKey("properties.id"), primary_key=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)  # Portfolio-specific notes about this property

    # Relationships
    portfolio = relationship("Portfolio")
    property = relationship("Property", back_populates="portfolio_items")