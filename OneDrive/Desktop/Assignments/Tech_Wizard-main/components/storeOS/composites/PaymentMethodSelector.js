import React, { useState, useRef, useEffect } from 'react'
import Dropdown from '@/components/storeOS/Dropdown'

const PaymentMethodSelector = ({
    paymentMethod,
    setPaymentMethod,
    paymentOptions,
}) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState(paymentMethod)

    // Synchronize local state with paymentMethod prop
    useEffect(() => {
        if (paymentMethod) {
            setSelectedPaymentMethod(paymentMethod)
        }
    }, [paymentMethod])

    return (
        <div className="bg-gray-50 shadow-inner p-4 rounded-lg hover:shadow-lg ">
            {/* Static Label */}
            <label className="block text-sm font-medium text-gray-600 mb-2">
                Payment Method
            </label>

            {/* Payment Method Dropdown */}
            <Dropdown
                key={selectedPaymentMethod} // Force re-render when selectedPaymentMethod changes
                triggerLabel={selectedPaymentMethod || 'Select Payment Method'}
                options={paymentOptions}
                onSelect={(option) => setPaymentMethod(option.value)}
                className="text-primary-600 border border-primary-300 focus:ring-2 focus:ring-primary-300 rounded-md"
                menuClassName="shadow-lg rounded-lg border-gray-200"
                optionClassName="hover:bg-primary-50 hover:text-primary-700"
            />
        </div>
    )
}

export default PaymentMethodSelector
