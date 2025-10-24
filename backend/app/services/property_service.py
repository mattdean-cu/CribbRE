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
            is_primary_residence=property_data.get('is_primary_residence', False),
            down_payment=property_data.get('down_payment'),
            portfolio_id=property_data.get('portfolio_id')
        )

        self.db.add(property_obj)
        self.db.flush()  # Get the ID without committing

        # Prepare financial data for calculator
        financial_input = {
            'monthly_rent': property_data.get('monthly_rent', 0),
            'property_taxes': property_data.get('property_taxes', 0),
            'insurance': property_data.get('insurance', 0),
            'hoa_fees': property_data.get('hoa_fees', 0),
            'maintenance_costs': property_data.get('maintenance_costs', 0),
            'other_expenses': property_data.get('monthly_expenses', 0),  # "Other expenses" field
            'mortgage_payment': property_data.get('mortgage_payment', 0),
            'current_value': property_obj.current_value,
            'down_payment': property_data.get('down_payment', 0),
            'vacancy_rate': property_data.get('vacancy_rate', 0.05)
        }

        # Use Python to calculate metrics
        metrics = self.financial_calculator.calculate_all_metrics(financial_input)

        # Create financials record
        financials = PropertyFinancials(
            property_id=property_obj.id,
            monthly_rent=financial_input['monthly_rent'],
            property_taxes=financial_input['property_taxes'],
            insurance=financial_input['insurance'],
            hoa_fees=financial_input['hoa_fees'],
            maintenance_costs=financial_input['maintenance_costs'],
            other_expenses=financial_input['other_expenses'],
            monthly_mortgage=financial_input['mortgage_payment'],
            vacancy_rate=financial_input['vacancy_rate'],
            # Calculated metrics
            cap_rate=metrics['cap_rate'],
            cash_flow=metrics['monthly_cash_flow'],
            cash_on_cash_return=metrics['cash_on_cash_return']
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
        property_fields = ['name', 'address', 'property_type', 'purchase_date',
                           'purchase_price', 'current_value', 'square_footage',
                           'bedrooms', 'bathrooms', 'is_primary_residence',
                           'down_payment', 'portfolio_id']

        for field in property_fields:
            if field in update_data:
                setattr(property_obj, field, update_data[field])

        # Recalculate financials if financial data changed
        financial_fields = ['monthly_rent', 'property_taxes', 'insurance',
                            'hoa_fees', 'maintenance_costs', 'monthly_expenses',
                            'mortgage_payment', 'vacancy_rate']

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
            # Create financials if they don't exist
            property_obj.financials = PropertyFinancials(property_id=property_obj.id)

        # Update financial fields from update_data
        financial_field_mapping = {
            'monthly_rent': 'monthly_rent',
            'property_taxes': 'property_taxes',
            'insurance': 'insurance',
            'hoa_fees': 'hoa_fees',
            'maintenance_costs': 'maintenance_costs',
            'monthly_expenses': 'other_expenses',  # Maps to other_expenses in DB
            'mortgage_payment': 'monthly_mortgage',  # Maps to monthly_mortgage in DB
            'vacancy_rate': 'vacancy_rate'
        }

        for frontend_field, db_field in financial_field_mapping.items():
            if frontend_field in update_data:
                setattr(property_obj.financials, db_field, update_data[frontend_field])

        # Prepare data for calculator
        financial_input = {
            'monthly_rent': property_obj.financials.monthly_rent or 0,
            'property_taxes': property_obj.financials.property_taxes or 0,
            'insurance': property_obj.financials.insurance or 0,
            'hoa_fees': property_obj.financials.hoa_fees or 0,
            'maintenance_costs': property_obj.financials.maintenance_costs or 0,
            'other_expenses': property_obj.financials.other_expenses or 0,
            'mortgage_payment': property_obj.financials.monthly_mortgage or 0,
            'current_value': property_obj.current_value or 0,
            'down_payment': property_obj.down_payment or 0,
            'vacancy_rate': property_obj.financials.vacancy_rate or 0.05
        }

        # Recalculate metrics using Python
        metrics = self.financial_calculator.calculate_all_metrics(financial_input)

        # Update calculated fields
        property_obj.financials.cap_rate = metrics['cap_rate']
        property_obj.financials.cash_flow = metrics['monthly_cash_flow']
        property_obj.financials.cash_on_cash_return = metrics['cash_on_cash_return']