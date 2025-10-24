// src/store/propertyStore.ts
import { create } from 'zustand';
import { useAuthStore } from './authStore';

export interface Property {
  id: number;
  name: string;
  address: string;
  property_type: 'residential' | 'commercial' | 'mixed_use' | 'land' | 'industrial';
  purchase_date?: string;
  purchase_price: number;
  current_value: number;
  square_footage?: number;
  bedrooms?: number;
  bathrooms?: number;
  is_primary_residence: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyFinancials {
  property_id: number;
  monthly_rent?: number;
  monthly_expenses?: number;
  property_taxes?: number;
  insurance?: number;
  hoa_fees?: number;
  maintenance_costs?: number;
  mortgage_payment?: number;
  vacancy_rate?: number;
  cap_rate?: number;
  cash_flow?: number;
  cash_on_cash_return?: number | null;
}

export interface PropertyWithFinancials extends Property {
  portfolio_id?: number;
  financials?: PropertyFinancials;
  monthly_cash_flow?: number;
  cap_rate?: number;
  roi?: number | null;
}

export interface PropertyCreate {
  name: string;
  address: string;
  property_type: 'residential' | 'commercial' | 'mixed_use' | 'land' | 'industrial';
  purchase_date?: string;
  purchase_price: number;
  current_value: number;
  square_footage?: number;
  bedrooms?: number;
  bathrooms?: number;
  is_primary_residence: boolean;
  portfolio_id?: number | null;
  // Financial data
  monthly_rent?: number;
  monthly_expenses?: number;
  property_taxes?: number;
  insurance?: number;
  hoa_fees?: number;
  maintenance_costs?: number;
  mortgage_payment?: number;  // Added
  vacancy_rate?: number;
}

interface PropertyState {
  properties: PropertyWithFinancials[];
  selectedProperty: PropertyWithFinancials | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProperties: () => Promise<void>;
  createProperty: (data: PropertyCreate) => Promise<PropertyWithFinancials>;
  updateProperty: (id: number, data: Partial<PropertyCreate>) => Promise<PropertyWithFinancials>;
  deleteProperty: (id: number) => Promise<void>;
  getProperty: (id: number) => Promise<PropertyWithFinancials>;
  getPropertyMetrics: (id: number) => Promise<any>;
  setSelectedProperty: (property: PropertyWithFinancials | null) => void;
  clearError: () => void;
}

const API_BASE_URL = (window as any).ENV?.API_URL || 'http://localhost:8080/api/v1';


export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,

  fetchProperties: async () => {
    set({ isLoading: true, error: null });

    try {
      const { token } = useAuthStore.getState();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/properties/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch properties');
      }

      const properties: PropertyWithFinancials[] = await response.json();

      // Map financial data to top level for easier access
      const mappedProperties = properties.map(property => ({
        ...property,
        monthly_cash_flow: property.financials?.cash_flow,
        cap_rate: property.financials?.cap_rate,
        roi: property.financials?.cash_on_cash_return,
      }));

      set({ properties: mappedProperties, isLoading: false });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
        isLoading: false
      });
      throw error;
    }
  },

  createProperty: async (data: PropertyCreate) => {
    set({ isLoading: true, error: null });

    try {
      const { token } = useAuthStore.getState();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/properties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend error response:', errorData);
        const errorMessage = errorData.detail || 'Failed to create property';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }

      const newProperty: PropertyWithFinancials = await response.json();

      set(state => ({
        properties: [...state.properties, {
          ...newProperty,
          monthly_cash_flow: newProperty.financials?.cash_flow,
          cap_rate: newProperty.financials?.cap_rate,
          roi: newProperty.financials?.cash_on_cash_return,
        }],
        isLoading: false
      }));

      return newProperty;

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create property',
        isLoading: false
      });
      throw error;
    }
  },

  updateProperty: async (id: number, data: Partial<PropertyCreate>) => {
    set({ isLoading: true, error: null });

    try {
      const { token } = useAuthStore.getState();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update property');
      }

      const updatedProperty: PropertyWithFinancials = await response.json();
      const mappedProperty = {
        ...updatedProperty,
        monthly_cash_flow: updatedProperty.financials?.cash_flow,
        cap_rate: updatedProperty.financials?.cap_rate,
        roi: updatedProperty.financials?.cash_on_cash_return,
      };

      set(state => ({
        properties: state.properties.map(p => p.id === id ? mappedProperty : p),
        selectedProperty: state.selectedProperty?.id === id ? mappedProperty : state.selectedProperty,
        isLoading: false
      }));

      return mappedProperty;

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update property',
        isLoading: false
      });
      throw error;
    }
  },

  deleteProperty: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const { token } = useAuthStore.getState();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete property');
      }

      set(state => ({
        properties: state.properties.filter(p => p.id !== id),
        selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
        isLoading: false
      }));

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete property',
        isLoading: false
      });
      throw error;
    }
  },

  getProperty: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const { token } = useAuthStore.getState();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch property');
      }

      const property: PropertyWithFinancials = await response.json();
      const mappedProperty = {
        ...property,
        monthly_cash_flow: property.financials?.cash_flow,
        cap_rate: property.financials?.cap_rate,
        roi: property.financials?.cash_on_cash_return,
      };

      set({ selectedProperty: mappedProperty, isLoading: false });

      return mappedProperty;

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch property',
        isLoading: false
      });
      throw error;
    }
  },

  getPropertyMetrics: async (id: number) => {
    try {
      const { token } = useAuthStore.getState();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/properties/${id}/metrics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch property metrics');
      }

      return await response.json();

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch property metrics'
      });
      throw error;
    }
  },

  setSelectedProperty: (property: PropertyWithFinancials | null) => {
    set({ selectedProperty: property });
  },

  clearError: () => {
    set({ error: null });
  },
}));