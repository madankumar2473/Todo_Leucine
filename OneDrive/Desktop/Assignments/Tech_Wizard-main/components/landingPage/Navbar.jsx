import React, { useState, useEffect } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="navbar_hero"
      className="bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Sticky Navbar */}
      <nav
        className={`fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
        onBlur={handleCloseMenu}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 animate-fade-in">
              <a href="/" className="flex items-center">
                <img
                  className="h-10 w-auto transition-opacity duration-300 opacity-100 hover:opacity-90"
                  src="../img/briskk_complete_blue_logo.png"
                  alt="Briskk Logo"
                  loading="lazy"
                />
              </a>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-8 animate-fade-in">
              <a href="#briskk_offerings" className="text-gray-600 hover:text-gray-900 transition-all">
                Features
              </a>
              <a href="#business_impact" className="text-gray-600 hover:text-gray-900 transition-all">
                Benefits
              </a>
              <a href="#onboarding_timeline" className="text-gray-600 hover:text-gray-900 transition-all">
                Onboarding
              </a>
              <a href="#blogs" className="text-gray-600 hover:text-gray-900 transition-all">
                Blog
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-all">
                FAQ
              </a>
              <a
                href="/storeOS/login"
                className="px-6 py-2 bg-[#a563ff] text-white rounded-lg hover:bg-[#8a47ff] hover:shadow-lg transition-all"
              >
                Login
              </a>
              <a
                href="#newsletter_subscribe"
                className="px-6 py-2 bg-gradient-to-r from-[#a563ff] to-[#7c3aff] text-white rounded-lg hover:shadow-lg hover:translate-y-[-2px] transition-all"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={handleToggleMenu}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all"
                aria-label="Toggle menu"
              >
                {!isOpen ? (
                  <i className="fas fa-bars"></i>
                ) : (
                  <i className="fas fa-times"></i>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white shadow-xl rounded-b-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#briskk_offerings"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                Features
              </a>
              <a
                href="#business_impact"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                Benefits
              </a>
              <a
                href="#onboarding_timeline"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                Onboarding
              </a>
              <a
                href="#blogs"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                Blog
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                FAQ
              </a>
              <div className="px-3 py-2 space-y-2">
                <a
                  href="/storeOS/login"
                  className="block w-full px-6 py-2 bg-[#a563ff] text-white rounded-lg hover:bg-[#8a47ff] transition-all shadow-sm hover:shadow-md text-center"
                >
                  Login
                </a>
                <a
                  href="#newsletter_subscribe"
                  className="block w-full px-6 py-2 bg-gradient-to-r from-[#a563ff] to-[#7c3aff] text-white rounded-lg hover:shadow-lg transition-all text-center"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-[#a563ff] to-purple-500 text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
          aria-label="Scroll to Top"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </section>
  );
};

export default NavBar;
