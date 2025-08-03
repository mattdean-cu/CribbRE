from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .base import Base


class PropertyType(enum.Enum):
    """Property type enumeration"""
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    MIXED_USE = "mixed_use"
    LAND = "land"
    INDUSTRIAL = "industrial"


class PropertyStatus(enum.Enum):
    """Property status enumeration"""
    OWNED = "owned"
    UNDER_CONTRACT = "under_contract"
    SOLD = "sold"
    RENTED = "rented"
    VACANT = "vacant"


class Property(Base):
    """
    Core property model with basic property information
    """
    __tablename__ = "properties"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Basic property information
    name = Column(String(255), nullable=False)  # User-defined property name
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(20))
    country = Column(String(50), default="USA")

    # Property characteristics
    property_type = Column(Enum(PropertyType), nullable=False)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.OWNED)

    # Physical details
    square_footage = Column(Float)  # Total square footage
    lot_size = Column(Float)  # Lot size in acres or sq ft
    bedrooms = Column(Integer)
    bathrooms = Column(Float)  # 2.5 bathrooms, etc.
    year_built = Column(Integer)
    stories = Column(Integer)
    garage_spaces = Column(Integer)

    # Financial basics
    purchase_date = Column(Date)
    purchase_price = Column(Float)
    current_value = Column(Float)  # Current estimated value
    down_payment = Column(Float)  # Amount paid as down payment
    loan_amount = Column(Float)  # Original loan amount

    # Usage classification
    is_primary_residence = Column(Boolean, default=False)
    is_rental_property = Column(Boolean, default=False)
    is_investment_property = Column(Boolean, default=True)

    # Property notes and description
    description = Column(Text)
    notes = Column(Text)  # Private notes for the user

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="properties")
    financials = relationship("PropertyFinancials", back_populates="property_ref", uselist=False,
                              cascade="all, delete-orphan")
    portfolio_items = relationship("PortfolioProperty", back_populates="property", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Property(id={self.id}, name={self.name}, type={self.property_type})>"

    def get_full_address(self):
        """Get formatted full address"""
        address_parts = [self.address, self.city, self.state, self.zip_code]
        return ", ".join([str(part) for part in address_parts if part is not None])

    def get_property_age(self):
        """Calculate property age in years"""
        if self.year_built:
            from datetime import datetime
            return datetime.now().year - self.year_built
        return None

    def get_equity(self):
        """Calculate current equity (current value - remaining loan)"""
        if self.current_value and self.financials and self.financials.remaining_loan_balance:
            return self.current_value - self.financials.remaining_loan_balance
        return self.current_value or 0


class PropertyFinancials(Base):
    """
    Detailed financial information for each property
    This is where Python will excel at calculations
    """
    __tablename__ = "property_financials"

    # Primary key (one-to-one with Property)
    property_id = Column(Integer, ForeignKey("properties.id"), primary_key=True)

    # Monthly Income
    monthly_rent = Column(Float, default=0)
    other_monthly_income = Column(Float, default=0)  # Parking, laundry, etc.

    # Monthly Expenses
    monthly_mortgage = Column(Float, default=0)
    property_taxes = Column(Float, default=0)  # Monthly amount
    insurance = Column(Float, default=0)  # Monthly amount
    hoa_fees = Column(Float, default=0)
    maintenance_costs = Column(Float, default=0)
    property_management = Column(Float, default=0)
    utilities = Column(Float, default=0)  # If owner pays
    other_expenses = Column(Float, default=0)

    # Financial assumptions
    vacancy_rate = Column(Float, default=0.05)  # 5% default vacancy
    annual_rent_increase = Column(Float, default=0.03)  # 3% default
    annual_expense_increase = Column(Float, default=0.03)  # 3% default
    annual_appreciation = Column(Float, default=0.04)  # 4% default

    # Loan information
    loan_interest_rate = Column(Float)
    loan_term_months = Column(Integer)  # 360 for 30-year mortgage
    remaining_loan_balance = Column(Float)

    # Calculated metrics (computed by Python services)
    cap_rate = Column(Float)  # Net Operating Income / Property Value
    cash_flow = Column(Float)  # Monthly cash flow
    cash_on_cash_return = Column(Float)  # Annual cash flow / initial investment
    total_return = Column(Float)  # Including appreciation

    # Last calculation update
    last_calculated = Column(DateTime(timezone=True))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    property_ref = relationship("Property", back_populates="financials")

    def __repr__(self):
        return f"<PropertyFinancials(property_id={self.property_id}, monthly_rent={self.monthly_rent})>"

    def get_total_monthly_income(self):
        """Calculate total monthly income"""
        return (self.monthly_rent or 0) + (self.other_monthly_income or 0)

    def get_total_monthly_expenses(self):
        """Calculate total monthly expenses"""
        expenses = [
            self.monthly_mortgage, self.property_taxes, self.insurance,
            self.hoa_fees, self.maintenance_costs, self.property_management,
            self.utilities, self.other_expenses
        ]
        return sum(expense or 0 for expense in expenses)

    def get_monthly_cash_flow(self):
        """Calculate monthly cash flow"""
        return self.get_total_monthly_income() - self.get_total_monthly_expenses()

    def get_annual_noi(self):
        """Calculate Net Operating Income (excluding mortgage)"""
        income = self.get_total_monthly_income() * 12
        expenses_without_mortgage = self.get_total_monthly_expenses() - (self.monthly_mortgage or 0)
        return income - (expenses_without_mortgage * 12)