# app/schemas/property.py
# Pydantic schemas for property validation and serialization

from typing import Optional
from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class PropertyFinancialsBase(BaseModel):
    """Base schema for property financials"""
    monthly_rent: Optional[float] = Field(default=0, ge=0, description="Monthly rental income")
    property_taxes: Optional[float] = Field(default=0, ge=0, description="Annual property taxes")
    insurance: Optional[float] = Field(default=0, ge=0, description="Annual insurance cost")
    hoa_fees: Optional[float] = Field(default=0, ge=0, description="Monthly HOA fees")
    maintenance_costs: Optional[float] = Field(default=0, ge=0, description="Monthly maintenance costs")
    vacancy_rate: Optional[float] = Field(default=0.05, ge=0, le=1, description="Vacancy rate (0-1)")


class PropertyFinancialsResponse(PropertyFinancialsBase):
    """Property financials with calculated metrics"""
    property_id: int
    cap_rate: Optional[float] = Field(description="Capitalization rate (%)")
    cash_flow: Optional[float] = Field(description="Monthly cash flow")
    cash_on_cash_return: Optional[float] = Field(description="Cash on cash return (%)")

    model_config = ConfigDict(from_attributes=True)


class PropertyBase(BaseModel):
    """Base property schema"""
    name: str = Field(min_length=1, max_length=200, description="Property name")
    address: Optional[str] = Field(default=None, max_length=500, description="Property address")
    property_type: str = Field(default="residential", description="Property type")
    purchase_date: Optional[date] = Field(default=None, description="Date of purchase")
    purchase_price: Optional[float] = Field(default=0, ge=0, description="Purchase price")
    current_value: Optional[float] = Field(default=0, ge=0, description="Current market value")
    square_footage: Optional[float] = Field(default=None, gt=0, description="Square footage")
    bedrooms: Optional[int] = Field(default=None, ge=0, description="Number of bedrooms")
    bathrooms: Optional[float] = Field(default=None, ge=0, description="Number of bathrooms")
    is_primary_residence: bool = Field(default=False, description="Is this your primary residence?")


class PropertyCreate(PropertyBase, PropertyFinancialsBase):
    """Schema for creating a property"""
    down_payment: Optional[float] = Field(default=0, ge=0, description="Down payment amount")
    portfolio_id: Optional[int] = Field(default=None, description="Portfolio/folder ID")  # Add this line

    class Config:
        json_schema_extra = {
            "example": {
                "name": "123 Main Street Rental",
                "address": "123 Main Street, Denver, CO 80202",
                "property_type": "residential",
                "purchase_price": 300000,
                "current_value": 320000,
                "square_footage": 1200,
                "bedrooms": 3,
                "bathrooms": 2,
                "monthly_rent": 2500,
                "property_taxes": 3000,
                "insurance": 1200,
                "down_payment": 60000,
                "is_primary_residence": False,
                "portfolio_id": None
            }
        }


class PropertyUpdate(BaseModel):
    """Schema for updating a property (all fields optional)"""
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    address: Optional[str] = Field(default=None, max_length=500)
    property_type: Optional[str] = Field(default=None)
    purchase_date: Optional[date] = Field(default=None)
    purchase_price: Optional[float] = Field(default=None, ge=0)
    current_value: Optional[float] = Field(default=None, ge=0)
    square_footage: Optional[float] = Field(default=None, gt=0)
    bedrooms: Optional[int] = Field(default=None, ge=0)
    bathrooms: Optional[float] = Field(default=None, ge=0)
    is_primary_residence: Optional[bool] = Field(default=None)
    portfolio_id: Optional[int] = Field(default=None, description="Portfolio/folder ID")  # Add this line

    # Financial fields
    monthly_rent: Optional[float] = Field(default=None, ge=0)
    property_taxes: Optional[float] = Field(default=None, ge=0)
    insurance: Optional[float] = Field(default=None, ge=0)
    hoa_fees: Optional[float] = Field(default=None, ge=0)
    maintenance_costs: Optional[float] = Field(default=None, ge=0)
    vacancy_rate: Optional[float] = Field(default=None, ge=0, le=1)
    down_payment: Optional[float] = Field(default=None, ge=0)

class PropertyResponse(PropertyBase):
    """Schema for property responses"""
    id: int
    user_id: int
    portfolio_id: Optional[int] = None
    financials: Optional[PropertyFinancialsResponse] = None
    model_config = ConfigDict(from_attributes=True)

# Property type enum for validation
PROPERTY_TYPES = [
    "residential",
    "commercial",
    "mixed_use",
    "land",
    "multifamily",
    "condo",
    "townhouse",
    "single_family"
]