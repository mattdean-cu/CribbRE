import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Cribb Real Estate Management LLC. All rights reserved.
          </p>
          <div className="flex space-x-6">

              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>

              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>

              href="mailto:help.cribbre@gmail.com"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}