import React from 'react'
import Container from './container'
import { BarChart, Handshake, CheckCircle } from '@mui/icons-material' // Importing the required icons from MUI

const stats = [
    {
        title: 'Digital Adoption',
        description: (
            <p>
                <Mark>70% Indian internet users</Mark> will shop online by 2025,
                making omnichannel solutions vital for growth.
            </p>
        ),
        icon: (
            <BarChart
                fontSize="large"
                className="w-8 h-8 gradient-bg text-white rounded-md"
            />
        ),
        source: 'Source: Statista',
    },
    {
        title: 'Experience',
        description: (
            <p>
                <Mark>62% Shoppers</Mark> prefer hands-on assistance, but
                physical stores lack the convenience and deals of online
                shopping.
            </p>
        ),
        icon: (
            <Handshake
                fontSize="large"
                className="w-8 h-8 gradient-bg text-white rounded-md"
            />
        ),
        source: 'Source: Retail Dive',
    },
    {
        title: 'Personalisation',
        description: (
            <p>
                <Mark>80% Consumers</Mark> prefer brands with tailored
                recommendations, making personalization crucial.
            </p>
        ),
        icon: (
            <CheckCircle
                fontSize="large"
                className="w-8 h-8 gradient-bg text-white rounded-md"
            />
        ),
        source: 'Source: Epsilon',
    },
]
const StatsSection = () => {
    return (
        <div className="bg-gray-50 py-12">
            <Container className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 text-center shadow-md "
                        >
                            <div className="mb-2 ">{stat.icon}</div>
                            <h2 className="text-black text-3xl font-bold mb-2">
                                {stat.title}
                            </h2>
                            <div className="text-black font-medium mb-4">
                                {stat.description}
                            </div>
                            <p className="text-neutral-700 text-base">
                                {stat.source}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

function Mark(props) {
    return (
        <>
            {' '}
            <mark className="text-black bg-pink-100 rounded-md ring-pink-100">
                {props.children}
            </mark>{' '}
        </>
    )
}

export default StatsSection
