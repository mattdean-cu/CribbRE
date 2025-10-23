import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Home } from 'lucide-react';
import PropertyFinancialMetrics from '../components/properties/PropertyFinancialMetrics';
import { usePropertyStore, PropertyWithFinancials } from '../store/propertyStore';
import { Footer } from '../components/Footer';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedProperty,
    isLoading,
    error,
    getProperty,
    deleteProperty,
    clearError
  } = usePropertyStore();

  useEffect(() => {
    if (id) {
      getProperty(parseInt(id));
    }
  }, [id, getProperty]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  const handleEdit = () => {
    navigate(`/properties/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedProperty || !window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await deleteProperty(selectedProperty.id);
      navigate('/properties');
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to delete property:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // Create the property object that PropertyFinancialMetrics expects
  const propertyForMetrics = {
    ...selectedProperty,
    financials: {
      monthly_cash_flow: selectedProperty.monthly_cash_flow || 0,
      annual_cash_flow: (selectedProperty.monthly_cash_flow || 0) * 12,
      cap_rate: selectedProperty.cap_rate || 0,
      cash_on_cash_return: selectedProperty.roi || 0,
      monthly_rent: selectedProperty.financials?.monthly_rent || 0,
      monthly_expenses: selectedProperty.financials?.monthly_expenses || 0,
      noi: ((selectedProperty.financials?.monthly_rent || 0) - (selectedProperty.financials?.monthly_expenses || 0)) * 12,
      property_taxes: selectedProperty.financials?.property_taxes || 0,
      insurance: selectedProperty.financials?.insurance || 0,
      hoa_fees: selectedProperty.financials?.hoa_fees || 0,
      maintenance_costs: selectedProperty.financials?.maintenance_costs || 0,
      vacancy_rate: selectedProperty.financials?.vacancy_rate || 0,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/properties')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Properties
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Property Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProperty.name}</h1>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {selectedProperty.address}
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="h-5 w-5 mr-2" />
                  {selectedProperty.property_type} • {selectedProperty.square_footage || 'N/A'} sq ft
                </div>
                {selectedProperty.purchase_date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    Purchased: {formatDate(selectedProperty.purchase_date)}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm">
                  {selectedProperty.bedrooms && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedProperty.bedrooms} bed
                    </span>
                  )}
                  {selectedProperty.bathrooms && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedProperty.bathrooms} bath
                    </span>
                  )}
                  {selectedProperty.is_primary_residence && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Primary Residence
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Value Summary */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Property Value</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price:</span>
                    <span className="font-semibold">{formatCurrency(selectedProperty.purchase_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-semibold">{formatCurrency(selectedProperty.current_value)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Appreciation:</span>
                    <span className={`font-semibold ${
                      selectedProperty.current_value > selectedProperty.purchase_price
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(selectedProperty.current_value - selectedProperty.purchase_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics Component */}
        <PropertyFinancialMetrics property={propertyForMetrics} />

        {/* Detailed Expenses (if needed in the future) */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Property Taxes</p>
              <p className="font-semibold">{formatCurrency(selectedProperty.financials?.property_taxes || 0)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Insurance</p>
              <p className="font-semibold">{formatCurrency(selectedProperty.financials?.insurance || 0)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">HOA Fees</p>
              <p className="font-semibold">{formatCurrency(selectedProperty.financials?.hoa_fees || 0)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="font-semibold">{formatCurrency(selectedProperty.financials?.maintenance_costs || 0)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Add Footer here */}
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;