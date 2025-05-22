import React, { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How does Briskk's WhatsApp integration work?",
      answer:
        "Briskk seamlessly integrates with WhatsApp Business API to enable product inward, cataloging, and customer support through WhatsApp.",
    },
    {
      question: "What are the pricing plans?",
      answer:
        "We offer flexible pricing plans starting from basic to enterprise levels. Contact our sales team for detailed pricing information.",
    },
    {
      question: "How long does it take to set up?",
      answer:
        "Most businesses are up and running within 24-48 hours. Our team provides complete setup assistance and training.",
    },
    {
        question:
            'Will I need to share consumer data with briskk? Do the brands/stores need to integrate their CRM with briskk?',
        answer: 'No, like any other marketplace, we will not fetch existing consumer data from CRM. Users will be onboarded and managed on the briskk Platform.',
    },
    {
        question: "What is briskk's privacy policy?",
        answer: 'briskk (ChannelBlend Technologies) is compliant with the General Data Protection Regulation (GDPR) and the Digital Personal Data Protection Act (DPDPA, India). All customer data is encrypted and anonymized to ensure privacy.',
    },
    {
        question: 'What security measures does briskk have in place?',
        answer: 'briskk (ChannelBlend Technologies) has robust security measures, including secure authentication and access controls, encryption of data at rest and in transit, regular security audits, and protection against cyber threats.',
    },
    {
        question:
            'How will briskk be able to connect with so many brands and offline stores in a short period of time?',
        answer: 'Integrating with a single POS system or marketplace aggregator allows us to easily connect with all other brands using the same retail system. For example, integrating with a marketplace enabler or aggregator can open doors to multiple brands with offline stores.',
    },
    {
        question: 'What payment methods are accepted on briskk?',
        answer: 'briskk accepts various payment methods, including credit/debit cards, mobile wallets, buy now and pay later, and all leading payment methods, providing customers with flexibility and convenience in their payment options.',
    },
    {
        question: 'What are the main benefits for retailers joining briskk?',
        answer: 'Retailers benefits from increased sales, reduced operational costs with high customer satisfaction',
    },
    {
        question:
            'What differentiates briskk from existing eCommerce or retail solutions?',
        answer: 'briskk offers a distinctive in-store, pre-store, and post-store experience for consumers, a feature that is currently fragmented in the market.',
    },
    {
        question: 'Is there a setup/joining fee for joining briskk?',
        answer: 'Currently, joining briskk is free of cost. We are offering this to help retailers easily transition to our platform and experience the benefits without any initial investment.',
    },
  ];

  return (
    <>
      <div className="mt-18 bg-white p-8 rounded-2xl shadow-sm" id="faq">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          id="el-bntij5rp"
        >
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4" id="el-nl0zcbdl">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:border-[#a563ff] hover:shadow-md transition-all duration-300 bg-gray-50"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <i
                  className={`fas ${
                    openFAQ === index ? "fa-minus" : "fa-plus"
                  } text-[#a563ff] transform transition-transform duration-300`}
                ></i>
              </button>
              {openFAQ === index && (
                <div className="mt-2 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 text-center" id="el-54zqwpr6">
        <button
          onClick={() =>
            document.getElementById("newsletter_subscribe").scrollIntoView({ behavior: "smooth" })
          }
          className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-[#a563ff] to-[#7c3aed] text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          id="el-c101017m"
        >
          <i className="fas fa-rocket mr-2"></i>
          Join Our Success Story
        </button>
      </div>
    </>
  );
};

export default FAQ;
