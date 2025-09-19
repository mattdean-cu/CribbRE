// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePropertyStore } from '../store/propertyStore';
import { PropertyList } from './properties/PropertyList';
import { PropertyForm } from './properties/PropertyForm';
import { Modal } from './ui/Modal';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    properties,
    fetchProperties,
    deleteProperty,
    isLoading,
    error,
    setSelectedProperty
  } = usePropertyStore();

  const [showPropertyList, setShowPropertyList] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  // Fetch properties when dashboard loads
  useEffect(() => {
    fetchProperties().catch(console.error);
  }, [fetchProperties]);

  // Calculate portfolio metrics
  const portfolioMetrics = React.useMemo(() => {
    const totalValue = properties.reduce((sum: number, p: any) => sum + (p.current_value || 0), 0);
    const totalCashFlow = properties.reduce((sum: number, p: any) => sum + (p.monthly_cash_flow || 0), 0);
    const avgCapRate = properties.length > 0
      ? properties.reduce((sum: number, p: any) => sum + (p.cap_rate || 0), 0) / properties.length
      : 0;

    return {
      totalProperties: properties.length,
      totalValue,
      totalCashFlow,
      avgCapRate
    };
  }, [properties]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddProperty = () => {
    console.log('Add Property button clicked!');
    setEditingProperty(null);
    setShowPropertyForm(true);
  };

  const handleEditProperty = (property: any) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (property: any) => {
    try {
      await deleteProperty(property.id);
      // Properties will be automatically updated by the store
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handlePropertyFormSuccess = async (property: any) => {
    setShowPropertyForm(false);
    setEditingProperty(null);
    // Refresh properties list
    await fetchProperties();
  };

  const handlePropertyFormCancel = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const handleRunAnalysis = () => {
    navigate('/portfolio/analysis');
  };

  if (showPropertyList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] shadow-sm border-b border-green-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPropertyList(false)}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-white">
                  Properties
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
                  </p>
                  <p className="text-xs text-green-100">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-green-100 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Property List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <PropertyList
            properties={properties}
            onAddProperty={handleAddProperty}
            onEditProperty={handleEditProperty}
            onDeleteProperty={handleDeleteProperty}
          />
        </div>

        {/* Property Form Modal - Also available on Property List page */}
        <Modal
          isOpen={showPropertyForm}
          onClose={() => setShowPropertyForm(false)}
          maxWidth="4xl"
        >
          <PropertyForm
            property={editingProperty}
            onSuccess={handlePropertyFormSuccess}
            onCancel={handlePropertyFormCancel}
            isModal={true}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Modern Header */}
      <header className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] shadow-lg border-b border-green-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">
                Portfolio
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">
                  {user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
                </p>
                <p className="text-xs text-green-100">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white hover:text-green-100 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your Real Estate Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to grow your real estate empire? Let's dive into your portfolio performance.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center">
              <svg className="animate-spin h-6 w-6 text-[#0b591d] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading portfolio...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 hover:border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b591d] to-[#0f7024] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M7 7h10M7 10h10M7 13h10" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#0b591d] bg-green-50 px-2 py-1 rounded-full">+0%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{portfolioMetrics.totalProperties}</h3>
            <p className="text-gray-600 text-sm">Total Properties</p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 hover:border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+0%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(portfolioMetrics.totalValue)}</h3>
            <p className="text-gray-600 text-sm">Portfolio Value</p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 hover:border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${portfolioMetrics.totalCashFlow >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {portfolioMetrics.totalCashFlow >= 0 ? '+' : ''}{((portfolioMetrics.totalCashFlow / Math.max(portfolioMetrics.totalValue, 1)) * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${portfolioMetrics.totalCashFlow >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(portfolioMetrics.totalCashFlow)}
            </h3>
            <p className="text-gray-600 text-sm">Monthly Cash Flow</p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 hover:border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lime-500 to-lime-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-lime-600 bg-lime-50 px-2 py-1 rounded-full">
                {portfolioMetrics.avgCapRate.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{portfolioMetrics.avgCapRate.toFixed(1)}%</h3>
            <p className="text-gray-600 text-sm">Avg Cap Rate</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties Overview - Left Column */}
          <div className="lg:col-span-2">
            {properties.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50">
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-[#0b591d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Building Your Empire</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Your real estate journey begins here. Add your first property and watch your portfolio come to life with powerful analytics and insights.
                  </p>
                  <button
                    onClick={handleAddProperty}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Your First Property
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Properties Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Your Properties</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleAddProperty}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-medium rounded-lg hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Property
                    </button>
                    <button
                      onClick={() => setShowPropertyList(true)}
                      className="text-[#0b591d] hover:text-[#0a4e1a] font-medium text-sm flex items-center"
                    >
                      View All
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Property Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property: any) => (
                    <div
                      key={property.id}
                      className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden relative"
                    >
                      {/* Property Image */}
                      <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                        {/* Placeholder for future image implementation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-16 h-16 text-[#0b591d] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                            </svg>
                            <p className="text-[#0b591d] text-sm font-medium">Add Photo</p>
                          </div>
                        </div>

                        {/* Property Type Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            property.property_type === 'residential' ? 'bg-green-100 text-green-800' :
                            property.property_type === 'commercial' ? 'bg-emerald-100 text-emerald-800' :
                            property.property_type === 'mixed_use' ? 'bg-lime-100 text-lime-800' :
                            property.property_type === 'land' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {property.property_type === 'mixed_use' ? 'Mixed Use' :
                             property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProperty(property);
                            }}
                            className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                            title="Edit Property"
                          >
                            <svg className="w-4 h-4 text-[#0b591d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to delete "${property.name}"?`)) {
                                handleDeleteProperty(property);
                              }
                            }}
                            className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                            title="Delete Property"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="p-6 cursor-pointer"
                      >
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#0b591d] transition-colors mb-1">
                            {property.name}
                          </h4>
                          <p className="text-sm text-gray-500">{property.address}</p>
                        </div>

                        {/* Financial Metrics */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Current Value</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(property.current_value)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Monthly Cash Flow</p>
                            <p className={`text-lg font-bold ${(property.monthly_cash_flow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(property.monthly_cash_flow || 0)}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {property.cap_rate !== undefined && property.cap_rate > 0 && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {property.cap_rate.toFixed(1)}% Cap Rate
                              </span>
                            )}
                            {property.bedrooms && property.bathrooms && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                                </svg>
                                {property.bedrooms}bd / {property.bathrooms}ba
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              property.is_primary_residence
                                ? 'bg-green-100 text-green-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {property.is_primary_residence ? 'Primary' : 'Investment'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {properties.length > 4 && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setShowPropertyList(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                    >
                      View All {properties.length} Properties
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button
                  onClick={handleAddProperty}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#0b591d] to-[#0f7024] rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Add Property</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={handleRunAnalysis}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Run Analysis</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Import Data</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Portfolio Insights Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Insights</h4>
              {properties.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Best Performer</span>
                    <span className="text-sm font-medium text-[#0b591d]">
                      {properties.reduce((best, current) =>
                        (current.cap_rate || 0) > (best.cap_rate || 0) ? current : best, properties[0]
                      )?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. ROI</span>
                    <span className="text-sm font-medium text-gray-900">
                      {portfolioMetrics.avgCapRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Income</span>
                    <span className={`text-sm font-medium ${portfolioMetrics.totalCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(portfolioMetrics.totalCashFlow)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Add properties to see insights</p>
              )}
            </div>

            {/* Market Updates Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Updates</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Interest Rates</p>
                    <p className="text-xs text-gray-600">30-year fixed rates trending down</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#0b591d] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Market Trends</p>
                    <p className="text-xs text-gray-600">Rental demand increasing in urban areas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Investment Tip</p>
                    <p className="text-xs text-gray-600">Consider diversifying property types</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      <Modal
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        maxWidth="4xl"
      >
        <PropertyForm
          property={editingProperty}
          onSuccess={handlePropertyFormSuccess}
          onCancel={handlePropertyFormCancel}
          isModal={true}
        />
      </Modal>
    </div>
  );
}