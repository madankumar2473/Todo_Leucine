import React, { useState, useRef } from 'react'
import Layout from '@/layouts/Layout'
import Toast from '@/components/storeOS/Toast'
import Button from '@/components/storeOS/Button'
import { BarcodeIcon } from '@/components/storeOS/composites/InvoiceItemManager'
import { formatPrice } from '@/utils/util'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

// 1) Import the new PurchaseEntryProvider + Hook:
import {
    PurchaseEntryProvider,
    usePurchaseEntry,
} from '@/contexts/PurchaseEntryProvider'

const BRISK_CHANNEL_PLATFORM_API_URL =
    process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

/**
 *  Sub-component that implements your domain logic & UI
 *  (like scanning input, table, saving stock, refreshing, etc.)
 */
const PurchaseEntryContent = () => {
    const { tenantId, facilityId } = useTenantFacility()

    // 2) Destructure everything from the context:
    const {
        state,
        fetchSKUByBarcode,
        updateItemQty,
        removeItem,
        updateItemField,
        markFailedItems,
        setScannedItems,
        clearError,
    } = usePurchaseEntry()

    // 3) Pull what you need from `state`
    const { scannedItems, error } = state

    const [toastMessage, setToastMessage] = useState('')
    const [barcode, setBarcode] = useState('')
    const barcodeInputRef = useRef(null)

    /**
     * handleBarcodeChange:
     * - If length=12 => fetch from context.
     */
    const handleBarcodeChange = async (e) => {
        const value = e.target.value.trim()
        setBarcode(value)

        if (value.length === 12) {
            const result = await fetchSKUByBarcode(value)
            if (result?.error === 'rapid_scan') {
                setToastMessage('Scan repeated too quickly, please scan again')
            } else if (result?.error === 'already_fetching') {
                setToastMessage('Please wait, we are getting the SKU for you')
            } else if (result?.error === 'facility_mismatch') {
                setToastMessage(
                    'This SKU is not available for the selected facility.'
                )
            } else if (result?.success && !result.alreadyInList) {
                setToastMessage('Item scanned successfully!')
            } else if (result?.success && result.alreadyInList) {
                setToastMessage('Quantity incremented for existing item!')
            }
            setBarcode('') // clear input
        }
    }

    /**
     * Decrement item quantity
     */
    const decrementQty = (barcodeVal) => {
        const item = scannedItems.find((i) => i.barcode === barcodeVal)
        if (!item) return
        const newQty = Math.min(0, item.additionalQty - 1)
        updateItemQty(barcodeVal, newQty)
    }

    /**
     * Increment item quantity
     */
    const incrementQty = (barcodeVal) => {
        const item = scannedItems.find((i) => i.barcode === barcodeVal)
        if (!item) return
        updateItemQty(barcodeVal, item.additionalQty + 1)
    }

    /**
     * Removing an item by barcode
     */
    const handleRemoveItem = (barcodeVal) => {
        removeItem(barcodeVal)
    }

    /**
     * (Your existing domain logic)
     * handleStockUpdate: POSTs final stock to the backend for one item
     */
    const handleStockUpdate = async (item) => {
        try {
            const finalStock = item.existingStock + item.additionalQty
            const payload = {
                tenant_id: tenantId,
                products: [
                    {
                        product_id: item.product_id,
                        is_active: true,
                        skus: [
                            {
                                sku_id: item.id,
                                custom_code: item.customCode,
                                inventory: {
                                    stock: finalStock,
                                    facility_id: facilityId,
                                    channel: item.saleChannel || 'offline',
                                    transaction_type: 'stock_adjustment',
                                },
                            },
                        ],
                    },
                ],
            }

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/products/bulk_update`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            )

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(
                    `Failed to update stock for ${item.displayName}: ${
                        errorText || response.statusText
                    }`
                )
            }
            return { success: true, item }
        } catch (error) {
            return { success: false, item, error }
        }
    }

    /**
     * refreshStockFromBackend:
     *  - Re-fetch each item from your SKU API
     *  - Reset additionalQty to 0
     *  - Then dispatch SET_SCANNED_ITEMS to replace entire scannedItems
     */
    const refreshStockFromBackend = async () => {
        try {
            const updatedItems = await Promise.all(
                scannedItems.map(async (item) => {
                    const res = await fetch(
                        `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/search?includes=inventory.facility&barcode=${item.barcode}`
                    )
                    if (!res.ok) throw new Error('Failed to refresh stock')

                    const data = await res.json()
                    const updatedSKU = data?.data?.[0]
                    if (!updatedSKU) throw new Error('Item data is empty')

                    return {
                        ...item,
                        existingStock: updatedSKU.inventory?.[0]?.stock || 0,
                        additionalQty: 0, // Reset
                        // preserve updateStatus if you want
                        updateStatus: item.updateStatus,
                    }
                })
            )
            // Overwrite scannedItems in the reducer
            setScannedItems(updatedItems)
        } catch (error) {
            setToastMessage('Error refreshing stock.')
        }
    }

    /**
     * saveAllChanges:
     *  - For each item, call handleStockUpdate
     *  - If any fail, mark them as 'failed'
     *  - If all succeed, clear or reset scannedItems
     */
    const saveAllChanges = async () => {
        const results = await Promise.all(
            scannedItems.map((item) => handleStockUpdate(item))
        )

        const failedUpdates = results.filter((r) => !r.success)
        if (failedUpdates.length > 0) {
            const errorMessages = failedUpdates
                .map((f) => `${f.item.displayName}`)
                .join('\n')

            setToastMessage(
                `Some updates failed, please update these skus again:\n${errorMessages}`
            )

            // Mark them as failed in the reducer
            const failedBarcodes = failedUpdates.map((f) => f.item.barcode)
            markFailedItems(failedBarcodes)

            // Then refresh stock from the backend so you see latest
            await refreshStockFromBackend()
        } else {
            // All good, clear scannedItems
            setScannedItems([])
            setToastMessage('All changes saved successfully!')
        }
    }

    return (
        <Layout title="Purchase Entry">
            <div className="sticky top-0 z-10 bg-white shadow rounded p-4">
                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="text"
                        ref={barcodeInputRef}
                        value={barcode}
                        onChange={handleBarcodeChange}
                        placeholder="Scan or Enter Barcode"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                    <Button
                        label="Scan Barcode"
                        iconBefore={() => <BarcodeIcon className="mr-2" />}
                        onClick={() => barcodeInputRef.current?.focus()}
                    />
                </div>

                {/* TABLE OF SCANNED ITEMS */}
                {scannedItems.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-primary-100">
                                <tr>
                                    <th className="p-2 border text-left">
                                        Display Name
                                    </th>
                                    <th className="p-2 border text-left">
                                        Custom Code
                                    </th>
                                    <th className="p-2 border text-left">
                                        Barcode
                                    </th>
                                    <th className="p-2 border text-center">
                                        MRP
                                    </th>
                                    <th className="p-2 border text-center">
                                        Selling Price
                                    </th>
                                    <th className="p-2 border text-center">
                                        Existing Stock
                                    </th>
                                    <th className="p-2 border text-center">
                                        Additional Qty
                                    </th>
                                    <th className="p-2 border text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {scannedItems.map((item) => (
                                    <tr
                                        key={item.barcode}
                                        className={`hover:bg-gray-100 ${
                                            item.updateStatus === 'failed'
                                                ? 'bg-red-50'
                                                : ''
                                        }`}
                                    >
                                        <td className="p-2 border text-left">
                                            {item.displayName}
                                        </td>
                                        <td className="p-2 border text-left">
                                            <input
                                                type="text"
                                                value={item.customCode || ''}
                                                onChange={(e) =>
                                                    // Update via the reducer's action
                                                    updateItemField(
                                                        item.barcode,
                                                        'customCode',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 py-1 border rounded focus:ring-primary-500 focus:outline-none"
                                            />
                                        </td>
                                        <td className="p-2 border text-left">
                                            {item.barcode}
                                        </td>
                                        <td className="p-2 border text-center">
                                            {formatPrice(item.mrp)}
                                        </td>
                                        <td className="p-2 border text-center">
                                            {formatPrice(item.sellingPrice)}
                                        </td>
                                        <td className="p-2 border text-center">
                                            {item.existingStock}
                                        </td>
                                        <td className="p-2 border text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    label="-"
                                                    size="small"
                                                    onClick={() =>
                                                        decrementQty(
                                                            item.barcode
                                                        )
                                                    }
                                                />
                                                {item.additionalQty}
                                                <Button
                                                    label="+"
                                                    size="small"
                                                    onClick={() =>
                                                        incrementQty(
                                                            item.barcode
                                                        )
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td className="p-2 border text-right">
                                            <Button
                                                label="Remove"
                                                size="small"
                                                variant="outline"
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        item.barcode
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-right">
                            <Button
                                label="Save All"
                                size="medium"
                                onClick={saveAllChanges}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        No items scanned yet.
                    </div>
                )}

                {/* TOAST / ERRORS */}
                {(toastMessage || error) && (
                    <Toast
                        message={toastMessage || error}
                        onClose={() => {
                            setToastMessage('')
                            if (error) clearError()
                        }}
                    />
                )}
            </div>
        </Layout>
    )
}

/**
 * The actual default export which wraps PurchaseEntryContent
 * in the PurchaseEntryProvider
 */
const PurchaseEntry = () => {
    return (
        <PurchaseEntryProvider>
            <PurchaseEntryContent />
        </PurchaseEntryProvider>
    )
}

export default PurchaseEntry
