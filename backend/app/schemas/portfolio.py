# backend/app/schemas/portfolio.py
# Pydantic schemas for Portfolio API requests and responses

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class PortfolioBase(BaseModel):
    """Base portfolio schema with common fields"""
    name: str = Field(..., min_length=1, max_length=255, description="Portfolio folder name")
    description: Optional[str] = Field(None, description="Optional description of the portfolio")
    color: Optional[str] = Field("#10B981", pattern="^#[0-9A-Fa-f]{6}$", description="Hex color for folder")
    icon: Optional[str] = Field("folder", description="Icon name for display")
    parent_id: Optional[int] = Field(None, description="Parent folder ID for nested folders")


class PortfolioCreate(PortfolioBase):
    """Schema for creating a new portfolio folder"""
    pass


class PortfolioUpdate(BaseModel):
    """Schema for updating an existing portfolio folder"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = None
    parent_id: Optional[int] = None


class PortfolioResponse(PortfolioBase):
    """Basic portfolio response schema"""
    id: int
    user_id: int
    is_default: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PortfolioMetrics(BaseModel):
    """Portfolio financial metrics"""
    property_count: int
    total_value: float
    total_monthly_cash_flow: float
    total_annual_cash_flow: float
    average_cap_rate: float
    average_monthly_rent: float
    average_monthly_expenses: float
    total_equity: float

    # Property type breakdown
    residential_count: int = 0
    commercial_count: int = 0
    mixed_use_count: int = 0
    other_count: int = 0

    # Geographic breakdown (top 3 cities)
    top_cities: List[dict] = Field(default_factory=list)

    # Performance indicators
    positive_cash_flow_count: int = 0
    negative_cash_flow_count: int = 0
    break_even_count: int = 0


class PortfolioWithMetrics(PortfolioResponse):
    """Portfolio response with calculated metrics"""
    metrics: PortfolioMetrics
    folder_path: str


class PropertySummary(BaseModel):
    """Summary of a property for portfolio views"""
    id: int
    name: str
    address: Optional[str]
    property_type: str
    current_value: Optional[float]
    monthly_cash_flow: Optional[float]
    cap_rate: Optional[float]

    class Config:
        from_attributes = True


class PortfolioWithProperties(PortfolioWithMetrics):
    """Portfolio with full property list"""
    properties: List[PropertySummary]


class MovePropertyRequest(BaseModel):
    """Request schema for moving a property between portfolios"""
    property_id: int
    target_portfolio_id: int


class PortfolioTreeNode(BaseModel):
    """Schema for hierarchical portfolio structure (for future nested folders)"""
    id: int
    name: str
    color: str
    icon: str
    property_count: int
    total_value: float
    children: List['PortfolioTreeNode'] = Field(default_factory=list)

    class Config:
        from_attributes = True


# Update forward references for recursive model
PortfolioTreeNode.model_rebuild()