// frontend/src/components/portfolios/PortfolioSidebar.tsx
import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { CreateFolderModal } from './CreateFolderModal';
import { usePropertyStore } from '../../store/propertyStore';

interface PortfolioSidebarProps {
  selectedPortfolioId?: number | null;
  onSelectPortfolio: (portfolioId: number | null) => void;
  className?: string;
}

export function PortfolioSidebar({
  selectedPortfolioId,
  onSelectPortfolio,
  className = ''
}: PortfolioSidebarProps) {
  const {
    portfolios,
    fetchPortfolios,
    deletePortfolio,
    isLoading,
    error
  } = usePortfolioStore();

  const { properties } = usePropertyStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // Fetch portfolios when component mounts
  useEffect(() => {
    fetchPortfolios().catch(console.error);
  }, [fetchPortfolios]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteFolder = async (portfolioId: number) => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) return;

    const confirmMessage = portfolio.metrics.property_count > 0
      ? `Delete "${portfolio.name}"? Its ${portfolio.metrics.property_count} properties will be moved to "All Properties".`
      : `Delete "${portfolio.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        await deletePortfolio(portfolioId);
        if (selectedPortfolioId === portfolioId) {
          onSelectPortfolio(null); // Reset selection
        }
      } catch (error) {
        console.error('Failed to delete portfolio:', error);
      }
    }
  };

  const toggleFolder = (portfolioId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(portfolioId)) {
      newExpanded.delete(portfolioId);
    } else {
      newExpanded.add(portfolioId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFolderIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-5 h-5 ${isSelected ? 'text-white' : 'text-[#0b591d]'}`;

    switch (iconName) {
      case 'home':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'building':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M7 7h10M7 10h10M7 13h10" />
          </svg>
        );
      case 'location':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'star':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
          </svg>
        );
    }
  };

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Folders</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-8 h-8 bg-gradient-to-r from-[#0b591d] to-[#0f7024] rounded-lg flex items-center justify-center hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200 shadow-sm"
            title="Create New Folder"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* All Properties - Special folder */}
        <button
          onClick={() => onSelectPortfolio(null)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
            selectedPortfolioId === null
              ? 'bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white shadow-sm'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center flex-1 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
              selectedPortfolioId === null
                ? 'bg-white/20'
                : 'bg-gray-100'
            }`}>
              <svg className={`w-4 h-4 ${selectedPortfolioId === null ? 'text-white' : 'text-[#0b591d]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className={`text-sm font-medium truncate ${selectedPortfolioId === null ? 'text-white' : 'text-gray-900'}`}>
                All Properties
              </p>
              <p className={`text-xs truncate ${selectedPortfolioId === null ? 'text-white/80' : 'text-gray-500'}`}>
                {properties.length} properties
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-6">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-[#0b591d] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">Loading folders...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Portfolio Folders List */}
      {!isLoading && !error && (
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {portfolios.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-4">No custom folders yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-[#0b591d] hover:text-[#0a4e1a] font-medium text-sm"
              >
                Create your first folder
              </button>
            </div>
          ) : (
            portfolios.map((portfolio) => (
              <div key={portfolio.id} className="group">
                <button
                  onClick={() => onSelectPortfolio(portfolio.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                    selectedPortfolioId === portfolio.id
                      ? 'bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                        selectedPortfolioId === portfolio.id
                          ? 'bg-white/20'
                          : 'bg-gray-100'
                      }`}
                      style={selectedPortfolioId !== portfolio.id ? { backgroundColor: `${portfolio.color}20` } : {}}
                    >
                      {getFolderIcon(portfolio.icon, selectedPortfolioId === portfolio.id)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-sm font-medium truncate ${
                        selectedPortfolioId === portfolio.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {portfolio.name}
                      </p>
                      <div className="flex items-center space-x-3">
                        <p className={`text-xs truncate ${
                          selectedPortfolioId === portfolio.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {portfolio.metrics.property_count} properties
                        </p>
                        {portfolio.metrics.total_value > 0 && (
                          <p className={`text-xs truncate ${
                            selectedPortfolioId === portfolio.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {formatCurrency(portfolio.metrics.total_value)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Menu (visible on hover for non-default folders) */}
                  {!portfolio.is_default && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(portfolio.id);
                        }}
                        className={`w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 ${
                          selectedPortfolioId === portfolio.id ? 'text-white/60 hover:bg-red-500' : 'text-gray-400 hover:text-white'
                        }`}
                        title="Delete Folder"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </button>

                {/* Folder metrics preview (when expanded) */}
                {expandedFolders.has(portfolio.id) && portfolio.metrics.property_count > 0 && (
                  <div className="ml-11 mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Cash Flow:</span>
                        <span className={`ml-1 font-medium ${portfolio.metrics.total_monthly_cash_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(portfolio.metrics.total_monthly_cash_flow)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Cap Rate:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {portfolio.metrics.average_cap_rate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}