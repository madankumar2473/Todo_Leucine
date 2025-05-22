import React from 'react'
import Container from './container'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

const Faq = () => {
    return (
        <Container className="!p-0">
            <div className="w-full max-w-2xl p-4 sm:p-2 mx-auto rounded-2xl">
                {faqdata.map((item, index) => (
                    <div key={item.question} className="mb-5">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-neutral-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75">
                                        <span className="flex-1">
                                            {item.question}
                                        </span>
                                        <ChevronUpIcon
                                            className={`${
                                                open
                                                    ? ''
                                                    : 'transform rotate-180'
                                            } w-5 h-5 text-primary-900`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-neutral-700">
                                        {item.answer}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                ))}
            </div>
        </Container>
    )
}

const faqdata = [
    {
        question:
            'How is the products/inventory shown on the briskk marketplace?',
        answer: 'The inventory data is either fetched from ERP/POS or from a marketplace enbaler/aggregator, which in turn is connected to ERP/POS.',
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
]

export default Faq
