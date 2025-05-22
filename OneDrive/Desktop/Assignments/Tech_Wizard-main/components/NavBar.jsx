
import React from 'react';

const NavBar = () => {
  return (
    <header className="bg-white dark:bg-gray-900">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/path-to-logo.png"
            alt="Briskk Logo"
            className="h-10 w-auto"
            loading="lazy"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">
            Features
          </a>
          <a href="#benefits" className="text-gray-600 hover:text-gray-900 font-medium">
            Benefits
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
            How It Works
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
            Pricing
          </a>
          <div className="flex items-center space-x-4">
            <a
              href="/storeOS/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Login
            </a>
            <a
              href="/onboard"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition duration-300 font-semibold"
            >
              Onboard Store
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
