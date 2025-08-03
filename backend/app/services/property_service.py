# app/services/property_service.py
# Property CRUD operations with financial calculations

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.property import Property, PropertyFinancials, PropertyType, PropertyStatus
from app.services.financial_calculator import FinancialCalculator


class PropertyService:
    def __init__(self, db: Session):
        self.db = db
        self.financial_calculator = FinancialCalculator()

    def create_property(self, property_data: dict, user_id: int) -> Property:
        """Create new property with automatic financial calculations"""
        # Create property
        property_obj = Property(
            user_id=user_id,
            name=property_data.get('name'),
            address=property_data.get('address'),
            property_type=PropertyType(property_data.get('property_type', 'residential')),
            purchase_date=property_data.get('purchase_date'),
            purchase_price=property_data.get('purchase_price', 0),
            current_value=property_data.get('current_value', 0),
            square_footage=property_data.get('square_footage'),
            bedrooms=property_data.get('bedrooms'),
            bathrooms=property_data.get('bathrooms'),
            is_primary_residence=property_data.get('is_primary_residence', False)
        )

        self.db.add(property_obj)
        self.db.flush()  # Get the ID without committing

        # Create financial data with Python calculations
        financial_data = {
            'monthly_rent': property_data.get('monthly_rent', 0),
            'property_taxes': property_data.get('property_taxes', 0),
            'insurance': property_data.get('insurance', 0),
            'hoa_fees': property_data.get('hoa_fees', 0),
            'maintenance_costs': property_data.get('maintenance_costs', 0),
            'vacancy_rate': property_data.get('vacancy_rate', 0.05)
        }

        # Calculate total monthly expenses for our calculator
        total_monthly_expenses = (
                financial_data['property_taxes'] / 12 +  # Convert annual to monthly
                financial_data['insurance'] / 12 +  # Convert annual to monthly
                financial_data['hoa_fees'] +
                financial_data['maintenance_costs']
        )

        # Use Python to calculate metrics
        metrics = self.financial_calculator.calculate_all_metrics({
            'monthly_rent': financial_data['monthly_rent'],
            'monthly_expenses': total_monthly_expenses,
            'current_value': property_obj.current_value,
            'down_payment': property_data.get('down_payment', 0),
            'vacancy_rate': financial_data['vacancy_rate']
        })

        financials = PropertyFinancials(
            property_id=property_obj.id,
            monthly_rent=financial_data['monthly_rent'],
            property_taxes=financial_data['property_taxes'],
            insurance=financial_data['insurance'],
            hoa_fees=financial_data['hoa_fees'],
            maintenance_costs=financial_data['maintenance_costs'],
            vacancy_rate=financial_data['vacancy_rate'],
            cap_rate=metrics['cap_rate'],
            cash_flow=metrics['monthly_cash_flow']
        )

        self.db.add(financials)
        self.db.commit()
        self.db.refresh(property_obj)

        return property_obj

    def get_user_properties(self, user_id: int) -> List[Property]:
        """Get all properties for a user"""
        return self.db.query(Property).filter(
            Property.user_id == user_id
        ).all()

    def get_property_by_id(self, property_id: int, user_id: int) -> Optional[Property]:
        """Get a specific property (user must own it)"""
        return self.db.query(Property).filter(
            and_(Property.id == property_id, Property.user_id == user_id)
        ).first()

    def update_property(self, property_id: int, user_id: int, update_data: dict) -> Optional[Property]:
        """Update property and recalculate financials"""
        property_obj = self.get_property_by_id(property_id, user_id)
        if not property_obj:
            return None

        # Convert property_type from frontend format to enum if present
        if 'property_type' in update_data:
            property_type_value = update_data['property_type']
            try:
                # Convert string to PropertyType enum
                update_data['property_type'] = PropertyType(property_type_value)
            except ValueError:
                # If the value doesn't match any enum value, remove it from update
                del update_data['property_type']

        # Update property fields
        for field, value in update_data.items():
            if hasattr(property_obj, field):
                setattr(property_obj, field, value)

        # Recalculate financials if financial data changed
        financial_fields = ['monthly_rent', 'property_taxes',
                            'insurance', 'hoa_fees', 'maintenance_costs', 'vacancy_rate']

        if any(field in update_data for field in financial_fields):
            self._recalculate_financials(property_obj, update_data)

        self.db.commit()
        self.db.refresh(property_obj)
        return property_obj

    def delete_property(self, property_id: int, user_id: int) -> bool:
        """Delete property (user must own it)"""
        property_obj = self.get_property_by_id(property_id, user_id)
        if not property_obj:
            return False

        self.db.delete(property_obj)
        self.db.commit()
        return True

    def _recalculate_financials(self, property_obj: Property, update_data: dict):
        """Recalculate financial metrics when data changes"""
        if not property_obj.financials:
            return

        # Update financial fields
        for field, value in update_data.items():
            if hasattr(property_obj.financials, field):
                setattr(property_obj.financials, field, value)

        # Calculate total monthly expenses from individual components
        total_monthly_expenses = (
                (property_obj.financials.property_taxes or 0) / 12 +
                (property_obj.financials.insurance or 0) / 12 +
                (property_obj.financials.hoa_fees or 0) +
                (property_obj.financials.maintenance_costs or 0)
        )

        # Recalculate metrics using Python
        financial_data = {
            'monthly_rent': property_obj.financials.monthly_rent or 0,
            'monthly_expenses': total_monthly_expenses,
            'current_value': property_obj.current_value,
            'vacancy_rate': property_obj.financials.vacancy_rate or 0.05,
            'down_payment': update_data.get('down_payment', 0)
        }

        metrics = self.financial_calculator.calculate_all_metrics(financial_data)

        property_obj.financials.cap_rate = metrics['cap_rate']
        property_obj.financials.cash_flow = metrics['monthly_cash_flow']