import React from 'react';

const BusinessImpact = () => {
  return (
    <section id="business_impact" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 animate-fade-up">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block cursor-pointer"
          >
            Transform Your Business Metrics
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#01fd82] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </h2>
          <p
            className="text-gray-600 text-lg max-w-2xl mx-auto cursor-pointer"
           
          >
            Experience significant improvements across all key business metrics with Briskk
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="relative bg-white border border-gray-200 rounded-xl p-8 overflow-hidden group hover:border-[#01fd82] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up backdrop-blur-sm bg-white/90 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#01fd82]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-[#01fd82] mb-6 text-4xl transform group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-[#01fd82] group-hover:animate-pulse">
                  ~50%
                </span>
                <span className="text-gray-600 ml-2">Reduction</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Operational Costs</h3>
              <p className="text-gray-600">
                Streamline processes and reduce overhead with automated operations and smart inventory management
              </p>
            </div>
          </div>

          <div
            className="relative bg-white border border-gray-200 rounded-xl p-8 overflow-hidden group hover:border-[#01fd82] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up delay-100 backdrop-blur-sm bg-white/90 cursor-pointer"
            
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#01fd82]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-[#01fd82] mb-6 text-4xl transform group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-users"></i>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-[#01fd82] group-hover:animate-pulse">
                  ~3x
                </span>
                <span className="text-gray-600 ml-2">Increase</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Engagement</h3>
              <p className="text-gray-600">
                Boost customer interactions through omnichannel presence and personalized informed communication
              </p>
            </div>
          </div>

          <div
            className="relative bg-white border border-gray-200 rounded-xl p-8 overflow-hidden group hover:border-[#01fd82] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up delay-200 backdrop-blur-sm bg-white/90 cursor-pointer"
            
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#01fd82]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-[#01fd82] mb-6 text-4xl transform group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-arrow-trend-up"></i>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-[#01fd82] group-hover:animate-pulse">
                  ~2x
                </span>
                <span className="text-gray-600 ml-2">Growth</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sales Performance</h3>
              <p className="text-gray-600">
                Double your sales with enhanced visibility and improved customer conversion rates
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center animate-fade-up p-6 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-[#01fd82] mb-2 group-hover:scale-110 transition-transform duration-300">
              ~3hr/day/staff
            </div>
            <p className="text-gray-600">Time Saved (Staff)</p>
          </div>
          <div className="text-center animate-fade-up delay-100 p-6 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-[#01fd82] mb-2 group-hover:scale-110 transition-transform duration-300">
              ~45min
            </div>
            <p className="text-gray-600">Average Time Saved (Consumer)</p>
          </div>
          <div className="text-center animate-fade-up delay-200 p-6 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-[#01fd82] mb-2 group-hover:scale-110 transition-transform duration-300">
              ~24/7
            </div>
            <p className="text-gray-600">Customer Support</p>
          </div>
          <div className="text-center animate-fade-up delay-300 p-6 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-[#01fd82] mb-2 group-hover:scale-110 transition-transform duration-300">
              ~4K+
            </div>
            <p className="text-gray-600">Active Users</p>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default BusinessImpact;
