import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calculator } from 'lucide-react';

interface PropertyFinancials {
  monthly_cash_flow: number;
  annual_cash_flow: number;
  cap_rate: number;
  cash_on_cash_return: number;
  monthly_rent: number;
  monthly_expenses: number;
  noi: number;
}

interface Property {
  id: number;
  name: string;
  current_value: number;
  purchase_price: number;
  financials: PropertyFinancials;
}

interface PropertyFinancialMetricsProps {
  property: Property;
}

const PropertyFinancialMetrics: React.FC<PropertyFinancialMetricsProps> = ({ property }) => {
  const { financials } = property;

  // Helper function to determine metric performance color
  const getMetricColor = (value: number, type: 'cap_rate' | 'cash_flow' | 'return') => {
    switch (type) {
      case 'cap_rate':
        if (value >= 8) return 'text-green-600 bg-green-50';
        if (value >= 5) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
      case 'cash_flow':
        if (value > 0) return 'text-green-600 bg-green-50';
        return 'text-red-600 bg-red-50';
      case 'return':
        if (value >= 10) return 'text-green-600 bg-green-50';
        if (value >= 6) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const metrics = [
    {
      label: 'Cap Rate',
      value: formatPercentage(financials.cap_rate),
      icon: Percent,
      color: getMetricColor(financials.cap_rate, 'cap_rate'),
      description: 'Annual return on investment',
    },
    {
      label: 'Monthly Cash Flow',
      value: formatCurrency(financials.monthly_cash_flow),
      icon: financials.monthly_cash_flow > 0 ? TrendingUp : TrendingDown,
      color: getMetricColor(financials.monthly_cash_flow, 'cash_flow'),
      description: 'Monthly income after expenses',
    },
    {
      label: 'Annual Cash Flow',
      value: formatCurrency(financials.annual_cash_flow),
      icon: DollarSign,
      color: getMetricColor(financials.annual_cash_flow, 'cash_flow'),
      description: 'Yearly cash generation',
    },
    {
      label: 'Cash-on-Cash Return',
      value: formatPercentage(financials.cash_on_cash_return),
      icon: Calculator,
      color: getMetricColor(financials.cash_on_cash_return, 'return'),
      description: 'Return on initial investment',
    },
  ];

  const incomeExpenseData = [
    {
      label: 'Monthly Rent',
      value: formatCurrency(financials.monthly_rent),
      type: 'income',
    },
    {
      label: 'Monthly Expenses',
      value: formatCurrency(financials.monthly_expenses),
      type: 'expense',
    },
    {
      label: 'Net Operating Income',
      value: formatCurrency(financials.noi),
      type: financials.noi > 0 ? 'income' : 'expense',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{property.name}</h2>
        <p className="text-sm text-gray-600 mt-1">
          Current Value: {formatCurrency(property.current_value)} |
          Purchase Price: {formatCurrency(property.purchase_price)}
        </p>
      </div>

      {/* Key Financial Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${metric.color} transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-5 w-5" />
                  <span className="text-2xl font-bold">{metric.value}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{metric.label}</p>
                  <p className="text-xs opacity-75 mt-1">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Income & Expenses Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income & Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {incomeExpenseData.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                item.type === 'income'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="text-center">
                <p className="text-sm font-medium opacity-75">{item.label}</p>
                <p className="text-xl font-bold mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Performance Summary</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            • {financials.monthly_cash_flow > 0 ? 'Positive' : 'Negative'} monthly cash flow of {formatCurrency(Math.abs(financials.monthly_cash_flow))}
          </p>
          <p>
            • Cap rate of {formatPercentage(financials.cap_rate)}
            {financials.cap_rate >= 8 ? ' (Excellent)' : financials.cap_rate >= 5 ? ' (Good)' : ' (Needs improvement)'}
          </p>
          <p>
            • Annual return potential: {formatCurrency(financials.annual_cash_flow)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyFinancialMetrics;