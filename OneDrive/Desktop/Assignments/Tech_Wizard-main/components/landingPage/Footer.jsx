import React from 'react';

const Footer = () => {
  return (
    <footer id="trust_footer" className="bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="transform hover:scale-105 transition-all duration-300 bg-neutral-800/30 p-6 rounded-lg">
            <img
              src="../img/briskk_complete_logo_white.png"
              alt="Briskk Logo"
              className="h-10 mb-6 transition-opacity duration-300 hover:opacity-80"
              loading="lazy"
            />
            <p className="text-neutral-400 mb-4">
              Transforming retail businesses with innovative digital solutions
            </p>
            <address className="space-y-2 not-italic">
              <a
                href="mailto:contact@briskk.one"
                className="flex items-center text-neutral-300 hover:text-[#01fd82] transition-all duration-300"
                aria-label="Email contact@briskk.one"
              >
                <i className="fas fa-envelope mr-2 text-[#01fd82]"></i>
                contact@briskk.one
              </a>
              <a
                href="tel:+919019897582"
                className="flex items-center text-neutral-300 hover:text-[#01fd82] transition-all duration-300"
                aria-label="Call +91 9019897582"
              >
                <i className="fas fa-phone mr-2 text-[#01fd82]"></i>
                +91 9019897582
              </a>
            </address>
          </div>

          {/* Quick Links */}
          <div className="transform hover:scale-105 transition-all duration-300 bg-neutral-800/20 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-6 border-b border-[#01fd82]/20 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#briskk_offerings" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#business_impact" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#onboarding_timeline" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  Onboarding
                </a>
              </li>
              <li>
                <a href="#blogs" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#faq" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="transform hover:scale-105 transition-all duration-300 bg-neutral-800/15 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-6 border-b border-[#01fd82]/20 pb-2">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#contact-form" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="../privacy-policy"
                  className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="../terms-condition"
                  className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#faq" className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="transform hover:scale-105 transition-all duration-300 bg-neutral-800/10 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-6 border-b border-[#01fd82]/20 pb-2">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.linkedin.com/company/briskk"
                className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300"
                aria-label="Visit LinkedIn"
              >
                <i className="fab fa-linkedin text-2xl hover:scale-110"></i>
              </a>
              <a
                href="https://x.com/Briskk_shop"
                className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300"
                aria-label="Visit Twitter"
              >
                <i className="fab fa-twitter text-2xl hover:scale-110"></i>
              </a>
              <a
                href="https://www.instagram.com/briskk_shop/"
                className="text-neutral-400 hover:text-[#01fd82] transition-all duration-300"
                aria-label="Visit Instagram"
              >
                <i className="fab fa-instagram text-2xl hover:scale-110"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-800 pt-8 mb-8 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-neutral-800/30 p-3 rounded-lg">
                <i className="fas fa-award text-[#01fd82] text-2xl mr-2"></i>
                <div>
                  <div className="text-white text-sm">Startup India</div>
                  <div className="text-neutral-400 text-xs">Recognized Startup</div>
                </div>
              </div>
              <div className="flex items-center bg-neutral-800/30 p-3 rounded-lg">
                <i className="fas fa-shield-alt text-[#01fd82] text-2xl mr-2"></i>
                <div>
                  <div className="text-white text-sm">Razorpay Rize</div>
                  <div className="text-neutral-400 text-xs">Verified Partner</div>
                </div>
              </div>
            </div>
            <div className="text-neutral-400 text-sm bg-neutral-800/20 p-3 rounded-lg">
              <span>CIN: U62013KA2024PTC185809</span>
              <span className="mx-2 hidden md:inline">|</span>
              <span>DPIIT: DIPP173574</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8 text-center">
          <p className="text-neutral-400 text-sm">
            © 2024 ChannelBlend Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-neutral-400 text-sm mt-2">
            Made with <i className="fas fa-heart text-[#01fd82]"></i> in Bharat
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
