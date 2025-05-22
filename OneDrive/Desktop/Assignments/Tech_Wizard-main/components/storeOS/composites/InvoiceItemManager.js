import React, { useState, useRef } from 'react'
import InvoiceSelectedItemsTable from '@/components/storeOS/composites/InvoiceSelectedItemsTable'
import Modal from '@/components/storeOS/Modal'
import Button from '@/components/storeOS/Button'
import Notification from '@/components/storeOS/Notification'
import AddItemWhileSale from '@/components/storeOS/composites/AddItemWhileSale'
import { PlusIcon } from '@heroicons/react/24/outline'
import SvgIcon from '@mui/material/SvgIcon'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import Loader from '@/components/storeOS/Loader'
import PaymentMethodSelector from '@/components/storeOS/composites/PaymentMethodSelector'
import InventoryOutlined from '@mui/icons-material/InventoryOutlined'
import { useRouter } from 'next/router'
import Toast from '@/components/storeOS/Toast'
import { formatPrice } from '@/utils/util'
import Dropdown from '@/components/storeOS/Dropdown'
import InputField from '@/components/storeOS/InputField'
import Checkbox from '@/components/storeOS/Checkbox'

export const BarcodeIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M2 2h2v20H2V2zm4 0h1v20H6V2zm3 0h2v20H9V2zm4 0h1v20h-1V2zm3 0h2v20h-2V2zm4 0h1v20h-1V2z" />
    </SvgIcon>
)

const InvoiceItemManager = ({ isEditMode = false }) => {
    const {
        selectedSKUs,
        fetchSKUByBarcode,
        addSKUToInvoice,
        saveInvoice,
        setErrorState,
        clearErrorState,
        error,
        loading,
        selectedCustomer,
        invoiceTotals,
        selectedStaff,
        paymentMethod,
        setPaymentMethod,
        invoiceEdit,
        handleRoundOffToggle,
        handleRoundOffChange,
    } = useSalesInvoice()

    const [barcode, setBarcode] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [notification, setNotification] = useState({ type: '', message: '' })
    const [roundOffType, setRoundOffType] = useState('add') // Add or Reduce
    const [roundOffValue, setRoundOffValue] = useState('') // Value for round off
    const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(false) // Checkbox state
    const barcodeInputRef = useRef(null)
    const router = useRouter()

    const { orderId } = router.query // Extract orderId from the query

    const paymentOptions = [
        { label: 'Cash', value: 'Cash' },
        { label: 'UPI', value: 'UPI' },
        { label: 'Card', value: 'Card' },
        { label: 'Cash + UPI', value: 'Cash + UPI' },
        { label: 'Cash + Card', value: 'Cash + Card' },
        { label: 'UPI + Card', value: 'UPI + Card' },
        { label: 'Bank Transfer', value: 'Bank Transfer' },
    ]

    const handleRoundOffToggleLocal = (checked) => {
        setIsRoundOffEnabled(checked)
        handleRoundOffToggle(checked)
    }

    const handleRoundOffChangeLocal = (type, value) => {
        setRoundOffType(type)
        setRoundOffValue(value)
        handleRoundOffChange(type, value)
    }

    // Handle Barcode Input
    const handleBarcodeInput = async (barcodeValue) => {
        if (!selectedCustomer || !selectedStaff) {
            setNotification({
                type: 'error',
                message:
                    'Please select a customer and staff before adding items.',
            })
            return
        }
        if (!barcodeValue || barcodeValue.length !== 12) {
            return // Ignore invalid barcodes
        }

        try {
            await fetchSKUByBarcode({ barcode: barcodeValue })
            setBarcode('') // Clear input on success
            if (barcodeInputRef.current) barcodeInputRef.current.focus() // Refocus input
        } catch (err) {
            setErrorState('Invalid barcode or SKU not found.')
        }
    }

    const handleBarcodeChange = (e) => {
        const value = e.target.value.trim()
        if (value.length !== 12) {
            setBarcode(value) // Update state only for incomplete barcodes
            return
        }
        handleBarcodeInput(value)
    }

    const handleSaveInvoice = async () => {
        if (!selectedCustomer?.user_id) {
            setErrorState(
                'No users selected. Please select a user to save the invoice.'
            )
            return
        }
        if (!selectedStaff?.id) {
            setErrorState(
                'No staff selected. Please select a staff to save the invoice.'
            )
            return
        }
        if (!selectedSKUs.length) {
            setErrorState(
                'No items selected. Please add items to save the invoice.'
            )
            return
        }
        if (!paymentMethod) {
            setErrorState(
                'No payment methods selected. Please select a payment method to save a invoice.'
            )
            return
        }

        try {
            const { orderId, invoiceNumber } = await saveInvoice()
            if (orderId) {
                setNotification({
                    type: 'success',
                    message:
                        'Invoice has been created successfully. Redirecting to the invoice page...',
                })
                clearErrorState()
                router.push(`/storeOS/sales/invoices/${orderId}`)
            } else {
                setErrorState('Failed to create invoice. Please try again.')
            }
        } catch (err) {
            setErrorState('Failed to save the invoice. Please try again.')
        }
    }

    const handleEditInvoice = async () => {
        try {
            if (!selectedCustomer || !selectedStaff || !paymentMethod) {
                setErrorState('Please fill all required fields before saving.')
                return
            }
            await invoiceEdit(orderId) // Update the existing order
            setNotification({
                type: 'success',
                message: 'Order updated successfully!',
            })
            router.push(`/storeOS/sales/invoices/${orderId}`) // Redirect after timeout
        } catch (err) {
            setErrorState('Failed to update the order. Please try again.')
        }
    }

    const handleAddItem = () => {
        if (!selectedCustomer || !selectedStaff) {
            setNotification({
                type: 'error',
                message:
                    'Please select a customer and staff before adding items.',
            })
            return
        }
        setIsModalOpen(true) // Proceed to open the Add Item modal
    }

    return (
        <div className="bg-neutral-100 shadow-inner rounded-lg p-3 sm:p-6 hover:shadow-lg">
            {/* Toast for success and error */}

            {(error || notification.message) && (
                <div className="mb-4 sm:mb-6">
                    {error && (
                        <Toast
                            message={error}
                            onClose={clearErrorState}
                            type="error"
                        />
                    )}
                    {notification.message && (
                        <Toast
                            message={notification.message}
                            onClose={() =>
                                setNotification({ type: '', message: '' })
                            }
                            type={
                                notification.type === 'success'
                                    ? 'success'
                                    : 'error'
                            }
                        />
                    )}
                </div>
            )}

            {/* Manage Invoice Items Section */}
            <div className="bg-gray-50 shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg">
                <h3 className="text-lg font-bold text-primary-700 mb-3 sm:mb-4">
                    Manage Invoice Items
                </h3>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center items-center mt-3 sm:mt-4">
                        <Loader />
                    </div>
                )}

                {/* Barcode Input and Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-3 sm:mt-4">
                    {/* Barcode Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            ref={barcodeInputRef}
                            value={barcode}
                            onChange={handleBarcodeChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                    handleBarcodeInput(barcode)
                            }}
                            placeholder="Scan or Enter Barcode"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            label="Scan Barcode"
                            iconBefore={() => <BarcodeIcon className="mr-2" />}
                            onClick={() => barcodeInputRef.current.focus()}
                            variant="primary"
                            className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-lg shadow-md w-full sm:w-auto"
                        />
                        <Button
                            label="Add Item"
                            iconBefore={PlusIcon}
                            variant="primary"
                            onClick={handleAddItem}
                            className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-lg shadow-md w-full sm:w-auto"
                        />
                    </div>
                </div>

                {/* Items Table or No Items Message */}
                {selectedSKUs && selectedSKUs.length > 0 ? (
                    <InvoiceSelectedItemsTable className="mt-4" />
                ) : (
                    <div className="mt-4 text-center text-sm text-gray-500">
                        <InventoryOutlined
                            className="mx-auto text-gray-400 mb-2"
                            style={{ fontSize: '36px' }}
                        />
                        <p>
                            No items added yet. Use{' '}
                            <span
                                onClick={handleAddItem}
                                className="text-primary-700 font-medium cursor-pointer"
                            >
                                + Add Item
                            </span>{' '}
                            or scan a barcode to add SKUs.
                        </p>
                    </div>
                )}

                {/* Add Item Modal */}
                <AddItemWhileSale
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>

            {/* Invoice Summary Section */}
            {/* Invoice Summary Section */}
            <div className="mt-5 sm:mt-6 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md">
                <h4 className="text-lg font-bold text-primary-700 mb-3 sm:mb-4">
                    Invoice Summary
                </h4>

                {/* TOTAL Quantity in cart */}
                <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-gray-200 pb-2">
                    <p className="text-neutral-600 font-medium">
                        Total Quantity:
                    </p>
                    <p className="text-right font-medium text-neutral-800">
                        {invoiceTotals.totalQuantity || 0}
                    </p>
                </div>

                {/* Subtotal */}
                <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-gray-200 pb-2">
                    <p className="text-neutral-600 font-medium">Subtotal:</p>
                    <p className="text-right font-medium text-neutral-800">
                        {formatPrice(invoiceTotals.subtotal || 0)}
                    </p>
                </div>

                {/* Total GST */}
                <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-gray-200 py-2">
                    <p className="text-neutral-600 font-medium">Total GST:</p>
                    <p className="text-right font-medium text-neutral-800">
                        {formatPrice(invoiceTotals.taxes || 0)}
                    </p>
                </div>

                {/* GST Breakdown */}
                <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-gray-200 py-2">
                    <p className="text-neutral-600 font-medium">
                        GST Breakdown:
                    </p>
                </div>
                {Object.entries(invoiceTotals.gstBreakdown).map(
                    ([rate, { cgst, sgst }]) => (
                        <div
                            key={rate}
                            className="grid grid-cols-2 gap-y-2 text-sm border-b border-gray-200 py-1"
                        >
                            <p className="text-neutral-600 font-medium">
                                {rate}%:
                            </p>
                            <p className="text-right text-neutral-800">
                                CGST: {formatPrice(cgst)}, SGST:{' '}
                                {formatPrice(sgst)}
                            </p>
                        </div>
                    )
                )}

                {/* Round Off Section */}
                <div className="mt-3">
                    <Checkbox
                        label="Auto Round Off"
                        checked={isRoundOffEnabled}
                        onChange={handleRoundOffToggleLocal}
                    />

                    {/* TODO: to be added later  */}
                    {/* <div className="flex items-center gap-4 mt-3">
                        <Dropdown
                            options={[
                                { label: '+ Add', value: 'add' },
                                { label: '- Reduce', value: 'reduce' },
                            ]}
                            value={roundOffType}
                            onChange={(value) => setRoundOffType(value)}
                            className="border rounded-md text-sm w-28"
                        />

                        <InputField
                            type="number"
                            value={roundOffValue}
                            onChange={(value) =>
                                handleRoundOffChangeLocal(roundOffType, value)
                            }
                            className="border rounded-md text-sm w-20"
                            placeholder="Enter amount"
                        />
                    </div> */}
                </div>

                {/* Grand Total */}
                <div className="grid grid-cols-2 gap-y-2 text-sm pt-2">
                    <p className="text-neutral-900 font-bold">Grand Total:</p>
                    <div className="text-right">
                        <p className="font-bold text-primary-600 text-lg bg-primary-100 p-2 rounded-lg">
                            {formatPrice(invoiceTotals.total || 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sticky Footer Section */}
            <div className="sticky bottom-0 bg-white p-3 sm:p-4 border-t border-gray-200 z-10 shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row justify-between items-center">
                    {/* Payment Method */}
                    <div className="w-full sm:w-auto">
                        <PaymentMethodSelector
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            paymentOptions={paymentOptions}
                        />
                    </div>

                    {/* Save Button */}
                    {!isEditMode && (
                        <Button
                            label="Save Order"
                            onClick={handleSaveInvoice}
                            disabled={loading}
                            className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-lg shadow-md w-full sm:w-auto"
                        />
                    )}

                    {isEditMode && (
                        <div className="flex justify-end space-x-4">
                            <Button
                                label="Cancel"
                                variant="outline"
                                onClick={() =>
                                    router.push('/storeOS/sales/list')
                                }
                            />
                            <Button
                                label="Save Edited Changes"
                                variant="primary"
                                onClick={handleEditInvoice}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InvoiceItemManager
