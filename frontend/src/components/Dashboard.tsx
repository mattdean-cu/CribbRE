// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePropertyStore } from '../store/propertyStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { PropertyList } from './properties/PropertyList';
import { PropertyForm } from './properties/PropertyForm';
import { PortfolioSidebar } from './portfolios/PortfolioSidebar';
import { Modal } from './ui/Modal';
import { useNavigate } from 'react-router-dom';
import { AddExistingPropertyModal } from './portfolios/AddExistingPropertyModal';
import { getTierLimits, canAddProperty } from '../utils/subscriptionLimits';
import { UpgradeModal } from './UpgradeModal';
import { Footer } from './Footer';

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    properties,
    fetchProperties,
    deleteProperty,
    updateProperty,
    isLoading,
    error,
    setSelectedProperty
  } = usePropertyStore();

  const { portfolios, movePropertyToPortfolio, fetchPortfolios } = usePortfolioStore();
  const userLimits = getTierLimits(user?.subscription_tier);
  const [showPropertyList, setShowPropertyList] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'properties' | 'analysis' | 'folders'>('properties');

  // Fetch properties when dashboard loads
  useEffect(() => {
    console.log('Dashboard useEffect running, calling fetchProperties');
    fetchProperties().catch(console.error);
  }, [fetchProperties]);

  const filteredProperties = React.useMemo(() => {
      if (selectedPortfolioId === null) {
          return properties; // Show all properties
      }
      return properties.filter(p => p.portfolio_id === selectedPortfolioId);
  }, [properties, selectedPortfolioId]);

  // Calculate portfolio metrics for current view
  const portfolioMetrics = React.useMemo(() => {
    const totalValue = filteredProperties.reduce((sum: number, p: any) => sum + (p.current_value || 0), 0);
    const totalCashFlow = filteredProperties.reduce((sum: number, p: any) => sum + (p.monthly_cash_flow || 0), 0);
    const avgCapRate = filteredProperties.length > 0
      ? filteredProperties.reduce((sum: number, p: any) => sum + (p.cap_rate || 0), 0) / filteredProperties.length
      : 0;

    return {
      totalProperties: filteredProperties.length,
      totalValue,
      totalCashFlow,
      avgCapRate
    };
  }, [filteredProperties]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

const handleAddProperty = () => {
      // Check if user can add more properties
      if (!canAddProperty(properties.length, user?.subscription_tier)) {
        setUpgradeReason('properties');
        setShowUpgradeModal(true);
        return;
      }

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
    await fetchPortfolios();
  };

  const handlePropertyFormCancel = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const handleRunAnalysis = () => {
    navigate('/portfolio/analysis');
  };

  const handleSelectPortfolio = (portfolioId: number | null) => {
    setSelectedPortfolioId(portfolioId);
  };

  const handleMoveProperty = async (propertyId: number, targetPortfolioId: number) => {
    try {
      await movePropertyToPortfolio(propertyId, targetPortfolioId);
      await fetchProperties(); // Refresh properties to show updated folder assignments
    } catch (error) {
      console.error('Failed to move property:', error);
    }
  };

  // Get current portfolio name for display
  const currentPortfolioName = React.useMemo(() => {
    if (selectedPortfolioId === null) return 'All Properties';
    const portfolio = portfolios.find(p => p.id === selectedPortfolioId);
    return portfolio?.name || 'Unknown Portfolio';
  }, [selectedPortfolioId, portfolios]);

  if (showPropertyList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-80'} flex-shrink-0`}>
          {!sidebarCollapsed && (
            <div className="h-full border-r border-gray-200/50">
              {<PortfolioSidebar
                selectedPortfolioId={selectedPortfolioId}
                onSelectPortfolio={handleSelectPortfolio}
                className="h-full rounded-none border-0"
              /> }
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] shadow-sm border-b border-green-200/50 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  {userLimits.hasFolders && (
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => setShowPropertyList(false)}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-xl font-bold text-white">
                    {currentPortfolioName}
                  </h1>
                  <span className="text-sm text-white/80">
                    ({portfolioMetrics.totalProperties} properties)
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {userLimits.hasAnalysis && (
                      <button
                        onClick={() => navigate('/portfolio/analysis')}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analysis
                      </button>
                    )}
                  {/* Subscription badge */}
                    <div className="hidden md:block">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        user?.subscription_tier === 'pro'
                          ? 'bg-yellow-400 text-yellow-900'
                          : user?.subscription_tier === 'plus'
                          ? 'bg-white text-gray-800 border-2 border-gray-300'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {user?.subscription_tier || 'BASIC'}
                      </span>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="px-3 py-1 text-xs font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                      >
                        Manage Plan
                      </button>
                    </div>

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
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <PropertyList
              properties={filteredProperties}
              onAddProperty={handleAddProperty}
              onEditProperty={handleEditProperty}
              onDeleteProperty={handleDeleteProperty}
            />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex">
      {/* Sidebar */}
      {userLimits.hasFolders && (
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-80'} flex-shrink-0`}>
          {!sidebarCollapsed && (
            <div className="h-full border-r border-gray-200/50">
              <PortfolioSidebar
                selectedPortfolioId={selectedPortfolioId}
                onSelectPortfolio={handleSelectPortfolio}
                className="h-full rounded-none border-0"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Modern Header */}
        <header className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] shadow-lg border-b border-green-200/50 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                  {userLimits.hasFolders && (
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </button>
                  )}
                  <h1 className="text-xl font-bold text-white">
                  {currentPortfolioName}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                  {userLimits.hasAnalysis && (
                      <button
                        onClick={() => navigate('/portfolio/analysis')}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analysis
                      </button>
                    )}
                  {/* Subscription badge */}
                    <div className="hidden md:block">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        user?.subscription_tier === 'pro'
                          ? 'bg-yellow-400 text-yellow-900'
                          : user?.subscription_tier === 'plus'
                          ? 'bg-white text-gray-800 border-2 border-gray-300'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {user?.subscription_tier || 'BASIC'}
                      </span>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="px-3 py-1 text-xs font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                      >
                        Manage Plan
                      </button>
                    </div>
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

        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6 max-w-7xl mx-auto">
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
                <p className="text-gray-600 text-sm">Properties in {currentPortfolioName}</p>
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

            {/* Rest of your existing dashboard content... */}
            {/* The properties grid, insights cards, etc. can stay the same */}
            {/* But now they'll be filtered by the selected portfolio */}

            {filteredProperties.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50">
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-[#0b591d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedPortfolioId === null ? 'Start Building Your Empire' : `No Properties in ${currentPortfolioName}`}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {selectedPortfolioId === null
                      ? 'Your real estate journey begins here. Add your first property and watch your portfolio come to life with powerful analytics and insights.'
                      : `This folder is empty. Add properties to ${currentPortfolioName} or select a different folder.`
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={handleAddProperty}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Property
                    </button>
                    {selectedPortfolioId !== null && (
                      <button
                        onClick={() => setSelectedPortfolioId(null)}
                        className="inline-flex items-center px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                      >
                        View All Properties
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Properties Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Properties in {currentPortfolioName}
                  </h3>
                  <div className="flex items-center space-x-3">
                    {selectedPortfolioId !== null ? (
                      <>
                        <button
                          onClick={() => setSelectedPortfolioId(null)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                        >
                          View All Properties
                        </button>
                        <button
                          onClick={handleAddProperty}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-medium rounded-lg hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Property
                        </button>
                        <button
                          onClick={() => setShowAddExistingModal(true)}
                          className="inline-flex items-center px-4 py-2 border-2 border-[#0b591d] text-[#0b591d] font-medium rounded-lg hover:bg-green-50 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Add Existing Property
                        </button>
                        <button
                          onClick={() => navigate('/portfolio/analysis', { state: { portfolioId: selectedPortfolioId } })}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Folder Analysis
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAddProperty}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-medium rounded-lg hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Property
                      </button>
                    )}
                  </div>
                </div>

                {/* Property Cards Grid - Show first 4 properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.slice(0, 4).map((property: any) => (
                    <div
                      key={property.id}
                      className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden relative"
                    >
                      {/* Existing property card content... */}
                      {/* This is the same as your original property cards */}
                      <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-16 h-16 text-[#0b591d] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                            </svg>
                            <p className="text-[#0b591d] text-sm font-medium">Add Photo</p>
                          </div>
                        </div>

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
                          {selectedPortfolioId !== null && (
                            <button
                              onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Remove "${property.name}" from ${currentPortfolioName}?`)) {
                                    await updateProperty(property.id, { portfolio_id: null });
                                    await fetchProperties();
                                    await fetchPortfolios();
                                  }
                                }}
                              className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                              title="Remove from Folder"
                            >
                              <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
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

                {filteredProperties.length > 4 && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setShowPropertyList(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                    >
                      View All {filteredProperties.length} Properties
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Footer outside the flex container */}
        <Footer />
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

      {/* Add Existing Property Modal */}
      <AddExistingPropertyModal
        isOpen={showAddExistingModal}
        onClose={() => setShowAddExistingModal(false)}
        portfolioId={selectedPortfolioId || 0}
        portfolioName={currentPortfolioName}
        allProperties={properties}
        onAddProperty={async (propertyId) => {
            if (selectedPortfolioId) {
                await handleMoveProperty(propertyId, selectedPortfolioId);
            }
          }}
        />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={user?.subscription_tier || 'free'}
        reason={upgradeReason}
      />
  </div>
  );
}