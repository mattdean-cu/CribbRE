// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0b591d] to-[#0f7024] bg-clip-text text-transparent">
                Cribb Real Estate Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0b591d] transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-medium rounded-lg hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200 shadow-sm"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Real Estate
            <span className="block bg-gradient-to-r from-[#0b591d] to-[#0f7024] bg-clip-text text-transparent">
              Portfolio with Confidence
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Track properties, analyze performance, and make data-driven investment decisions.
            Stop using spreadsheets and start growing your real estate empire.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => {
                document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
            >
              View Demo
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Start with 3 free properties
          </p>
        </div>
      </section>

      {/* Placeholder for more sections - we'll add these next */}
      <div id="demo-section" className="py-20">
        {/* Features, demo, etc will go here */}
        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Grow Your Portfolio
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Professional-grade tools designed for real estate investors who want to maximize returns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0b591d] to-[#0f7024] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Portfolio Management</h4>
                <p className="text-gray-600">
                  Organize properties into folders, track performance, and manage your entire portfolio from one dashboard
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Financial Analytics</h4>
                <p className="text-gray-600">
                  Automatic calculation of cap rates, cash flow, ROI, and cash-on-cash returns for every property
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Performance Tracking</h4>
                <p className="text-gray-600">
                  Visualize trends with interactive charts and project your portfolio value years into the future
                </p>
              </div>

              {/* Feature 4 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-lime-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Smart Insights</h4>
                <p className="text-gray-600">
                  Get automated recommendations and insights based on your portfolio's health and performance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Preview Section */}
            <section id="demo-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-green-50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    See Your Portfolio Come to Life
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Real-time metrics, beautiful visualizations, and actionable insights—all in one place
                  </p>
                </div>

                {/* Mock Dashboard Preview */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                  {/* Mock Header */}
                  <div className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold text-lg">Sample Portfolio</h4>
                      <span className="text-white/80 text-sm">3 Properties</span>
                    </div>
                  </div>

                  {/* Mock Stats Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      {/* Stat 1 */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#0b591d] to-[#0f7024] rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">$875,000</p>
                        <p className="text-sm text-gray-600">Total Value</p>
                      </div>

                      {/* Stat 2 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+8%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">$3,450</p>
                        <p className="text-sm text-gray-600">Monthly Cash Flow</p>
                      </div>

                      {/* Stat 3 */}
                      <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-xl p-6 border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">7.2%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">7.2%</p>
                        <p className="text-sm text-gray-600">Avg Cap Rate</p>
                      </div>

                      {/* Stat 4 */}
                      <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-xl p-6 border border-lime-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-lime-600 bg-lime-100 px-2 py-1 rounded-full">ROI</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">14.8%</p>
                        <p className="text-sm text-gray-600">Cash-on-Cash</p>
                      </div>
                    </div>

                    {/* Mock Property Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Property 1 */}
                      <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center relative">
                          <svg className="w-12 h-12 text-[#0b591d] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span className="absolute top-3 left-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Residential
                          </span>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-1">Sunset Apartments</h5>
                          <p className="text-xs text-gray-500 mb-3">123 Main St, Denver, CO</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Value</span>
                              <span className="font-semibold text-gray-900">$325,000</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Cash Flow</span>
                              <span className="font-semibold text-green-600">+$1,250/mo</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Property 2 */}
                      <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center relative">
                          <svg className="w-12 h-12 text-[#0b591d] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                            Commercial
                          </span>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-1">Downtown Plaza</h5>
                          <p className="text-xs text-gray-500 mb-3">456 Market St, Denver, CO</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Value</span>
                              <span className="font-semibold text-gray-900">$450,000</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Cash Flow</span>
                              <span className="font-semibold text-green-600">+$1,800/mo</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Property 3 */}
                      <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-br from-lime-100 to-green-100 flex items-center justify-center relative">
                          <svg className="w-12 h-12 text-[#0b591d] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span className="absolute top-3 left-3 px-2 py-1 bg-lime-100 text-lime-800 text-xs font-semibold rounded-full">
                            Residential
                          </span>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-1">Oak Street Duplex</h5>
                          <p className="text-xs text-gray-500 mb-3">789 Oak St, Boulder, CO</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Value</span>
                              <span className="font-semibold text-gray-900">$275,000</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Cash Flow</span>
                              <span className="font-semibold text-green-600">+$950/mo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA in Demo */}
                    <div className="mt-8 text-center">
                      <p className="text-gray-600 mb-4">This is just a preview. See your own portfolio in action.</p>
                      <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200 shadow-lg"
                      >
                        Start Managing Your Properties
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
      </div>
      {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get Started in Minutes
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple setup, powerful results. Start tracking your real estate portfolio today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connection Line (desktop only) */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0b591d] via-[#0f7024] to-[#0b591d] opacity-20" style={{ top: '6rem' }}></div>

              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#0b591d] to-[#0f7024] rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 w-full">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-6 h-6 text-[#0b591d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Add Your Properties</h4>
                    <p className="text-gray-600">
                      Enter basic details about your properties—address, purchase price, rental income, and expenses. Takes less than 2 minutes per property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100 w-full">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Track Performance</h4>
                    <p className="text-gray-600">
                      Watch as the platform automatically calculates cap rates, cash flow, ROI, and projects future value with beautiful charts and insights.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-lime-500 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl p-8 border border-green-100 w-full">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Make Better Decisions</h4>
                    <p className="text-gray-600">
                      Use data-driven insights to optimize your portfolio, identify opportunities, and maximize returns on your real estate investments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA after steps */}
            <div className="text-center mt-16">
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Your Free Trial Now
              </button>
              <p className="mt-4 text-sm text-gray-500">
                Set up your first property in under 2 minutes
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
            <section id="pricing-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-green-50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Simple, Transparent Pricing
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Choose the plan that fits your portfolio size. Start free and upgrade as you grow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Basic Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="p-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Basic</h4>
                        <p className="text-gray-600 mb-6">Perfect for getting started</p>

                        <div className="mb-6">
                          <span className="text-5xl font-bold text-gray-900">$0</span>
                          <span className="text-gray-600 ml-2">/month</span>
                        </div>

                        <button
                          onClick={() => navigate('/register')}
                          className="w-full px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 mb-6"
                        >
                          Get Started Free
                        </button>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Up to 2 properties</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Basic financial calculations</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Portfolio overview dashboard</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-400">No analysis reports</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-400">No folders/organization</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plus Plan - Most Popular */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-[#0b591d] overflow-hidden relative transform md:scale-105 hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white text-center py-2 text-sm font-semibold">
                        Most Popular
                      </div>

                      <div className="p-8 pt-12">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Plus</h4>
                        <p className="text-gray-600 mb-6">For growing portfolios</p>

                      <div className="mb-6">
                        <span className="text-5xl font-bold text-gray-900">$15</span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>

                      <button
                        onClick={() => navigate('/pricing')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200 mb-6 shadow-md"
                      >
                        Start 14-Day Free Trial
                      </button>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Up to 10 properties</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Advanced financial metrics</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Portfolio folders & organization</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Full portfolio analysis</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Performance tracking & charts</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-400">No data export</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pro Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="p-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Pro</h4>
                        <p className="text-gray-600 mb-6">For serious investors</p>

                      <div className="mb-6">
                        <span className="text-5xl font-bold text-gray-900">$35</span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>

                      <button
                        onClick={() => navigate('/pricing')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#0b591d] to-[#0f7024] text-white font-semibold rounded-xl hover:from-[#0a4e1a] hover:to-[#0d5f20] transition-all duration-200 mb-6"
                      >
                        Start 14-Day Free Trial
                      </button>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 font-semibold">Unlimited properties</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Everything in Plus, and:</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">CSV/Excel data export</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Advanced projections (30+ years)</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Priority support</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">API access (coming soon)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ or Note */}
                <div className="text-center mt-12">
                  <p className="text-gray-600">
                    All plans include a 14-day free trial. Cancel anytime, no questions asked.
                  </p>
                </div>
              </div>
            </section>

        {/* Footer */}
            <footer className="bg-gradient-to-r from-[#0b591d] to-[#0f7024] py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  {/* Brand */}
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Cribb Real Estate Management
                    </h3>
                    <p className="text-green-100 text-sm leading-relaxed">
                      Professional portfolio management tools for real estate investors. Track performance, analyze deals, and grow your wealth.
                    </p>
                  </div>

                  {/* Product */}
                  <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-2">
                      <li>
                          <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-green-100 hover:text-white text-sm transition-colors"
                          >
                            Features
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-green-100 hover:text-white text-sm transition-colors"
                          >
                            Pricing
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-green-100 hover:text-white text-sm transition-colors"
                          >
                            Demo
                          </button>
                        </li>
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2">
                      <li>
                        <button onClick={() => navigate('/login')} className="text-green-100 hover:text-white text-sm transition-colors">
                          About
                        </button>
                      </li>
                      <li>
                        <button onClick={() => navigate('/login')} className="text-green-100 hover:text-white text-sm transition-colors">
                          Contact
                        </button>
                      </li>
                      <li>
                        <button onClick={() => navigate('/login')} className="text-green-100 hover:text-white text-sm transition-colors">
                          Support
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/20">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-green-100 text-sm">
                      © 2025 Cribb Real Estate Management. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <button onClick={() => navigate('/login')} className="text-green-100 hover:text-white text-sm transition-colors">
                        Privacy Policy
                      </button>
                      <button onClick={() => navigate('/login')} className="text-green-100 hover:text-white text-sm transition-colors">
                        Terms of Service
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
    </div>
  );
}