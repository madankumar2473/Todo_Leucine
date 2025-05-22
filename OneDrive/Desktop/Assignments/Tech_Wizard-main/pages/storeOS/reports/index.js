import React from 'react'
import Layout from '@/layouts/Layout'
import Card from '@/components/storeOS/Card'
import { useRouter } from 'next/router'

const ReportsMain = () => {
    const router = useRouter()

    const reports = [
        {
            title: 'Sales Report',
            description:
                'View detailed sales data by payment method, facility, and staff.',
            route: '/storeOS/reports/sales',
        },
        {
            title: 'GST Sales (With HSN)',
            description:
                'Analyze GST data categorized by HSN codes and tax slabs.',
            route: '/storeOS/reports/gst-sales',
        },
        {
            title: 'GSTR-3B',
            description: 'Generate summarized data for GSTR-3B filing.',
            route: '/storeOS/reports/gstr3b',
        },
        {
            title: 'Inventory Report',
            description:
                'Exciting features will be available soon! Tommorow morning',
            route: '/storeOS/reports/inventory',
        },
    ]

    return (
        <Layout title="Reports">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, index) => (
                    <Card
                        key={index}
                        title={report.title}
                        description={report.description}
                        onClick={() => router.push(report.route)}
                        bgColor="bg-white"
                        borderColor="border-gray-200"
                        hoverEffect="hover:border-primary-700 hover:shadow-lg transition-all duration-300 ease-in-out"
                        className="min-h-[150px]"
                    />
                ))}
            </div>
        </Layout>
    )
}

export default ReportsMain
