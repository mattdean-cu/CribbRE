# app/services/financial_calculator.py
# Core Python financial calculation engine for real estate metrics

class FinancialCalculator:
    """
    Python-powered financial calculations for real estate properties.
    This is where Python excels - complex math operations.
    """

    @staticmethod
    def calculate_cap_rate(noi: float, property_value: float) -> float:
        """Cap Rate = Net Operating Income / Property Value"""
        if property_value == 0:
            return 0.0
        return (noi / property_value) * 100

    @staticmethod
    def calculate_cash_flow(monthly_rent: float, monthly_expenses: float) -> float:
        """Monthly Cash Flow = Rent - Expenses"""
        return monthly_rent - monthly_expenses

    @staticmethod
    def calculate_cash_on_cash_return(annual_cash_flow: float, initial_investment: float) -> float:
        """Cash-on-Cash Return = Annual Cash Flow / Initial Investment"""
        if initial_investment == 0:
            return 0.0
        return (annual_cash_flow / initial_investment) * 100

    @staticmethod
    def calculate_noi(monthly_rent: float, vacancy_rate: float, annual_expenses: float) -> float:
        """Net Operating Income = (Monthly Rent * 12 * (1 - Vacancy Rate)) - Annual Expenses"""
        annual_rent = monthly_rent * 12
        effective_rent = annual_rent * (1 - vacancy_rate)
        return effective_rent - annual_expenses

    @classmethod
    def calculate_all_metrics(cls, property_data: dict) -> dict:
        """
        Calculate all financial metrics for a property.
        This is where Python shines - complex calculations made simple.
        """
        monthly_rent = property_data.get('monthly_rent', 0)
        monthly_expenses = property_data.get('monthly_expenses', 0)
        property_value = property_data.get('current_value', 0)
        vacancy_rate = property_data.get('vacancy_rate', 0.05)
        down_payment = property_data.get('down_payment', 0)

        # Calculate basic metrics
        monthly_cash_flow = cls.calculate_cash_flow(monthly_rent, monthly_expenses)
        annual_cash_flow = monthly_cash_flow * 12

        # Calculate NOI (simplified for now)
        annual_expenses = monthly_expenses * 12
        noi = cls.calculate_noi(monthly_rent, vacancy_rate, annual_expenses)

        # Calculate all metrics
        return {
            'monthly_cash_flow': monthly_cash_flow,
            'annual_cash_flow': annual_cash_flow,
            'cap_rate': cls.calculate_cap_rate(noi, property_value),
            'cash_on_cash_return': cls.calculate_cash_on_cash_return(annual_cash_flow, down_payment),
            'noi': noi
        }