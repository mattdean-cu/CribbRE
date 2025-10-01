// src/components/properties/PropertyForm.tsx
import React, { useState, useEffect } from 'react';
import { usePropertyStore, PropertyCreate, PropertyWithFinancials } from '../../store/propertyStore';
import { usePortfolioStore } from '../../store/portfolioStore';

interface PropertyFormProps {
  property?: PropertyWithFinancials;
  onSuccess?: (property: PropertyWithFinancials) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function PropertyForm({ property, onSuccess, onCancel, isModal = false }: PropertyFormProps) {
  const { createProperty, updateProperty, isLoading, error, clearError } = usePropertyStore();
  const { portfolios, fetchPortfolios } = usePortfolioStore();

  const [formData, setFormData] = useState<PropertyCreate>({
    name: '',
    address: '',
    property_type: 'residential',
    purchase_date: '',
    purchase_price: 0,
    current_value: 0,
    square_footage: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    is_primary_residence: false,
    portfolio_id: undefined,
    monthly_rent: undefined,
    monthly_expenses: undefined,
    property_taxes: undefined,
    insurance: undefined,
    hoa_fees: undefined,
    maintenance_costs: undefined,
    vacancy_rate: undefined,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Fetch portfolios when component mounts
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Populate form if editing existing property
  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        address: property.address,
        property_type: property.property_type,
        purchase_date: property.purchase_date || '',
        purchase_price: property.purchase_price,
        current_value: property.current_value,
        square_footage: property.square_footage,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        is_primary_residence: property.is_primary_residence,
        portfolio_id: property.portfolio_id,
        monthly_rent: property.financials?.monthly_rent,
        monthly_expenses: property.financials?.monthly_expenses,
        property_taxes: property.financials?.property_taxes,
        insurance: property.financials?.insurance,
        hoa_fees: property.financials?.hoa_fees,
        maintenance_costs: property.financials?.maintenance_costs,
        vacancy_rate: property.financials?.vacancy_rate ? property.financials.vacancy_rate * 100 : undefined,
      });
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
              : type === 'number' ? (value === '' ? undefined : parseFloat(value))
              : name === 'portfolio_id' ? (value === '' ? null : parseInt(value))
              : value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.address && formData.property_type);
      case 2:
        return !!(formData.purchase_price && formData.current_value);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (currentStep !== totalSteps) {
        return false;
      }

      clearError();

      if (!validateStep(1) || !validateStep(2)) {
        return;
      }

      try {
        const submitData = {
          ...formData,
          vacancy_rate: formData.vacancy_rate ? formData.vacancy_rate / 100 : undefined,
        };

        console.log('Submitting data:', submitData);

        const result = property
          ? await updateProperty(property.id, submitData)
          : await createProperty(submitData);

        console.log('Success! Result:', result);
        onSuccess?.(result);
      } catch (error) {
        console.error('Property operation failed');
        console.error('Error type:', typeof error);
        console.error('Error object:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
      }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerClass = isModal
    ? "bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    : "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8";

  const contentClass = isModal
    ? ""
    : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <p className="text-gray-600">
            {property ? 'Update your property information' : 'Tell us about your real estate investment'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 transition-all ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Basic Info</span>
            <span>Property Details</span>
            <span>Financial Data</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {String(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Downtown Apartment Building"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main Street, City, State 12345"
                  />
                </div>

                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed_use">Mixed Use</option>
                    <option value="land">Land</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="portfolio_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Folder (Optional)
                  </label>
                  <select
                    id="portfolio_id"
                    name="portfolio_id"
                    value={formData.portfolio_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No Folder (All Properties)</option>
                    {portfolios.map((portfolio) => (
                      <option key={portfolio.id} value={portfolio.id}>
                        {portfolio.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Organize your property into a folder for easy management</p>
                </div>

                <div>
                  <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    id="purchase_date"
                    name="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id="is_primary_residence"
                      name="is_primary_residence"
                      type="checkbox"
                      checked={formData.is_primary_residence}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_primary_residence" className="ml-2 block text-sm text-gray-700">
                      This is my primary residence
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price *
                  </label>
                  <input
                    id="purchase_price"
                    name="purchase_price"
                    type="number"
                    value={formData.purchase_price || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="250000"
                  />
                </div>

                <div>
                  <label htmlFor="current_value" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value *
                  </label>
                  <input
                    id="current_value"
                    name="current_value"
                    type="number"
                    value={formData.current_value || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="275000"
                  />
                </div>

                <div>
                  <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-2">
                    Square Footage
                  </label>
                  <input
                    id="square_footage"
                    name="square_footage"
                    type="number"
                    value={formData.square_footage || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1200"
                  />
                </div>

                {formData.property_type === 'residential' && (
                  <>
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        value={formData.bedrooms || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="3"
                      />
                    </div>

                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        value={formData.bathrooms || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Value Preview */}
              {formData.purchase_price > 0 && formData.current_value > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Property Value Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Purchase Price:</span>
                      <p className="font-semibold text-blue-900">{formatCurrency(formData.purchase_price)}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Current Value:</span>
                      <p className="font-semibold text-blue-900">{formatCurrency(formData.current_value)}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-blue-700">Appreciation:</span>
                      <p className={`font-semibold ${formData.current_value >= formData.purchase_price ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(formData.current_value - formData.purchase_price)}
                        ({(((formData.current_value - formData.purchase_price) / formData.purchase_price) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Financial Data */}
          {currentStep === 3 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Information</h3>
              <p className="text-gray-600 mb-6">Add rental income and expenses to calculate returns (optional)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Income</h4>
                </div>

                <div>
                  <label htmlFor="monthly_rent" className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent
                  </label>
                  <input
                    id="monthly_rent"
                    name="monthly_rent"
                    type="number"
                    value={formData.monthly_rent || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label htmlFor="vacancy_rate" className="block text-sm font-medium text-gray-700 mb-2">
                    Vacancy Rate (%)
                  </label>
                  <input
                    id="vacancy_rate"
                    name="vacancy_rate"
                    type="number"
                    value={formData.vacancy_rate || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Expenses</h4>
                </div>

                <div>
                  <label htmlFor="property_taxes" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Taxes (Monthly)
                  </label>
                  <input
                    id="property_taxes"
                    name="property_taxes"
                    type="number"
                    value={formData.property_taxes || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="400"
                  />
                </div>

                <div>
                  <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance (Monthly)
                  </label>
                  <input
                    id="insurance"
                    name="insurance"
                    type="number"
                    value={formData.insurance || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label htmlFor="hoa_fees" className="block text-sm font-medium text-gray-700 mb-2">
                    HOA Fees (Monthly)
                  </label>
                  <input
                    id="hoa_fees"
                    name="hoa_fees"
                    type="number"
                    value={formData.hoa_fees || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="200"
                  />
                </div>

                <div>
                  <label htmlFor="maintenance_costs" className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance (Monthly)
                  </label>
                  <input
                    id="maintenance_costs"
                    name="maintenance_costs"
                    type="number"
                    value={formData.maintenance_costs || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="300"
                  />
                </div>

                <div>
                  <label htmlFor="monthly_expenses" className="block text-sm font-medium text-gray-700 mb-2">
                    Other Monthly Expenses
                  </label>
                  <input
                    id="monthly_expenses"
                    name="monthly_expenses"
                    type="number"
                    value={formData.monthly_expenses || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="200"
                  />
                </div>
              </div>

              {/* Financial Preview */}
              {formData.monthly_rent && formData.monthly_rent > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Financial Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Gross Monthly Rent:</span>
                      <p className="font-semibold text-green-900">{formatCurrency(formData.monthly_rent)}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Est. Monthly Expenses:</span>
                      <p className="font-semibold text-green-900">
                        {formatCurrency((formData.property_taxes || 0) + (formData.insurance || 0) + (formData.hoa_fees || 0) + (formData.maintenance_costs || 0) + (formData.monthly_expenses || 0))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex space-x-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}

              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !validateStep(1) || !validateStep(2)}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {property ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    property ? 'Update Property' : 'Create Property'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}