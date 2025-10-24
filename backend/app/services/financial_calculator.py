# app/services/financial_calculator.py
# Core Python financial calculation engine for real estate metrics

class FinancialCalculator:
    """
    Python-powered financial calculations for real estate properties.
    This is where Python excels - complex math operations.

    Key Concepts:
    - Operating Expenses: Expenses for running the property (NO mortgage)
    - Total Expenses: Operating expenses + mortgage payment
    - NOI (Net Operating Income): Used for Cap Rate, excludes mortgage
    - Cash Flow: Actual money in pocket, includes mortgage
    """

    @staticmethod
    def calculate_cap_rate(noi: float, property_value: float) -> float:
        """
        Cap Rate = Net Operating Income / Property Value
        NOI does NOT include mortgage payments
        """
        if property_value == 0:
            return 0.0
        return (noi / property_value) * 100

    @staticmethod
    def calculate_cash_flow(monthly_rent: float, total_monthly_expenses: float) -> float:
        """
        Monthly Cash Flow = Rent - Total Expenses
        Total expenses INCLUDES mortgage payment
        """
        return monthly_rent - total_monthly_expenses

    @staticmethod
    def calculate_cash_on_cash_return(annual_cash_flow: float, initial_investment: float) -> float:
        """
        Cash-on-Cash Return = Annual Cash Flow / Initial Investment
        Initial investment = down payment + closing costs
        """
        if initial_investment == 0:
            return 0.0
        return (annual_cash_flow / initial_investment) * 100

    @staticmethod
    def calculate_noi(
            monthly_rent: float,
            vacancy_rate: float,
            monthly_operating_expenses: float
    ) -> float:
        """
        Net Operating Income (Annual):
        = (Monthly Rent * 12 * (1 - Vacancy Rate)) - (Annual Operating Expenses)

        Operating expenses = property taxes + insurance + HOA + maintenance + other
        Does NOT include mortgage payment
        """
        annual_rent = monthly_rent * 12
        effective_rent = annual_rent * (1 - vacancy_rate)
        annual_operating_expenses = monthly_operating_expenses * 12
        return effective_rent - annual_operating_expenses

    @staticmethod
    def calculate_operating_expenses(
            property_taxes: float = 0,
            insurance: float = 0,
            hoa_fees: float = 0,
            maintenance_costs: float = 0,
            other_expenses: float = 0
    ) -> float:
        """
        Calculate total monthly operating expenses (excludes mortgage)
        All inputs should be MONTHLY amounts
        """
        return (
                (property_taxes or 0) +
                (insurance or 0) +
                (hoa_fees or 0) +
                (maintenance_costs or 0) +
                (other_expenses or 0)
        )

    @staticmethod
    def calculate_total_expenses(
            operating_expenses: float,
            mortgage_payment: float = 0
    ) -> float:
        """
        Calculate total monthly expenses (includes mortgage)
        """
        return operating_expenses + (mortgage_payment or 0)

    @classmethod
    def calculate_all_metrics(cls, financial_data: dict) -> dict:
        """
        Calculate all financial metrics for a property.

        Expected financial_data keys:
        - monthly_rent: Monthly rental income
        - property_taxes: Monthly property taxes
        - insurance: Monthly insurance
        - hoa_fees: Monthly HOA fees
        - maintenance_costs: Monthly maintenance
        - other_expenses: Other monthly expenses
        - mortgage_payment: Monthly mortgage (P&I)
        - current_value: Current property value
        - down_payment: Down payment amount
        - vacancy_rate: Vacancy rate (0.05 = 5%)
        """
        # Extract data with defaults
        monthly_rent = financial_data.get('monthly_rent', 0) or 0
        property_taxes = financial_data.get('property_taxes', 0) or 0
        insurance = financial_data.get('insurance', 0) or 0
        hoa_fees = financial_data.get('hoa_fees', 0) or 0
        maintenance_costs = financial_data.get('maintenance_costs', 0) or 0
        other_expenses = financial_data.get('other_expenses', 0) or 0
        mortgage_payment = financial_data.get('mortgage_payment', 0) or 0
        current_value = financial_data.get('current_value', 0) or 0
        down_payment = financial_data.get('down_payment', 0) or 0
        vacancy_rate = financial_data.get('vacancy_rate', 0.05) or 0.05

        # Calculate operating expenses (no mortgage)
        monthly_operating_expenses = cls.calculate_operating_expenses(
            property_taxes=property_taxes,
            insurance=insurance,
            hoa_fees=hoa_fees,
            maintenance_costs=maintenance_costs,
            other_expenses=other_expenses
        )

        # Calculate total expenses (with mortgage)
        total_monthly_expenses = cls.calculate_total_expenses(
            operating_expenses=monthly_operating_expenses,
            mortgage_payment=mortgage_payment
        )

        # Calculate NOI (uses operating expenses only)
        noi = cls.calculate_noi(
            monthly_rent=monthly_rent,
            vacancy_rate=vacancy_rate,
            monthly_operating_expenses=monthly_operating_expenses
        )

        # Calculate cash flow (uses total expenses including mortgage)
        monthly_cash_flow = cls.calculate_cash_flow(
            monthly_rent=monthly_rent,
            total_monthly_expenses=total_monthly_expenses
        )

        annual_cash_flow = monthly_cash_flow * 12

        # Calculate cap rate (uses NOI)
        cap_rate = cls.calculate_cap_rate(noi=noi, property_value=current_value)

        # Calculate cash-on-cash return
        cash_on_cash_return = cls.calculate_cash_on_cash_return(
            annual_cash_flow=annual_cash_flow,
            initial_investment=down_payment
        )

        return {
            'monthly_operating_expenses': monthly_operating_expenses,
            'total_monthly_expenses': total_monthly_expenses,
            'monthly_cash_flow': monthly_cash_flow,
            'annual_cash_flow': annual_cash_flow,
            'noi': noi,
            'cap_rate': cap_rate,
            'cash_on_cash_return': cash_on_cash_return,
        }