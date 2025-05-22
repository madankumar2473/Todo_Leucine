import React from 'react'
import Layout from '@/layouts/Layout'
import CustomerSelector from '@/components/storeOS/composites/CustomerSelector'
import StaffSelector from '@/components/storeOS/composites/StaffSelector'
import InvoiceItemManager from '@/components/storeOS/composites/InvoiceItemManager'
import { SalesInvoiceProvider } from '@/contexts/SalesInvoiceProvider'

const Invoices = () => {
    return (
        <SalesInvoiceProvider>
            <Layout title="Create Sales Invoice">
                <div className="space-y-8">
                    {/* Customer and Staff Section */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg font-bold text-primary-700 mb-4 sm:mb-6">
                            Customer and Staff
                        </h2>

                        {/* Responsive Layout: Stack on Mobile, Grid on Desktop */}
                        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6">
                            {/* Customer Section */}
                            <div className="bg-gray-50 shadow-inner p-4 rounded-lg hover:shadow-lg">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Customer
                                </label>
                                <CustomerSelector />
                            </div>

                            {/* Staff Section */}
                            <div className="bg-gray-50 shadow-inner p-4 rounded-lg hover:shadow-lg">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Staff
                                </label>
                                <StaffSelector />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items Section */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <InvoiceItemManager />
                    </div>
                </div>
            </Layout>
        </SalesInvoiceProvider>
    )
}

export default Invoices
