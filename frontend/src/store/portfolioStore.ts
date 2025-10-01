// frontend/src/store/portfolioStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuthStore } from './authStore';

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';


// Types
interface PortfolioMetrics {
  property_count: number;
  total_value: number;
  total_monthly_cash_flow: number;
  total_annual_cash_flow: number;
  average_cap_rate: number;
  average_monthly_rent: number;
  average_monthly_expenses: number;
  total_equity: number;
  residential_count: number;
  commercial_count: number;
  mixed_use_count: number;
  other_count: number;
  top_cities: Array<{
    city: string;
    property_count: number;
    total_value: number;
    percentage: number;
  }>;
  positive_cash_flow_count: number;
  negative_cash_flow_count: number;
  break_even_count: number;
}

interface Portfolio {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  is_default: boolean;
  user_id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  metrics: PortfolioMetrics;
  folder_path: string;
}

interface PortfolioCreate {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number;
}

interface PortfolioUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number;
}

// Store interface
interface PortfolioStore {
  // State
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPortfolios: () => Promise<void>;
  createPortfolio: (data: PortfolioCreate) => Promise<Portfolio>;
  updatePortfolio: (id: number, data: PortfolioUpdate) => Promise<Portfolio>;
  deletePortfolio: (id: number, movePropertiesTo?: number) => Promise<void>;
  movePropertyToPortfolio: (propertyId: number, portfolioId: number) => Promise<void>;
  getPortfolioById: (id: number) => Promise<Portfolio>;
  initializeDefaultPortfolio: () => Promise<Portfolio>;

  // Utility actions
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
  clearError: () => void;
  setError: (error: string) => void;
}

// Create the store
export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      portfolios: [],
      selectedPortfolio: null,
      isLoading: false,
      error: null,

      // Actions
      fetchPortfolios: async () => {
        set({ isLoading: true, error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch(`${API_BASE_URL}/portfolios?include_default=true`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch portfolios');
          }

          const portfolios = await response.json();

          set({
            portfolios,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Failed to fetch portfolios:', error);
          set({
            error: error?.message || 'Failed to fetch portfolios',
            isLoading: false
          });
        }
      },

      createPortfolio: async (data: PortfolioCreate) => {
        set({ isLoading: true, error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch(`${API_BASE_URL}/portfolios`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create portfolio');
          }

          const newPortfolio = await response.json();

          // Refresh portfolios to get updated metrics
          await get().fetchPortfolios();

          set({ isLoading: false });
          return newPortfolio;
        } catch (error: any) {
          console.error('Failed to create portfolio:', error);
          const errorMessage = error?.message || 'Failed to create portfolio';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      updatePortfolio: async (id: number, data: PortfolioUpdate) => {
        set({ isLoading: true, error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
          const errorData = await response.json();
          console.log('===== BACKEND ERROR =====');
          console.log(JSON.stringify(errorData, null, 2));
          console.log('========================');
          const errorMessage = typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail || errorData);
          throw new Error(errorMessage);
}

          const updatedPortfolio = await response.json();

          // Update the portfolio in the list
          set(state => ({
            portfolios: state.portfolios.map(p =>
              p.id === id ? { ...p, ...updatedPortfolio } : p
            ),
            selectedPortfolio: state.selectedPortfolio?.id === id
              ? { ...state.selectedPortfolio, ...updatedPortfolio }
              : state.selectedPortfolio,
            isLoading: false
          }));

          return updatedPortfolio;
        } catch (error: any) {
          console.error('Failed to update portfolio:', error);
          const errorMessage = error?.message || 'Failed to update portfolio';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      deletePortfolio: async (id: number, movePropertiesTo?: number) => {
        set({ isLoading: true, error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const params = movePropertiesTo ? `?move_properties_to=${movePropertiesTo}` : '';
          const response = await fetch(`${API_BASE_URL}/portfolios/${id}${params}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to delete portfolio');
          }

          // Remove portfolio from the list
          set(state => ({
            portfolios: state.portfolios.filter(p => p.id !== id),
            selectedPortfolio: state.selectedPortfolio?.id === id
              ? null
              : state.selectedPortfolio,
            isLoading: false
          }));

          // Refresh portfolios to update property counts
          await get().fetchPortfolios();
        } catch (error: any) {
          console.error('Failed to delete portfolio:', error);
          const errorMessage = error?.message || 'Failed to delete portfolio';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      movePropertyToPortfolio: async (propertyId: number, portfolioId: number) => {
        set({ error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/properties/${propertyId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to move property');
          }

          // Refresh portfolios to update property counts and metrics
          await get().fetchPortfolios();
        } catch (error: any) {
          console.error('Failed to move property:', error);
          const errorMessage = error?.message || 'Failed to move property';
          set({ error: errorMessage });
          throw error;
        }
      },

      getPortfolioById: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch portfolio');
          }

          const portfolio = await response.json();

          set({
            selectedPortfolio: portfolio,
            isLoading: false
          });

          return portfolio;
        } catch (error: any) {
          console.error('Failed to fetch portfolio:', error);
          const errorMessage = error?.message || 'Failed to fetch portfolio';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      initializeDefaultPortfolio: async () => {
        set({ isLoading: true, error: null });

        try {
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error('No authentication token');
          }

          const response = await fetch(`${API_BASE_URL}/portfolios/initialize`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to initialize default portfolio');
          }

          const result = await response.json();
          const defaultPortfolio = result.portfolio;

          // Refresh portfolios to get the new default portfolio
          await get().fetchPortfolios();

          set({ isLoading: false });
          return defaultPortfolio;
        } catch (error: any) {
          console.error('Failed to initialize default portfolio:', error);
          const errorMessage = error?.message || 'Failed to initialize default portfolio';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      // Utility actions
      setSelectedPortfolio: (portfolio: Portfolio | null) => {
        set({ selectedPortfolio: portfolio });
      },

      clearError: () => {
        set({ error: null });
      },

      setError: (error: string) => {
        set({ error });
      }
    }),
    {
      name: 'portfolio-store',
      // Enable devtools only in development
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Helper hooks for common use cases
export const usePortfolios = () => {
  const store = usePortfolioStore();
  return {
    portfolios: store.portfolios,
    isLoading: store.isLoading,
    error: store.error,
    fetchPortfolios: store.fetchPortfolios,
    clearError: store.clearError
  };
};

export const useSelectedPortfolio = () => {
  const store = usePortfolioStore();
  return {
    selectedPortfolio: store.selectedPortfolio,
    setSelectedPortfolio: store.setSelectedPortfolio,
    getPortfolioById: store.getPortfolioById
  };
};

export const usePortfolioActions = () => {
  const store = usePortfolioStore();
  return {
    createPortfolio: store.createPortfolio,
    updatePortfolio: store.updatePortfolio,
    deletePortfolio: store.deletePortfolio,
    movePropertyToPortfolio: store.movePropertyToPortfolio,
    initializeDefaultPortfolio: store.initializeDefaultPortfolio
  };
};