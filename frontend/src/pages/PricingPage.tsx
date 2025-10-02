// src/pages/PricingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentTier = user?.subscription_tier?.toLowerCase() || 'basic';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0b591d]/5 to-[#0f7024]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-lime-500/5 to-green-500/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/')}
              className="flex items-center text-gray-600 hover:text-[#0b591d] transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {user ? 'Back to Dashboard' : 'Back to Home'}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0b591d] to-[#0f7024] bg-clip-text text-transparent">
              Subscription Plans
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Hero Section with Decorative Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16 relative">
          {/* Floating Icons */}
          <div className="absolute -left-20 top-0 opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
            <svg className="w-16 h-16 text-[#0b591d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="absolute -right-20 top-10 opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <svg className="w-16 h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Scale your real estate portfolio management with the perfect plan for your needs.
          </p>

          {/* Enhanced Current Plan Display */}
          {user && (
            <div className="mt-8 inline-block">
              <div className={`px-8 py-5 rounded-2xl shadow-xl ${
                currentTier === 'pro'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400'
                  : currentTier === 'plus'
                  ? 'bg-gradient-to-r from-[#0b591d] to-[#0f7024]'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700'
              }`}>
                <div className="text-center">
                  <p className={`text-sm font-medium mb-2 ${
                    currentTier === 'pro' ? 'text-yellow-900' : 'text-white/80'
                  }`}>
                    Your Current Plan
                  </p>
                  <p className={`text-4xl font-bold ${
                    currentTier === 'pro' ? 'text-yellow-900' : 'text-white'
                  }`}>
                    {currentTier.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
          {/* Basic Plan */}
          <div className={`bg-white rounded-2xl shadow-lg border-2 ${
            currentTier === 'basic' ? 'border-[#0b591d] ring-4 ring-[#0b591d]/10' : 'border-gray-200'
          } overflow-hidden transform hover:scale-105 transition-all duration-300`}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Basic</h3>
                {currentTier === 'basic' && (
                  <span className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white px-3 py-1 rounded-full text-sm font-bold">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-8">Perfect for getting started</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Up to 2 properties</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Basic property tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Financial metrics</span>
                </li>
                <li className="flex items-start opacity-50">
                  <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-500">No portfolio folders</span>
                </li>
                <li className="flex items-start opacity-50">
                  <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-500">No advanced analytics</span>
                </li>
              </ul>

              <button
                disabled={currentTier === 'basic'}
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  currentTier === 'basic'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-md hover:shadow-lg'
                }`}
              >
                {currentTier === 'basic' ? 'Current Plan' : 'Downgrade'}
              </button>
            </div>
          </div>

          {/* Plus Plan */}
          <div className={`bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl border-2 ${
            currentTier === 'plus' ? 'border-[#0f7024] ring-4 ring-[#0f7024]/20' : 'border-emerald-300'
          } overflow-hidden transform md:scale-105 hover:scale-110 transition-all duration-300 relative`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0b591d]/10 to-[#0f7024]/10 rounded-full -mr-16 -mt-16"></div>
            <div className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white text-center py-2 font-semibold">
              MOST POPULAR
            </div>
            <div className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Plus</h3>
                {currentTier === 'plus' && (
                  <span className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white px-3 py-1 rounded-full text-sm font-bold">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$15</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-700 mb-8">For growing portfolios</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Up to 10 properties</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Portfolio folders</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Performance tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#0b591d] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Email support</span>
                </li>
              </ul>

              <button
                disabled={currentTier === 'plus'}
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  currentTier === 'plus'
                    ? 'bg-emerald-200 text-emerald-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white hover:from-[#0a4e1a] hover:to-[#0d5f20] shadow-lg hover:shadow-xl'
                }`}
              >
                {currentTier === 'plus' ? 'Current Plan' : 'Upgrade to Plus'}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className={`bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-xl border-2 ${
            currentTier === 'pro' ? 'border-yellow-500 ring-4 ring-yellow-500/20' : 'border-yellow-300'
          } overflow-hidden transform hover:scale-105 transition-all duration-300 relative`}>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-400/10 to-amber-400/10 rounded-full -ml-16 -mb-16"></div>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 text-center py-2 font-semibold">
              BEST VALUE
            </div>
            <div className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Pro</h3>
                {currentTier === 'pro' && (
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$35</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-700 mb-8">For serious investors</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Unlimited properties</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Everything in Plus</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Data export (CSV, Excel)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">Priority support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-900 font-medium">API access (coming soon)</span>
                </li>
              </ul>

              <button
                disabled={currentTier === 'pro'}
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  currentTier === 'pro'
                    ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 hover:from-yellow-500 hover:to-amber-500 shadow-lg hover:shadow-xl'
                }`}
              >
                {currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                What happens to my data if I downgrade?
              </h4>
              <p className="text-gray-600">
                Your data is never deleted. If you exceed the property limit after downgrading, existing data remains accessible.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                Do you offer annual billing?
              </h4>
              <p className="text-gray-600">
                Annual billing with 2 months free is coming soon! Contact us to be notified when it's available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}