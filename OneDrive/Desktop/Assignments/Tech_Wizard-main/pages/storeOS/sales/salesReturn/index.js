import React, { useState, useRef } from 'react'
import Layout from '@/layouts/Layout'
import Toast from '@/components/storeOS/Toast'
import Button from '@/components/storeOS/Button'
import { BarcodeIcon } from '@/components/storeOS/composites/InvoiceItemManager'
import { formatPrice } from '@/utils/util'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const BRISK_CHANNEL_PLATFORM_API_URL =
    process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

const SalesReturn = () => {
    const { tenantId, facilityId } = useTenantFacility()
    const [scannedItems, setScannedItems] = useState([])
    const [toastMessage, setToastMessage] = useState('')
    const [barcode, setBarcode] = useState('')
    const barcodeInputRef = useRef(null)

    const handleBarcodeChange = (e) => {
        const value = e.target.value.trim()
        setBarcode(value)

        if (value.length === 12) {
            handleBarcodeScan(value)
        }
    }

    const handleBarcodeScan = async (barcodeValue) => {
        if (!barcodeValue || barcodeValue.length !== 12) {
            setToastMessage('Invalid barcode! Must be 12 characters.')
            return
        }

        const existingItem = scannedItems.find(
            (item) => item.barcode === barcodeValue
        )
        if (existingItem) {
            setScannedItems((prevItems) =>
                prevItems.map((i) =>
                    i.barcode === barcodeValue
                        ? { ...i, returnQty: i.returnQty + 1 }
                        : i
                )
            )
            setToastMessage('Quantity incremented for existing item!')
            setBarcode('')
            return
        }

        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/search?includes=inventory.facility&barcode=${barcodeValue}`
            )

            if (!response.ok) throw new Error('Item not found')

            const data = await response.json()
            const item = data?.data[0]

            if (!item) throw new Error('Item data is empty')

            const matchingInventory = item.inventory.find(
                (inv) => inv.facility_id === facilityId
            )

            if (!matchingInventory) {
                setToastMessage(
                    `This item is not available for the selected facility.`
                )
                return
            }

            const existingStock = matchingInventory.stock || 0

            setScannedItems((prevItems) => [
                ...prevItems,
                {
                    displayName: item.display_name,
                    customCode: item.custom_code,
                    barcode: item.barcode,
                    mrp: item.base_price,
                    sellingPrice: item.offer_price,
                    existingStock,
                    returnQty: 1, // Start with 1
                    facilityId: facilityId,
                    id: item.id,
                    product_id: item.product_id,
                },
            ])
            setToastMessage('Item scanned successfully!')
            setBarcode('')
        } catch (error) {
            setToastMessage(error.message || 'Error fetching item details')
        }
    }

    const handleStockUpdate = async (item) => {
        try {
            const finalStock = item.existingStock + item.returnQty

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
                                    transaction_type: 'sales_return',
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

    const refreshStockFromBackend = async () => {
        try {
            const updatedItems = await Promise.all(
                scannedItems.map(async (item) => {
                    const response = await fetch(
                        `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/search?includes=inventory.facility&barcode=${item.barcode}`
                    )
                    if (!response.ok) throw new Error('Failed to refresh stock')

                    const data = await response.json()
                    const updatedItem = data?.data[0]
                    if (!updatedItem) throw new Error('Item data is empty')

                    return {
                        ...item,
                        existingStock: updatedItem.inventory?.[0]?.stock || 0,
                        returnQty: 0, // Reset returnQty
                        updateStatus: 'failed',
                    }
                })
            )

            setScannedItems(updatedItems)
        } catch (error) {
            setToastMessage('Error refreshing stock.')
        }
    }

    const saveAllChanges = async () => {
        const results = await Promise.all(
            scannedItems.map((item) => handleStockUpdate(item))
        )

        const failedUpdates = results.filter((res) => !res.success)

        if (failedUpdates.length > 0) {
            const errorMessages = failedUpdates
                .map((failure) => `${failure.item.displayName}`)
                .join('\n')

            setToastMessage(
                `Some updates failed, please update these skus again:\n${errorMessages}`
            )

            setScannedItems((prevItems) =>
                prevItems.map((item) => {
                    const failed = failedUpdates.find(
                        (failure) => failure.item.barcode === item.barcode
                    )
                    if (failed) {
                        return { ...item, updateStatus: 'failed' }
                    }
                    return item
                })
            )

            await refreshStockFromBackend()
        } else {
            setScannedItems([])
            setToastMessage('All changes saved successfully!')
        }
    }

    const removeItem = (barcode) => {
        setScannedItems((prevItems) =>
            prevItems.filter((item) => item.barcode !== barcode)
        )
    }

    return (
        <Layout title="Sales Return">
            <div className="bg-white shadow rounded p-4">
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
                        onClick={() => barcodeInputRef.current.focus()}
                    />
                </div>

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
                                        Return Qty
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
                                            {item.customCode}
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
                                                        setScannedItems(
                                                            (prevItems) =>
                                                                prevItems.map(
                                                                    (i) =>
                                                                        i.barcode ===
                                                                        item.barcode
                                                                            ? {
                                                                                  ...i,
                                                                                  returnQty:
                                                                                      Math.max(
                                                                                          0,
                                                                                          i.returnQty -
                                                                                              1
                                                                                      ),
                                                                              }
                                                                            : i
                                                                )
                                                        )
                                                    }
                                                />
                                                {item.returnQty}
                                                <Button
                                                    label="+"
                                                    size="small"
                                                    onClick={() =>
                                                        setScannedItems(
                                                            (prevItems) =>
                                                                prevItems.map(
                                                                    (i) =>
                                                                        i.barcode ===
                                                                        item.barcode
                                                                            ? {
                                                                                  ...i,
                                                                                  returnQty:
                                                                                      i.returnQty +
                                                                                      1,
                                                                              }
                                                                            : i
                                                                )
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
                                                    removeItem(item.barcode)
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

                {toastMessage && (
                    <Toast
                        message={toastMessage}
                        onClose={() => setToastMessage('')}
                    />
                )}
            </div>
        </Layout>
    )
}

export default SalesReturn
