// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { Home } from './pages/Home';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PortfolioAnalysisPage from './pages/PortfolioAnalysisPage';
import { PricingPage } from './pages/PricingPage';
import { useAuthStore } from './store/authStore';
import PrivacyPolicy from './pages/PrivacyPolicy';

//Main App
function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Home Page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />}
        />

        {/* Separate Auth Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="min-h-screen bg-gray-50 py-12">
                <LoginForm
                  onSuccess={() => console.log('Login successful!')}
                  onSwitchToRegister={() => window.location.href = '/register'}
                />
              </div>
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="min-h-screen bg-gray-50 py-12">
                <RegisterForm
                  onSuccess={() => console.log('Registration successful!')}
                  onSwitchToLogin={() => window.location.href = '/login'}
                />
              </div>
            )
          }
        />

        {/* Pricing Page - accessible to both logged in and logged out users */}
        <Route path="/pricing" element={<PricingPage />} />

        {/* Privacy Policy - accessible to everyone */}
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute fallback={<Navigate to="/login" replace />}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties/:id"
          element={
            <ProtectedRoute fallback={<Navigate to="/login" replace />}>
              <PropertyDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/analysis"
          element={
            <ProtectedRoute fallback={<Navigate to="/login" replace />}>
              <PortfolioAnalysisPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;