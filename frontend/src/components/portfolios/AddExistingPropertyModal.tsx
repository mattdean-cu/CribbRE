import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { PropertyWithFinancials } from '../../store/propertyStore';

interface AddExistingPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: number;
  portfolioName: string;
  allProperties: PropertyWithFinancials[];
  onAddProperty: (propertyId: number) => Promise<void>;
}

export function AddExistingPropertyModal({
  isOpen,
  onClose,
  portfolioId,
  portfolioName,
  allProperties,
  onAddProperty
}: AddExistingPropertyModalProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter out properties already in this folder
  const availableProperties = allProperties.filter(p => p.portfolio_id !== portfolioId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (!selectedPropertyId) return;

    setIsLoading(true);
    try {
      await onAddProperty(selectedPropertyId);
      setSelectedPropertyId(null);
      onClose();
    } catch (error) {
      console.error('Failed to add property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Property to {portfolioName}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {availableProperties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">All properties are already in this folder or other folders.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Select a property to add to this folder:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
              {availableProperties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPropertyId === property.id
                      ? 'border-[#0b591d] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-500">{property.address}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(property.current_value)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {property.property_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedPropertyId || isLoading}
                className="px-6 py-2 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-medium rounded-lg hover:from-[#0a4e1a] hover:to-[#0d5f20] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Adding...' : 'Add to Folder'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}