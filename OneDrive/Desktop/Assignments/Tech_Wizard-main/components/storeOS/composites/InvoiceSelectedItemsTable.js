import React, { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'
import Button from '@/components/storeOS/Button'
import InputField from '@/components/storeOS/InputField'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import { formatPrice } from '@/utils/util'
import Toast from '@/components/storeOS/Toast'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/storeOS/Modal'

const InvoiceSelectedItemsTable = () => {
    const {
        selectedSKUs,
        updateSKUInInvoice,
        removeSKUFromInvoice,
        toast,
        hideToast,
    } = useSalesInvoice()

    const [localFinalPrices, setLocalFinalPrices] = useState({})
    const [localDiscountPercentages, setLocalDiscountPercentages] = useState({})
    const [localDiscountAmounts, setLocalDiscountAmounts] = useState({})
    const [modalData, setModalData] = useState(null)

    // Initialize local state when selectedSKUs changes
    useEffect(() => {
        const initialPrices = selectedSKUs.reduce((acc, sku) => {
            acc[sku.id] =
                sku.final_price !== undefined
                    ? sku.final_price
                    : sku.offer_price
            return acc
        }, {})
        const initialPercentages = selectedSKUs.reduce((acc, sku) => {
            acc[sku.id] = sku.discount_percentage || 0
            return acc
        }, {})
        const initialAmounts = selectedSKUs.reduce((acc, sku) => {
            acc[sku.id] = sku.discount_amount || 0
            return acc
        }, {})
        setLocalFinalPrices(initialPrices)
        setLocalDiscountPercentages(initialPercentages)
        setLocalDiscountAmounts(initialAmounts)
    }, [selectedSKUs])

    const updateFieldDebounced = debounce((skuId, updates) => {
        updateSKUInInvoice(skuId, updates)
    }, 500)

    const handleFinalPriceChange = (sku, value) => {
        const finalPrice = parseFloat(value) || 0

        // Update local state for immediate UI feedback
        setLocalFinalPrices((prev) => ({
            ...prev,
            [sku.id]: value,
        }))

        // Recalculate dependent fields
        const discountAmount = sku.offer_price - finalPrice
        const discountPercentage = (discountAmount / sku.offer_price) * 100

        setLocalDiscountAmounts((prev) => ({
            ...prev,
            [sku.id]: discountAmount,
        }))
        setLocalDiscountPercentages((prev) => ({
            ...prev,
            [sku.id]: discountPercentage,
        }))

        // Trigger debounced global state update
        updateFieldDebounced(sku.id, { final_price: finalPrice })
    }

    const handleDiscountAmountChange = (sku, value) => {
        const discountAmount = parseFloat(value) || 0

        // Update local state for immediate UI feedback
        setLocalDiscountAmounts((prev) => ({
            ...prev,
            [sku.id]: value,
        }))

        // Recalculate dependent fields
        const finalPrice = sku.offer_price - discountAmount
        const discountPercentage = (discountAmount / sku.offer_price) * 100

        setLocalFinalPrices((prev) => ({
            ...prev,
            [sku.id]: finalPrice,
        }))
        setLocalDiscountPercentages((prev) => ({
            ...prev,
            [sku.id]: discountPercentage,
        }))

        // Trigger debounced global state update
        updateFieldDebounced(sku.id, { discount_amount: discountAmount })
    }

    const handleDiscountPercentageChange = (sku, value) => {
        const discountPercentage = parseFloat(value) || 0

        // Update local state for immediate UI feedback
        setLocalDiscountPercentages((prev) => ({
            ...prev,
            [sku.id]: value,
        }))

        // Recalculate dependent fields
        const discountAmount = (sku.offer_price * discountPercentage) / 100
        const finalPrice = sku.offer_price - discountAmount

        setLocalFinalPrices((prev) => ({
            ...prev,
            [sku.id]: finalPrice,
        }))
        setLocalDiscountAmounts((prev) => ({
            ...prev,
            [sku.id]: discountAmount,
        }))

        // Trigger debounced global state update
        updateFieldDebounced(sku.id, {
            discount_percentage: discountPercentage,
        })
    }

    const openModal = (sku) => setModalData(sku)
    const closeModal = () => setModalData(null)

    return (
        <>
            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-bold text-primary-600 mb-4">
                    Selected Items
                </h3>
                {toast.isVisible && (
                    <Toast
                        message={toast?.message}
                        type={toast?.type}
                        onClose={hideToast} // Only render when hideToast is valid
                    />
                )}
                <div className="w-full overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-primary-100 border-b text-neutral-700 text-sm">
                                <th className="p-2 text-left">SKU Name</th>
                                <th className="p-2 text-center">MRP</th>
                                <th className="p-2 text-center">
                                    Selling Price
                                </th>
                                <th className="p-2 text-center">Discount</th>
                                <th className="p-2 text-center">Final Price</th>
                                <th className="p-2 text-center w-20">Qty</th>
                                <th className="p-2 text-center">GST Amount</th>
                                <th className="p-2 text-center">Total</th>
                                <th className="p-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedSKUs.length > 0 ? (
                                selectedSKUs.map((sku) => {
                                    const total =
                                        (sku.final_price !== undefined
                                            ? sku.final_price
                                            : sku.offer_price) * sku.quantity

                                    return (
                                        <tr
                                            key={sku.id}
                                            className="border-b hover:bg-neutral-50 transition-all text-sm"
                                        >
                                            <td className="p-2 text-left text-neutral-800 border font-semibold">
                                                <div className="flex flex-col">
                                                    <span className=" text-secondary-900">
                                                        {sku.display_name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        ({sku.custom_code})
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-2 text-center text-neutral-900 border font-semibold">
                                                {formatPrice(sku.base_price)}
                                            </td>

                                            <td className="p-2 text-center text-neutral-900 border font-semibold">
                                                {formatPrice(sku.offer_price)}
                                            </td>

                                            <td className="p-2 text-center border font-semibold">
                                                <div className="flex flex-col gap-2">
                                                    {/* Discount Percentage */}
                                                    <div className="flex items-center gap-0">
                                                        <div className="w-6 text-white text-sm font-bold flex-shrink-0 bg-neutral-500 rounded-md text-center p-1">
                                                            %
                                                        </div>
                                                        <InputField
                                                            type="number"
                                                            value={
                                                                localDiscountPercentages[
                                                                    sku.id
                                                                ] || ''
                                                            }
                                                            onChange={(value) =>
                                                                handleDiscountPercentageChange(
                                                                    sku,
                                                                    value
                                                                )
                                                            }
                                                            className="!w-20 lg:!w-24 text-sm border border-neutral-300 text-center rounded-md focus:ring focus:ring-primary-300"
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* Discount Amount */}
                                                    <div className="flex items-center gap-0">
                                                        <div className="w-6 text-white text-sm font-bold flex-shrink-0 bg-neutral-500 rounded-md text-center p-1">
                                                            ₹
                                                        </div>
                                                        <InputField
                                                            type="number"
                                                            value={
                                                                localDiscountAmounts[
                                                                    sku.id
                                                                ] || ''
                                                            }
                                                            onChange={(value) =>
                                                                handleDiscountAmountChange(
                                                                    sku,
                                                                    value
                                                                )
                                                            }
                                                            className="!w-20 lg:!w-24 text-sm border border-neutral-300 text-center rounded-md focus:ring focus:ring-primary-300"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-2 text-center text-neutral-900 border font-semibold">
                                                <InputField
                                                    type="number"
                                                    value={
                                                        localFinalPrices[
                                                            sku.id
                                                        ] || ''
                                                    }
                                                    onChange={(value) =>
                                                        handleFinalPriceChange(
                                                            sku,
                                                            value
                                                        )
                                                    }
                                                    className="!w-24 text-sm border border-neutral-300 text-center rounded-md p-1 focus:ring focus:ring-primary-300"
                                                />
                                            </td>

                                            <td className="p-2 text-center border font-semibold">
                                                <InputField
                                                    type="number"
                                                    value={sku.quantity}
                                                    min="1"
                                                    onChange={(value) =>
                                                        updateSKUInInvoice(
                                                            sku.id,
                                                            {
                                                                quantity:
                                                                    parseInt(
                                                                        value
                                                                    ),
                                                            }
                                                        )
                                                    }
                                                    className="!w-16 text-sm border border-neutral-300 text-center rounded-md p-1 focus:ring focus:ring-primary-300"
                                                />
                                            </td>

                                            <td className="p-2 text-center text-neutral-900 border font-semibold">
                                                <div className="flex items-center justify-center">
                                                    {formatPrice(
                                                        sku?.GST_amount *
                                                            sku?.quantity || ''
                                                    )}
                                                    <InformationCircleIcon
                                                        className="w-5 h-5 text-gray-500 cursor-pointer ml-2"
                                                        onClick={() =>
                                                            openModal(sku)
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-2 text-center text-neutral-900  border font-semibold">
                                                {formatPrice(total)}
                                            </td>

                                            <td className="p-2 text-right border">
                                                <Button
                                                    label="Remove"
                                                    variant="outline"
                                                    size="small"
                                                    onClick={() =>
                                                        removeSKUFromInvoice(
                                                            sku.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="p-4 text-center text-sm text-neutral-500 border"
                                    >
                                        No items added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalData && (
                <Modal
                    isOpen={!!modalData}
                    onClose={closeModal}
                    header="GST Details for Selected Item based on Final price"
                >
                    <p>SKU Name: {modalData.display_name}</p>
                    <p>GST Rate: {modalData.GST_rate}%</p>
                    <p>CGST: {modalData.cgstRate}%</p>
                    <p>SGST: {modalData.sgstRate}%</p>
                    <p>HSN Code: {modalData.hsn_code}</p>
                </Modal>
            )}
        </>
    )
}

export default InvoiceSelectedItemsTable
