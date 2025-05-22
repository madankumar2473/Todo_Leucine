import React from 'react'
import {
    TrendingUp as TrendingUpIcon, // For Increased Sales
    GroupAdd as GroupAdd, // For Increased Footfall
    AttachMoney as AttachMoneyIcon, // For Higher Avg Order Value
    ElectricBolt as ElectricBolt, // For Increased Staff Output
    Savings as SavingsIcon, // For Lower Cost of Key Services
    Inventory as InventoryIcon, // For Higher Inventory but Lesser Space
} from '@mui/icons-material'

import benefitOneImg from '../public/img/img-sales.png'
import benefitTwoImg from '../public/img/img-operational.png'

const benefitOne = {
    title: 'Increased Sales',
    desc: '',
    image: benefitOneImg,
    imageAltText:'Boost store footfall and increase high order value with Briskk\'s solutions',
    bullets: [
        {
            title: 'Increased Conversion',
            desc: 'Engagement before visiting stores, hourly configurable deals over and above store offers and a larger collection leads to better conversion.',
            icon: <TrendingUpIcon />,
        },
        {
            title: 'Increased Footfall',
            desc: 'Targeted ads, abandoned cart recovery, referrals via social sharing, and coordinated mega shopping festivals will lead to higher footfall.',
            icon: <GroupAdd />,
        },
        {
            title: 'Higher Avg Order Value',
            desc: 'Cross-selling and upselling in-store by utilizing consumer shopping behavior recorded outside/inside the store.',
            icon: <AttachMoneyIcon />,
        },
    ],
}

const benefitTwo = {
    title: 'Operational Efficiency',
    desc: '',
    image: benefitTwoImg,
    imageAltText:'Enhanced operational efficiency and staff productivity with Briskk\'s platform',
    bullets: [
        {
            title: 'Increased Staff Output',
            desc: 'Staff can use the app to upsell, cross-sell, and manage customers according to the consumer history, enhancing sales staff efficiency.',
            icon: <ElectricBolt />,
        },
        {
            title: 'Lower Cost of Key Services',
            desc: 'Streamlined operations reduce costs by automating checkout, centralizing logistics, and managing initial inquiries and hardware expenses.',
            icon: <SavingsIcon />,
        },
        {
            title: 'Higher Inventory but Lesser Space',
            desc: 'With the power of the app, in-store consumers can see beyond the display, resulting in better utilization of space.',
            icon: <InventoryIcon />,
        },
    ],
}

export { benefitOne, benefitTwo }
