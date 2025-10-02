// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  subscription_tier: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  getCurrentUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  subscription_tier: string;
}

const API_BASE_URL = 'http://10.0.0.43:8080/api/v1';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Login failed');
            }

            const data: LoginResponse = await response.json();
            console.log('Login response:', data);

            const token = data.access_token;

            set({
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Fire-and-forget - don't await this
            void get().getCurrentUser();

          } catch (error) {
            console.error('Login error:', error);
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false,
              isAuthenticated: false,
              token: null,
              user: null,
            });
            throw error;
          }
        },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
          }

          const user: User = await response.json();

          set({
            user,
            isLoading: false,
            error: null
          });

          // Auto-login after registration
          await get().login(userData.email, userData.password);

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },

      getCurrentUser: async () => {
          const { token } = get();
          console.log('getCurrentUser called, token:', token ? 'exists' : 'missing');

          if (!token) {
            console.log('No token, skipping getCurrentUser');
            return;
          }

          try {
            console.log('Fetching /auth/me...');

            // Add timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('Response status:', response.status);

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Response error:', errorText);
              throw new Error('Failed to get user data');
            }

            const user: User = await response.json();
            console.log('Current user data:', user);

            set({ user });

          } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
              console.error('Request timeout - /auth/me took too long');
            } else {
              console.error('Failed to get current user:', error);
            }
            // Don't logout on getCurrentUser failure, just log it
          }
        },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);