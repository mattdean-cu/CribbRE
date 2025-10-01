// frontend/src/components/portfolios/CreateFolderModal.tsx
import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Modal } from '../ui/Modal';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FolderFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

const FOLDER_COLORS = [
  '#10B981', // Emerald (default)
  '#0b591d', // Dark green
  '#059669', // Emerald 600
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6B7280', // Gray
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

const FOLDER_ICONS = [
  { name: 'folder', label: 'Folder' },
  { name: 'home', label: 'Home' },
  { name: 'building', label: 'Building' },
  { name: 'location', label: 'Location' },
  { name: 'star', label: 'Star' },
];

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const { createPortfolio, isLoading } = usePortfolioStore();

  const [formData, setFormData] = useState<FolderFormData>({
    name: '',
    description: '',
    color: '#10B981',
    icon: 'folder'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FolderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Folder name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Folder name must be 50 characters or less';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createPortfolio({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        icon: formData.icon
      });

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        color: '#10B981',
        icon: 'folder'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      setErrors({ submit: 'Failed to create folder. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: '#10B981',
      icon: 'folder'
    });
    setErrors({});
    onClose();
  };

  const getIconSvg = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'home':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'building':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M7 7h10M7 10h10M7 13h10" />
          </svg>
        );
      case 'location':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'star':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m16 0H3" />
          </svg>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Folder</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Folder Name */}
          <div>
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name *
            </label>
            <input
              type="text"
              id="folderName"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#0b591d] focus:border-transparent transition-all ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Rental Properties, Atlanta Market, Commercial..."
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.name.length}/50 characters</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="folderDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="folderDescription"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#0b591d] focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of this portfolio folder..."
              maxLength={200}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/200 characters</p>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {FOLDER_ICONS.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => handleInputChange('icon', icon.name)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.icon === icon.name
                      ? 'border-[#0b591d] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={icon.label}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      {getIconSvg(icon.name, "w-4 h-4")}
                    </div>
                    <span className="text-xs text-gray-600">{icon.label}</span>
                  </div>
                  {formData.icon === icon.name && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0b591d] rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                    formData.color === color
                      ? 'border-gray-400 scale-110'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {formData.color === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {getIconSvg(formData.icon, "w-5 h-5 text-gray-700")}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {formData.name || 'Folder Name'}
                </p>
                <p className="text-sm text-gray-500">
                  {formData.description || 'No description'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="px-6 py-2 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-medium rounded-lg hover:from-[#0a4e1a] hover:to-[#0d5f20] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Folder'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}