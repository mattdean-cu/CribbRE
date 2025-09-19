# backend/app/services/portfolio_service.py
# Portfolio business logic and database operations

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.portfolio import Portfolio
from app.models.property import Property
from app.schemas.portfolio import PortfolioMetrics, PortfolioWithMetrics
from collections import defaultdict


class PortfolioService:
    """Service class for portfolio folder management operations"""

    def __init__(self, db: Session):
        self.db = db

    def create_portfolio(self, portfolio_data: Dict[str, Any], user_id: int) -> Portfolio:
        """Create a new portfolio folder"""
        portfolio = Portfolio(
            user_id=user_id,
            **portfolio_data
        )

        self.db.add(portfolio)
        self.db.commit()
        self.db.refresh(portfolio)

        return portfolio

    def get_user_portfolios(self, user_id: int, include_default: bool = True) -> List[Portfolio]:
        """Get all portfolio folders for a user"""
        query = self.db.query(Portfolio).filter(Portfolio.user_id == user_id)

        if not include_default:
            query = query.filter(Portfolio.is_default == False)

        return query.order_by(Portfolio.name).all()

    def get_portfolio_by_id(self, portfolio_id: int, user_id: int) -> Optional[Portfolio]:
        """Get a portfolio folder by ID for a specific user"""
        return self.db.query(Portfolio).filter(
            and_(Portfolio.id == portfolio_id, Portfolio.user_id == user_id)
        ).first()

    def update_portfolio(self, portfolio_id: int, user_id: int, update_data: Dict[str, Any]) -> Optional[Portfolio]:
        """Update a portfolio folder"""
        portfolio = self.get_portfolio_by_id(portfolio_id, user_id)

        if not portfolio:
            return None

        for key, value in update_data.items():
            if hasattr(portfolio, key):
                setattr(portfolio, key, value)

        self.db.commit()
        self.db.refresh(portfolio)

        return portfolio

    def delete_portfolio(self, portfolio_id: int, user_id: int, move_properties_to: Optional[int] = None) -> bool:
        """Delete a portfolio folder, optionally moving properties to another folder"""
        portfolio = self.get_portfolio_by_id(portfolio_id, user_id)

        if not portfolio:
            return False

        # Don't allow deletion of default portfolio
        if portfolio.is_default:
            raise ValueError("Cannot delete the default portfolio")

        # Handle properties in this portfolio
        if move_properties_to:
            # Move properties to specified portfolio
            target_portfolio = self.get_portfolio_by_id(move_properties_to, user_id)
            if target_portfolio:
                self.db.query(Property).filter(
                    Property.portfolio_id == portfolio_id
                ).update({"portfolio_id": move_properties_to})
        else:
            # Move properties to default portfolio or set to None
            default_portfolio = self.get_default_portfolio(user_id)
            new_portfolio_id = default_portfolio.id if default_portfolio else None

            self.db.query(Property).filter(
                Property.portfolio_id == portfolio_id
            ).update({"portfolio_id": new_portfolio_id})

        # Delete the portfolio
        self.db.delete(portfolio)
        self.db.commit()

        return True

    def move_property_to_portfolio(self, property_id: int, portfolio_id: int, user_id: int) -> bool:
        """Move a property to a different portfolio folder"""
        # Verify property belongs to user
        property_obj = self.db.query(Property).filter(
            and_(Property.id == property_id, Property.user_id == user_id)
        ).first()

        if not property_obj:
            return False

        # Verify target portfolio belongs to user
        portfolio = self.get_portfolio_by_id(portfolio_id, user_id)

        if not portfolio:
            return False

        # Move the property
        property_obj.portfolio_id = portfolio_id
        self.db.commit()

        return True

    def get_portfolio_properties(self, portfolio_id: int, user_id: int) -> Optional[List[Property]]:
        """Get all properties in a specific portfolio folder"""
        portfolio = self.get_portfolio_by_id(portfolio_id, user_id)

        if not portfolio:
            return None

        return self.db.query(Property).filter(
            and_(Property.portfolio_id == portfolio_id, Property.user_id == user_id)
        ).all()

    def calculate_portfolio_metrics(self, portfolio_id: int, user_id: int) -> Optional[PortfolioMetrics]:
        """Calculate financial metrics for a portfolio folder"""
        properties = self.get_portfolio_properties(portfolio_id, user_id)

        if properties is None:
            return None

        # Initialize metrics
        metrics = {
            "property_count": len(properties),
            "total_value": 0,
            "total_monthly_cash_flow": 0,
            "total_annual_cash_flow": 0,
            "average_cap_rate": 0,
            "average_monthly_rent": 0,
            "average_monthly_expenses": 0,
            "total_equity": 0,
            "residential_count": 0,
            "commercial_count": 0,
            "mixed_use_count": 0,
            "other_count": 0,
            "top_cities": [],
            "positive_cash_flow_count": 0,
            "negative_cash_flow_count": 0,
            "break_even_count": 0
        }

        if not properties:
            return PortfolioMetrics(**metrics)

        # Accumulate values for calculations
        total_value_for_cap_rate = 0
        weighted_cap_rate = 0
        total_rent = 0
        total_expenses = 0
        city_counts = defaultdict(int)
        city_values = defaultdict(float)

        for prop in properties:
            # Basic metrics
            current_value = prop.current_value or 0
            metrics["total_value"] += current_value

            # Property type counts
            if prop.property_type.value == "residential":
                metrics["residential_count"] += 1
            elif prop.property_type.value == "commercial":
                metrics["commercial_count"] += 1
            elif prop.property_type.value == "mixed_use":
                metrics["mixed_use_count"] += 1
            else:
                metrics["other_count"] += 1

            # Geographic distribution
            if prop.city:
                city_counts[prop.city] += 1
                city_values[prop.city] += current_value

            # Equity calculation
            if prop.financials and prop.financials.remaining_loan_balance:
                equity = current_value - prop.financials.remaining_loan_balance
                metrics["total_equity"] += max(0, equity)
            else:
                metrics["total_equity"] += current_value

            # Financial metrics (if available)
            if prop.financials:
                monthly_cash_flow = prop.financials.cash_flow or 0
                metrics["total_monthly_cash_flow"] += monthly_cash_flow

                # Cash flow performance counts
                if monthly_cash_flow > 50:  # Positive threshold
                    metrics["positive_cash_flow_count"] += 1
                elif monthly_cash_flow < -50:  # Negative threshold
                    metrics["negative_cash_flow_count"] += 1
                else:
                    metrics["break_even_count"] += 1

                # For weighted averages
                if prop.financials.cap_rate and current_value > 0:
                    weighted_cap_rate += (prop.financials.cap_rate * current_value)
                    total_value_for_cap_rate += current_value

                if prop.financials.monthly_rent:
                    total_rent += prop.financials.monthly_rent

                total_monthly_expenses = prop.financials.get_total_monthly_expenses()
                if total_monthly_expenses:
                    total_expenses += total_monthly_expenses

        # Calculate averages
        property_count = len(properties)

        metrics["total_annual_cash_flow"] = metrics["total_monthly_cash_flow"] * 12

        if total_value_for_cap_rate > 0:
            metrics["average_cap_rate"] = weighted_cap_rate / total_value_for_cap_rate

        if property_count > 0:
            metrics["average_monthly_rent"] = total_rent / property_count
            metrics["average_monthly_expenses"] = total_expenses / property_count

        # Top cities by value
        sorted_cities = sorted(city_values.items(), key=lambda x: x[1], reverse=True)[:3]
        metrics["top_cities"] = [
            {
                "city": city,
                "property_count": city_counts[city],
                "total_value": value,
                "percentage": (value / metrics["total_value"] * 100) if metrics["total_value"] > 0 else 0
            }
            for city, value in sorted_cities
        ]

        return PortfolioMetrics(**metrics)

    def get_portfolio_with_metrics(self, portfolio_id: int, user_id: int) -> Optional[PortfolioWithMetrics]:
        """Get portfolio with calculated metrics"""
        portfolio = self.get_portfolio_by_id(portfolio_id, user_id)

        if not portfolio:
            return None

        metrics = self.calculate_portfolio_metrics(portfolio_id, user_id)

        return PortfolioWithMetrics(
            id=portfolio.id,
            user_id=portfolio.user_id,
            name=portfolio.name,
            description=portfolio.description,
            color=portfolio.color,
            icon=portfolio.icon,
            parent_id=portfolio.parent_id,
            is_default=portfolio.is_default,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
            metrics=metrics,
            folder_path=portfolio.folder_path
        )

    def get_user_portfolios_with_metrics(self, user_id: int, include_default: bool = True) -> List[
        PortfolioWithMetrics]:
        """Get all user portfolios with metrics"""
        portfolios = self.get_user_portfolios(user_id, include_default)

        result = []
        for portfolio in portfolios:
            portfolio_with_metrics = self.get_portfolio_with_metrics(portfolio.id, user_id)
            if portfolio_with_metrics:
                result.append(portfolio_with_metrics)

        return result

    def get_default_portfolio(self, user_id: int) -> Optional[Portfolio]:
        """Get or create the default 'All Properties' portfolio for a user"""
        default_portfolio = self.db.query(Portfolio).filter(
            and_(Portfolio.user_id == user_id, Portfolio.is_default == True)
        ).first()

        return default_portfolio

    def initialize_default_portfolio(self, user_id: int) -> Portfolio:
        """Create default portfolio and move all unassigned properties to it"""
        # Check if default portfolio already exists
        existing_default = self.get_default_portfolio(user_id)
        if existing_default:
            return existing_default

        # Create default portfolio
        default_portfolio = Portfolio(
            user_id=user_id,
            name="All Properties",
            description="Default folder containing all properties",
            color="#6B7280",
            icon="folder",
            is_default=True
        )

        self.db.add(default_portfolio)
        self.db.commit()
        self.db.refresh(default_portfolio)

        # Move all unassigned properties to default portfolio
        self.db.query(Property).filter(
            and_(Property.user_id == user_id, Property.portfolio_id.is_(None))
        ).update({"portfolio_id": default_portfolio.id})

        self.db.commit()

        return default_portfolio