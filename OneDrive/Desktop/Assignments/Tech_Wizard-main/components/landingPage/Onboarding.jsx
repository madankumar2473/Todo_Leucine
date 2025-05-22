import React from 'react';

const Onboarding = () => {
  return (
    <section id="onboarding_timeline" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Easy 4-Step Onboarding
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get your store digitally up and running on Briskk in no time
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#a563ff] to-[#7c3aed] hidden md:block"></div>

          {/* Step 1 */}
          <div className="relative flex md:flex-row flex-col items-center md:items-start mb-16 group hover:-translate-y-1 transition-all duration-300">
            <div className="md:w-1/2 md:pr-16 md:text-right text-center mb-8 md:mb-0">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-xl shadow-sm group-hover:border-[#a563ff] group-hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Signup &amp; Setup</h3>
                <p className="text-gray-600">
                  Create your account and complete the initial setup process with our guided onboarding flow
                </p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#a563ff] to-[#7c3aed] rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 md:static md:translate-x-0 top-[-16px]">
              <i className="fas fa-user-plus text-white"></i>
            </div>
            <div className="md:w-1/2 md:pl-16 text-center md:text-left"></div>
          </div>

          {/* Step 2 */}
          <div className="relative flex md:flex-row flex-col items-center md:items-start mb-16 group hover:-translate-y-1 transition-all duration-300">
            <div className="md:w-1/2 md:pr-16 md:text-right text-center mb-8 md:mb-0"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#a563ff] to-[#7c3aed] rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 md:static md:translate-x-0">
              <i className="fas fa-box text-white"></i>
            </div>
            <div className="md:w-1/2 md:pl-16 text-center md:text-left">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-xl shadow-sm group-hover:border-[#a563ff] group-hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Product Cataloging</h3>
                <p className="text-gray-600">
                  Upload or create your product catalog with our WhatsApp-based Inward PoS tool, in bulk or individually
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex md:flex-row flex-col items-center md:items-start mb-16 group hover:-translate-y-1 transition-all duration-300">
            <div className="md:w-1/2 md:pr-16 md:text-right text-center mb-8 md:mb-0">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-xl shadow-sm group-hover:border-[#a563ff] group-hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Go Live</h3>
                <p className="text-gray-600">
                  Launch your digital storefront and start accepting orders through multiple channels online, in-store, or Flexistore
                </p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#a563ff] to-[#7c3aed] rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 md:static md:translate-x-0 top-[-16px]">
              <i className="fas fa-rocket text-white"></i>
            </div>
            <div className="md:w-1/2 md:pl-16 text-center md:text-left"></div>
          </div>

          {/* Step 4 */}
          <div className="relative flex md:flex-row flex-col items-center md:items-start group hover:-translate-y-1 transition-all duration-300">
            <div className="md:w-1/2 md:pr-16 md:text-right text-center mb-8 md:mb-0"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#a563ff] to-[#7c3aed] rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 md:static md:translate-x-0 top-[-16px]">
              <i className="fas fa-users text-white"></i>
            </div>
            <div className="md:w-1/2 md:pl-16 text-center md:text-left">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-xl shadow-sm group-hover:border-[#a563ff] group-hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Engage With Customers</h3>
                <p className="text-gray-600">
                  Start building relationships with customers through our omnichannel engagement tools
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <a
            href="#newsletter_subscribe"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-[#a563ff] to-[#7c3aed] text-white font-semibold hover:opacity-90 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-arrow-right mr-2"></i>
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;
