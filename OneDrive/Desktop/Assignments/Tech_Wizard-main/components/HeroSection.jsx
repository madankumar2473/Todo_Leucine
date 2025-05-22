import React from 'react';

const HeroSection = () => {
  return (
    <div
      className="relative w-full"
      style={{
        background: 'linear-gradient(120deg, #fdfdfd, #f3fbf5 30%, #eef9f1 70%, #f8faff)',
        backgroundSize: '200% 200%',
        animation: 'lightGradientAnimation 10s ease infinite',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-40">
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
            Transform Your Store Into a
            <span className="text-[#01fd82]">Digital</span> Powerhouse
          </h1>
          <p
            className="text-xl text-gray-600 animate-slide-up delay-100 leading-relaxed"
          >
            Join Briskk today to seamlessly connect with shoppers, streamline operations, and drive
            exponential growth for your business.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200"
          >
            <a
              href="#contact-form"
              className="group px-8 py-4 bg-gradient-to-r from-[#a563ff] to-[#7c3aff] text-white rounded-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 text-lg font-semibold"
            >
              <i className="fas fa-rocket mr-2 group-hover:animate-bounce"></i>
              Get Started Free
            </a>
            <a
              href="#contact-form"
              className="group px-8 py-4 bg-white border-2 border-[#a563ff] text-[#a563ff] rounded-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 text-lg"
            >
              <i className="fas fa-play mr-2 group-hover:animate-pulse"></i>
              Watch Demo
            </a>
          </div>
        </div>
      </div>
      {/* Radial Gradient for Smooth Transition */}
      <div
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0) 70%, #eef9f1 100%)',
          height: '100px',
          marginTop: '-100px',
        }}
      ></div>
    </div>
  );
};

export default HeroSection;
