import React from 'react';

const Features = () => {
  const featuresData = [
    {
      id: 1,
      title: "AI-Driven Conversational PoS on WhatsApp",
      description:
        "Simplify inventory digitization, catalog creation, and online-offline integration — all while reducing operational costs upto 50%.",
      icon: "fas fa-robot",
      blogLink: "https://briskkone.medium.com/reducing-retail-costs-with-briskks-ai-driven-solutions-2fc861543d8e",
      subPoints: [
        { text: "Smart Inventory Management", icon: "fas fa-robot" },
        { text: "Automated Catalog Creation", icon: "fas fa-book-open" },
        { text: "Seamless Integration", icon: "fas fa-sync" },
      ],
    },
    {
      id: 2,
      title: "Integrated Marketplace",
      description: "Connect and trade seamlessly in our unified digital ecosystem.",
      icon: "fas fa-store",
      blogLink: "https://briskkone.medium.com/sales-holistically-with-briskk-online-and-offline-retail-cfa4dd17c9e0",
      subPoints: [
        { text: "Break time barriers – digitize your store for 24/7 access", icon: "fas fa-shopping-cart" },
        { text: "In-store shopping, beat the queue", icon: "fas fa-store-alt" },
        { text: "Deliver in 120 mins from flexi-stores/stores", icon: "fas fa-truck" },
      ],
    },
    {
      id: 3,
      title: "Provide Smart Shopping Experience",
      description: "Bridge the gap between online convenience and in-store engagement.",
      icon: "fas fa-shopping-cart",
      blogLink: "https://briskkone.medium.com/driving-customer-growth-with-briskks-full-stack-omnichannel-solution-4b7a5463fe59",
      subPoints: [
        { text: "Personalized In-Store Suggestions", icon: "fas fa-robot" },
        { text: "Your Store as a Customer Engagement Hub", icon: "fas fa-sync" },
        { text: "Flexible & Dynamic Pricing", icon: "fas fa-tags" },
      ],
    },
    {
      id: 4,
      title: "Omnichannel Analytics",
      description: "Gain comprehensive insights across all your retail channels.",
      icon: "fas fa-chart-line",
      blogLink: "https://briskkone.medium.com/driving-customer-growth-with-briskks-full-stack-omnichannel-solution-4b7a5463fe59",
      subPoints: [
        { text: "Real-time Performance Inventory Tracking", icon: "fas fa-chart-bar" },
        { text: "Customer Behavior Analysis", icon: "fas fa-users" },
        { text: "Targeted Marketing Insights", icon: "fas fa-bullseye" },
      ],
    },
  ];

  return (
    <section id="briskk_offerings" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Briskk Offerings
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform your retail business with our comprehensive suite of digital solutions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-gradient-to-br from-white to-purple-50 border border-gray-200 rounded-xl p-8 hover:border-[#a563ff] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer animate-fade-in"
            >
              <div className="absolute top-0 left-0 bg-gradient-to-r from-[#a563ff] to-purple-500 px-4 py-2 text-white font-bold rounded-tl-xl rounded-br-xl shadow-md">
                {`0${feature.id}`}
              </div>
              <div className="text-[#a563ff] mb-6 text-4xl sm:text-3xl md:text-4xl absolute top-4 right-4">
                <i className={`${feature.icon} transform group-hover:rotate-12 transition-transform duration-300`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-3 text-gray-500">
                {feature.subPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-center group-hover:translate-x-2 transition-transform duration-300"
                  >
                    <i className={`${point.icon} text-[#a563ff] mr-2`}></i>
                    {point.text}
                  </li>
                ))}
              </ul>

              {/* Blog Link */}
              <a
                href={feature.blogLink}
                className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 border-2 border-[#a563ff] text-[#a563ff] rounded-full shadow-lg hover:bg-[#a563ff] hover:text-white transition-all duration-300"
                aria-label={`Read more about ${feature.title}`}
              >
                <i className="fas fa-book-open"></i>
              </a>
            </div>
          ))}
        </div>

        {/* Horizontal Call-to-Action */}
        <div className="mt-16 text-center animate-fade-in">
        <div className="mt-16 text-center animate-fade-in">
        <div className="mt-16 text-center animate-fade-in">
  <div className="relative bg-gradient-to-br from-white to-purple-50 border border-gray-200 rounded-xl p-6 md:p-8 hover:border-[#a563ff] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
    <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row items-center md:justify-between">
      {/* Icon and Content Section */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-center md:text-left space-y-4 md:space-y-0">
        <div className="text-center md:text-left md:flex-shrink-0">
          <i className="fas fa-store-alt text-[#a563ff] text-4xl transform group-hover:rotate-12 transition-transform duration-300"></i>
        </div>
        <div>
          <p className="text-gray-600 text-lg md:text-xl font-bold">
            Are you an <span className="text-[#a563ff] font-semibold">online-only</span> brand? Invested in <span className="text-[#a563ff] font-semibold">Flexi-store or PopUp stores</span> yet?
          </p>
          <div className="flex flex-col md:flex-wrap md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <i className="fas fa-project-diagram text-[#a563ff]"></i>
              <span>Boost Discovery</span>
            </div>
            <div className="flex items-center space-x-1">
              <i className="fas fa-users text-[#a563ff]"></i>
              <span>Expand Outreach</span>
            </div>
            <div className="flex items-center space-x-1">
              <i className="fas fa-truck text-[#a563ff]"></i>
              <span>Ensure Deliveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Button Section */}
      <a
        target="_blank"
        href="https://briskkone.medium.com/bridging-the-gap-how-flexi-stores-can-help-pure-online-brands-go-omnichannel-with-briskk-f9b39357fa62"
        className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#a563ff] to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:-translate-y-1 space-x-2"
      >
        <span>Learn More</span>
        <i className="fas fa-arrow-right"></i>
      </a>
    </div>
  </div>
</div>

</div>

</div>


        <div className="mt-16 text-center animate-fade-in">
          <button
            onClick={() =>
              document
                .getElementById("newsletter_subscribe")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-[#a563ff] to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <i className="fas fa-rocket mr-2"></i>
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
