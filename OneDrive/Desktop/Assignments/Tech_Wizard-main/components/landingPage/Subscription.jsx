import React, { useState } from "react";

const Subscription = () => {
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("Submitting...");
    const form = e.target;

    fetch("https://formspree.io/f/xbljebkp", {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setFormStatus("Thanks for subscribing! We’ll be in touch soon.");
          form.reset();
        } else {
          setFormStatus("Oops! Something went wrong. Please try again.");
        }
      })
      .catch(() => {
        setFormStatus("Oops! Something went wrong. Please try again.");
      });
  };

  return (
    <section
      id="newsletter_subscribe"
      className="py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="relative p-8 md:p-12 lg:p-16 backdrop-blur-sm">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <img
                  src="../img/briskk_complete_blue_logo.png"
                  alt="Briskk Logo"
                  className="h-12 mb-6 mx-auto lg:mx-0 hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-[#a563ff] to-[#0000d2]">
                  Stay Updated with Retail Trends
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Get the latest insights, features updates, and exclusive
                  offers delivered directly to your inbox.
                </p>
              </div>

              <div className="w-full">
                <form
                  id="newsletter-form"
                  onSubmit={handleSubmit}
                  className="space-y-4 bg-white/80 p-6 rounded-xl backdrop-blur-md shadow-lg"
                >
                  <div className="relative transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-store text-[#a563ff]"></i>
                    </div>
                    <input
                      type="text"
                      name="storeName"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a563ff] transition-all duration-300"
                      placeholder="Store/Brand Name"
                      required
                    />
                  </div>
                  <div className="relative transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-[#a563ff]"></i>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a563ff] transition-all duration-300"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="relative transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-phone text-[#a563ff]"></i>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a563ff] transition-all duration-300"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className="relative transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-tag text-[#a563ff]"></i>
                    </div>
                    <select
                      name="category"
                      className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a563ff] transition-all duration-300"
                      required
                    >
                      <option value="" disabled selected>
                        Select Category
                      </option>
                      <option value="fashion">Fashion</option>
                      <option value="cosmetics">Cosmetics</option>
                      <option value="electronics">Electronics</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#a563ff] to-[#0000d2] text-white rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-lg"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Submit
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    By submitting, you agree to our{" "}
                    <a
                      href="../privacy-policy"
                      className="text-[#a563ff] hover:underline transition-all duration-300"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </form>
                {formStatus && (
                  <p className="mt-4 text-center text-gray-600">{formStatus}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
