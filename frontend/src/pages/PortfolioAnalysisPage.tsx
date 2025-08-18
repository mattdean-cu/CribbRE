import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart, Calculator, Target } from 'lucide-react';
import { usePropertyStore, PropertyWithFinancials } from '../store/propertyStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const PortfolioAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { properties, fetchProperties, isLoading, error } = usePropertyStore();
  const [analysisType, setAnalysisType] = useState<'overview' | 'performance' | 'comparison'>('overview');
  const [timeframe, setTimeframe] = useState<'1yr' | '3yr' | '5yr' | '10yr' | '20yr' | '30yr'>('1yr');

  useEffect(() => {
    fetchProperties().catch(console.error);
  }, [fetchProperties]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  // Chart color scheme - Using your theme colors
  const COLORS = ['#0b591d', '#0f7024', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  // Custom tooltip formatter for currency
  const formatTooltipCurrency = (value: number) => {
    return formatCurrency(value);
  };

  // Calculate portfolio metrics
  const portfolioMetrics = React.useMemo(() => {
    if (properties.length === 0) return null;

    const totalValue = properties.reduce((sum, p) => sum + (p.current_value || 0), 0);
    const totalPurchasePrice = properties.reduce((sum, p) => sum + (p.purchase_price || 0), 0);
    const totalMonthlyCashFlow = properties.reduce((sum, p) => sum + (p.monthly_cash_flow || 0), 0);
    const totalMonthlyRent = properties.reduce((sum, p) => sum + (p.financials?.monthly_rent || 0), 0);
    const totalMonthlyExpenses = properties.reduce((sum, p) => sum + (p.financials?.monthly_expenses || 0), 0);

    const propertiesWithCapRate = properties.filter(p => p.cap_rate && p.cap_rate > 0);
    const avgCapRate = propertiesWithCapRate.length > 0
      ? propertiesWithCapRate.reduce((sum, p) => sum + (p.cap_rate || 0), 0) / propertiesWithCapRate.length
      : 0;

    const totalAppreciation = totalValue - totalPurchasePrice;
    const appreciationPercentage = totalPurchasePrice > 0 ? (totalAppreciation / totalPurchasePrice) * 100 : 0;

    // Property type distribution
    const typeDistribution = properties.reduce((acc, property) => {
      const type = property.property_type || 'unknown';
      acc[type] = (acc[type] || 0) + property.current_value;
      return acc;
    }, {} as Record<string, number>);

    // Geographic distribution (by address for now - could be enhanced with city/state)
    const geoDistribution = properties.reduce((acc, property) => {
      const location = property.address?.split(',')[1]?.trim() || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProperties: properties.length,
      totalValue,
      totalPurchasePrice,
      totalAppreciation,
      appreciationPercentage,
      totalMonthlyCashFlow,
      totalMonthlyRent,
      totalMonthlyExpenses,
      avgCapRate,
      typeDistribution,
      geoDistribution,
      grossRentMultiplier: totalValue > 0 ? totalValue / (totalMonthlyRent * 12) : 0,
      cashOnCashReturn: totalPurchasePrice > 0 ? (totalMonthlyCashFlow * 12 / totalPurchasePrice) * 100 : 0,
    };
  }, [properties]);

  // Performance insights
  const insights = React.useMemo(() => {
    if (!portfolioMetrics || properties.length === 0) return [];

    const insights = [];

    // Cash flow insight
    if (portfolioMetrics.totalMonthlyCashFlow > 0) {
      insights.push({
        type: 'positive',
        title: 'Positive Cash Flow',
        description: `Your portfolio generates ${formatCurrency(portfolioMetrics.totalMonthlyCashFlow)} monthly`,
        icon: TrendingUp
      });
    } else if (portfolioMetrics.totalMonthlyCashFlow < 0) {
      insights.push({
        type: 'negative',
        title: 'Negative Cash Flow',
        description: `Portfolio requires ${formatCurrency(Math.abs(portfolioMetrics.totalMonthlyCashFlow))} monthly funding`,
        icon: TrendingDown
      });
    }

    // Cap rate insight
    if (portfolioMetrics.avgCapRate >= 8) {
      insights.push({
        type: 'positive',
        title: 'Strong Cap Rate',
        description: `Average cap rate of ${formatPercentage(portfolioMetrics.avgCapRate)} exceeds market standards`,
        icon: Target
      });
    } else if (portfolioMetrics.avgCapRate < 5 && portfolioMetrics.avgCapRate > 0) {
      insights.push({
        type: 'warning',
        title: 'Low Cap Rate',
        description: `Consider properties with higher returns (current: ${formatPercentage(portfolioMetrics.avgCapRate)})`,
        icon: TrendingDown
      });
    }

    // Appreciation insight
    if (portfolioMetrics.appreciationPercentage > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Appreciation',
        description: `Portfolio has appreciated ${formatPercentage(portfolioMetrics.appreciationPercentage)} since purchase`,
        icon: TrendingUp
      });
    }

    // Diversification insight
    const typeCount = Object.keys(portfolioMetrics.typeDistribution).length;
    if (typeCount === 1 && properties.length > 2) {
      insights.push({
        type: 'warning',
        title: 'Limited Diversification',
        description: 'Consider diversifying across different property types',
        icon: PieChart
      });
    }

    return insights;
  }, [portfolioMetrics, properties]);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!portfolioMetrics || properties.length === 0) return null;

    // Property performance data for pie chart
    const propertyTypeColors = {
      'residential': '#0b591d',
      'commercial': '#0f7024',
      'mixed_use': '#10b981',
      'industrial': '#34d399',
      'retail': '#6ee7b7',
      'office': '#a7f3d0',
      'unknown': '#9ca3af'
    };

    const propertyPerformanceData = properties.map(property => {
      const monthlyRent = property.financials?.monthly_rent || 0;
      const rentToValueRatio = property.current_value > 0
        ? ((monthlyRent * 12) / property.current_value * 100)
        : 0;

      const propertyType = property.property_type || 'unknown';
      const typeColor = propertyTypeColors[propertyType as keyof typeof propertyTypeColors] || propertyTypeColors.unknown;

      return {
        name: property.name.length > 15 ? property.name.substring(0, 15) + '...' : property.name,
        fullName: property.name,
        value: property.current_value,
        cashFlow: property.monthly_cash_flow || 0,
        capRate: property.cap_rate || 0,
        roi: property.roi || 0,
        rentToValueRatio: rentToValueRatio.toFixed(2),
        propertyType: propertyType,
        propertyTypeColor: typeColor,
        percentage: ((property.current_value / portfolioMetrics.totalValue) * 100).toFixed(1)
      };
    });

    // Property type distribution for pie chart
    const typeDistributionData = Object.entries(portfolioMetrics.typeDistribution).map(([type, value]) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value,
      percentage: ((value / portfolioMetrics.totalValue) * 100).toFixed(1)
    }));

    // Portfolio value trend over time (FIXED)
    const timeframePeriods = {
      '1yr': 12,
      '3yr': 36,
      '5yr': 60,
      '10yr': 120,
      '20yr': 240,
      '30yr': 360
    };

    const periods = timeframePeriods[timeframe];
    const monthlyGrowthRate = 0.003; // 0.3% monthly = ~3.6% annually
    const baseValue = portfolioMetrics.totalValue || 0;
    const monthlyCashFlow = portfolioMetrics.totalMonthlyCashFlow || 0;

    // Generate fewer data points for longer timeframes to avoid performance issues
    let dataPoints: number;
    let stepSize: number;

    if (timeframe === '1yr') {
      dataPoints = 12;
      stepSize = 1;
    } else if (timeframe === '3yr') {
      dataPoints = 12; // Show quarterly for 3 years
      stepSize = 3;
    } else if (timeframe === '5yr') {
      dataPoints = 10; // Show every 6 months for 5 years
      stepSize = 6;
    } else {
      // For 10yr, 20yr, 30yr - show every year
      dataPoints = parseInt(timeframe); // Use the actual number from timeframe (10, 20, 30)
      stepSize = 12; // 12 months = 1 year
    }

    const portfolioValueTrendData = Array.from({ length: dataPoints }, (_, i) => {
      const monthIndex = i * stepSize;

      // Debug for problematic timeframes
      if (timeframe !== '1yr' && timeframe !== '3yr') {
        console.log(`Data point ${i}: monthIndex=${monthIndex}, stepSize=${stepSize}, dataPoints=${dataPoints}`);
      }

      // For 1yr, show months; for longer periods, show years or periods
      let periodLabel: string;
      if (timeframe === '1yr') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        periodLabel = monthNames[monthIndex] || `Month ${monthIndex + 1}`;
      } else {
        // Use the data point index to ensure unique labels
        if (timeframe === '3yr') {
          const quarter = (i % 4) + 1; // Q1, Q2, Q3, Q4
          const year = Math.floor(i / 4) + 1; // Y1, Y2, Y3
          periodLabel = `Q${quarter} Y${year}`;
        } else if (timeframe === '5yr') {
          // Every 6 months = 2 periods per year, so Q1/Q3 alternating
          const isFirstHalf = (i % 2) === 0;
          const quarter = isFirstHalf ? 1 : 3; // Q1 or Q3
          const year = Math.floor(i / 2) + 1; // Y1, Y2, Y3, etc.
          periodLabel = `Q${quarter} Y${year}`;
        } else {
          periodLabel = `Year ${i + 1}`; // Year 1, Year 2, etc.
        }
      }

      // Ensure we don't have negative or invalid values
      const monthlyAppreciationRate = 0.003; // ~3.6% annually compounded monthly
      const rentGrowthRate = 0.002; // ~2.4% annually for rent increases

      // Compound growth formula: A = P(1 + r)^t
      const appreciationMultiplier = Math.pow(1 + monthlyAppreciationRate, monthIndex);
      const rentGrowthMultiplier = Math.pow(1 + rentGrowthRate, monthIndex);

      const portfolioValue = Math.max(0, baseValue * appreciationMultiplier);

      // Calculate cumulative cash flow with rent growth over time
      const currentMonthlyCashFlow = monthlyCashFlow * rentGrowthMultiplier;
      const cumulativeCashFlow = monthlyCashFlow * (rentGrowthMultiplier - 1) / rentGrowthRate;

      // Total net worth
      const netWorth = portfolioValue + cumulativeCashFlow;

      const dataPoint = {
        period: periodLabel,
        portfolioValue: Math.round(portfolioValue) || 0,
        cumulativeCashFlow: Math.round(cumulativeCashFlow) || 0,
        netWorth: Math.round(netWorth) || 0
      };

      // Debug for problematic timeframes
      if (timeframe !== '1yr' && timeframe !== '3yr') {
        console.log(`Generated data point ${i}:`, dataPoint);
      }

      return dataPoint;
    });

    // Value vs Cash Flow scatter-like data
    const valueVsCashFlowData = properties.map(property => ({
      name: property.name,
      value: property.current_value,
      monthlyReturn: (property.monthly_cash_flow || 0) * 12,
      capRate: property.cap_rate || 0
    }));

    // Filter out any undefined/null values and validate data structure
    const validPortfolioValueTrendData = portfolioValueTrendData.filter(item =>
      item &&
      item.period &&
      typeof item.portfolioValue === 'number' &&
      typeof item.cumulativeCashFlow === 'number' &&
      typeof item.netWorth === 'number' &&
      !isNaN(item.portfolioValue) &&
      !isNaN(item.cumulativeCashFlow) &&
      !isNaN(item.netWorth)
    );

    // Create a simple test dataset
    const testData = [
      { period: 'Jan', portfolioValue: 100000, cumulativeCashFlow: 1000, netWorth: 101000 },
      { period: 'Feb', portfolioValue: 102000, cumulativeCashFlow: 2000, netWorth: 104000 },
      { period: 'Mar', portfolioValue: 104000, cumulativeCashFlow: 3000, netWorth: 107000 }
    ];

    // Debug logging
    console.log('Timeframe:', timeframe);
    console.log('Raw Portfolio Value Trend Data:', portfolioValueTrendData);
    console.log('Valid Portfolio Value Trend Data:', validPortfolioValueTrendData);
    console.log('First few data points:', validPortfolioValueTrendData.slice(0, 3));
    console.log('Test Data:', testData);
    console.log('Portfolio Metrics:', portfolioMetrics);

    return {
      propertyPerformanceData,
      portfolioValueTrendData: validPortfolioValueTrendData,
      valueVsCashFlowData,
      typeDistributionData
    };
  }, [portfolioMetrics, properties, timeframe]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties to Analyze</h2>
            <p className="text-gray-600 mb-8">
              Add properties to your portfolio to see comprehensive analysis and insights.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Analysis</h1>
              <p className="text-gray-600">{properties.length} properties • {formatCurrency(portfolioMetrics!.totalValue)} total value</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setAnalysisType('overview')}
              className={`px-4 py-2 rounded-lg font-medium ${
                analysisType === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setAnalysisType('comparison')}
              className={`px-4 py-2 rounded-lg font-medium ${
                analysisType === 'comparison'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Comparison
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium text-green-600">
                {portfolioMetrics!.appreciationPercentage > 0 ? '+' : ''}
                {formatPercentage(portfolioMetrics!.appreciationPercentage)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioMetrics!.totalValue)}</h3>
            <p className="text-gray-600">Total Portfolio Value</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrency(portfolioMetrics!.totalAppreciation)} appreciation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className={`text-sm font-medium ${
                portfolioMetrics!.totalMonthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Monthly
              </span>
            </div>
            <h3 className={`text-2xl font-bold ${
              portfolioMetrics!.totalMonthlyCashFlow >= 0 ? 'text-gray-900' : 'text-red-600'
            }`}>
              {formatCurrency(portfolioMetrics!.totalMonthlyCashFlow)}
            </h3>
            <p className="text-gray-600">Cash Flow</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrency(portfolioMetrics!.totalMonthlyCashFlow * 12)} annually
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Percent className="h-8 w-8 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Average</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPercentage(portfolioMetrics!.avgCapRate)}
            </h3>
            <p className="text-gray-600">Cap Rate</p>
            <p className="text-sm text-gray-500 mt-1">
              {portfolioMetrics!.avgCapRate >= 8 ? 'Excellent' :
               portfolioMetrics!.avgCapRate >= 5 ? 'Good' : 'Needs improvement'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Calculator className="h-8 w-8 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">ROI</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPercentage(portfolioMetrics!.cashOnCashReturn)}
            </h3>
            <p className="text-gray-600">Cash-on-Cash Return</p>
            <p className="text-sm text-gray-500 mt-1">
              Based on purchase prices
            </p>
          </div>
        </div>

        {/* Analysis Content */}
        {analysisType === 'overview' && chartData && (
          <div className="space-y-8">
            {/* Portfolio Value Trend Chart - FIXED */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Value & Cash Flow Trend</h3>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b591d] focus:border-[#0b591d]"
                >
                  <option value="1yr">1 Year</option>
                  <option value="3yr">3 Years</option>
                  <option value="5yr">5 Years</option>
                  <option value="10yr">10 Years</option>
                  <option value="20yr">20 Years</option>
                  <option value="30yr">30 Years</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                {chartData.portfolioValueTrendData && chartData.portfolioValueTrendData.length > 0 ? (
                  <AreaChart data={chartData.portfolioValueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      angle={timeframe === '1yr' ? 0 : -45}
                      textAnchor={timeframe === '1yr' ? 'middle' : 'end'}
                      height={timeframe === '1yr' ? 60 : 100}
                      fontSize={12}
                      interval={timeframe === '30yr' ? 1 : 0}
                    />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="portfolioValue"
                      stackId="1"
                      stroke="#0b591d"
                      fill="#10b981"
                      name="Portfolio Value"
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeCashFlow"
                      stackId="2"
                      stroke="#0f7024"
                      fill="#34d399"
                      name="Cumulative Cash Flow"
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No data available for selected timeframe</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>

            {/* Net Worth Trend (Separate LineChart) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Net Worth Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                {chartData.portfolioValueTrendData && chartData.portfolioValueTrendData.length > 0 ? (
                  <LineChart data={chartData.portfolioValueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      angle={timeframe === '1yr' ? 0 : -45}
                      textAnchor={timeframe === '1yr' ? 'middle' : 'end'}
                      height={timeframe === '1yr' ? 60 : 100}
                      fontSize={12}
                      interval={timeframe === '30yr' ? 1 : 0}
                    />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Total Net Worth']}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#065f46"
                      strokeWidth={3}
                      name="Total Net Worth"
                      dot={{ fill: '#065f46', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No data available for selected timeframe</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>

            {/* Property Performance Pie Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance by Type</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPieChart>
                  <Pie
                    data={chartData.propertyPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.propertyPerformanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.propertyTypeColor}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">{data.fullName}</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Property Type:</span>
                                <span className="font-medium capitalize">{data.propertyType.replace('_', ' ')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Value:</span>
                                <span className="font-medium">{formatCurrency(data.value)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cap Rate:</span>
                                <span className={`font-medium ${data.capRate >= 8 ? 'text-green-600' : data.capRate >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {data.capRate.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Cash Flow:</span>
                                <span className={`font-medium ${data.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(data.cashFlow)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rent/Value Ratio:</span>
                                <span className="font-medium">{data.rentToValueRatio}%</span>
                              </div>
                              <div className="flex justify-between border-t pt-1">
                                <span className="text-gray-600">Portfolio Share:</span>
                                <span className="font-medium">{data.percentage}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Property Type Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Type Distribution</h3>
              <div className="space-y-3">
                {Object.entries(portfolioMetrics!.typeDistribution).map(([type, value]) => {
                  const percentage = (value / portfolioMetrics!.totalValue) * 100;
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(value)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analysis - REMOVED */}

        {/* Insights & Recommendations */}
        {insights.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'positive' ? 'bg-green-50 border-green-400' :
                      insight.type === 'negative' ? 'bg-red-50 border-red-400' :
                      'bg-yellow-50 border-yellow-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-5 w-5 mt-0.5 ${
                        insight.type === 'positive' ? 'text-green-600' :
                        insight.type === 'negative' ? 'text-red-600' :
                        'text-yellow-600'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Individual Property Performance Table */}
        {analysisType === 'comparison' && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Property Performance Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Flow</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cap Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => {
                    const performance =
                      (property.cap_rate || 0) >= 8 ? 'excellent' :
                      (property.cap_rate || 0) >= 5 ? 'good' : 'poor';

                    return (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                            <div className="text-sm text-gray-500">{property.property_type}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(property.current_value)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-medium ${
                            (property.monthly_cash_flow || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(property.monthly_cash_flow || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {property.cap_rate ? formatPercentage(property.cap_rate) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {property.roi ? formatPercentage(property.roi) : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            performance === 'excellent' ? 'bg-green-100 text-green-800' :
                            performance === 'good' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {performance.charAt(0).toUpperCase() + performance.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioAnalysisPage;