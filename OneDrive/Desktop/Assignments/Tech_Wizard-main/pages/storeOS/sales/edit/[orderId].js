// pages/storeOS/sales/invoices/edit/[orderId].js

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/layouts/Layout'
import {
    SalesInvoiceProvider,
    useSalesInvoice,
} from '@/contexts/SalesInvoiceProvider'
import InvoiceItemManager from '@/components/storeOS/composites/InvoiceItemManager'
import CustomerSelector from '@/components/storeOS/composites/CustomerSelector'
import StaffSelector from '@/components/storeOS/composites/StaffSelector'
import PaymentMethodSelector from '@/components/storeOS/composites/PaymentMethodSelector'
import Notification from '@/components/storeOS/Notification'
import Button from '@/components/storeOS/Button'

const EditInvoicePageContent = () => {
    const router = useRouter()
    const { orderId } = router.query
    const {
        fetchOrderById,
        selectedSKUs,
        selectedCustomer,
        selectedStaff,
        paymentMethod,
        setPaymentMethod,
        invoiceTotals,
        error,
        clearErrorState,
        saveInvoice,
        fetchStoreStaff,
        storeStaff,
    } = useSalesInvoice()

    const [hasFetchedOrder, setHasFetchedOrder] = useState(false)

    useEffect(() => {
        if (orderId && storeStaff.length > 0 && !hasFetchedOrder) {
            fetchOrderById(orderId)
            setHasFetchedOrder(true)
        }
    }, [orderId, storeStaff])

    return (
        <Layout title="Edit Sales Invoice">
            <div className="space-y-6">
                {/* Notifications */}
                {error && (
                    <Notification
                        message={error}
                        type="error"
                        onClose={clearErrorState}
                    />
                )}
                {/* Customer and Staff Section */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-primary-700 mb-4 sm:mb-6">
                        Customer and Staff
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <CustomerSelector isEditable={false} />
                        <StaffSelector isEditable={false} />
                    </div>
                </div>
                {/* Invoice Items Section */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-primary-700 mb-4 sm:mb-6">
                        Manage Invoice Items
                    </h2>
                    <InvoiceItemManager isEditMode={true} />
                </div>
            </div>
        </Layout>
    )
}

const EditInvoicePage = () => (
    <SalesInvoiceProvider>
        <EditInvoicePageContent />
    </SalesInvoiceProvider>
)

export default EditInvoicePage
