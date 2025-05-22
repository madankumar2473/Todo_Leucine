import React from 'react';

const HeroSection = () => {
  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(120deg, #f9fafb, #edf9fa 30%, #f1fdf5 70%, #f5f8fe)',
        backgroundSize: '200% 200%',
        animation: 'lightGradientAnimation 12s ease infinite',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-center">
        <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight animate-slide-up"
            id="el-z20o0qt3"
            >
            Transform Your Store Into a{' '}
            <span
                className="relative text-[#01fd82]"
                style={{ display: 'inline-block' }}
            >
                Digital
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 10"
                className="absolute bottom-[-6px] left-0 w-full h-[10px]"
                style={{ fill: 'none' }}
                >
                <path
                    d="M0 5 C50 10, 150 0, 200 5"
                    stroke="#01fd82"
                    strokeWidth="2"
                    fill="transparent"
                    strokeLinecap="round"
                />
                </svg>
            </span>{' '}
            Powerhouse
            </h1>

          <p
            className="text-xl text-gray-600 animate-slide-up delay-100 leading-relaxed"
          >
Empowering emerging brands with seamless digital and in-store integration for next-gen retail success.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200"
          >
            <a
              href="#newsletter_subscribe"
              className="group px-8 py-4 bg-gradient-to-r from-[#a563ff] to-[#7c3aff] text-white rounded-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 text-lg font-semibold"
            >
              <i className="fas fa-rocket mr-2 group-hover:animate-bounce"></i>
              Get Started Free
            </a>
            <a
              href="#newsletter_subscribe"
              className="group px-8 py-4 bg-white border-2 border-[#a563ff] text-[#a563ff] rounded-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 text-lg"
            >
              <i className="fas fa-play mr-2 group-hover:animate-pulse"></i>
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
