import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8 w-full">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-center sm:text-left">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Cribb Real Estate Management LLC. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/privacy"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="mailto:help.cribbre@gmail.com"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}