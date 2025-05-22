import React, { useState, useEffect, useRef } from 'react'
import { openDB } from 'idb'
import Layout from '@/layouts/Layout'
import Card from '@/components/storeOS/Card'
import Button from '@/components/storeOS/Button'
import CreateItemModal from '@/components/storeOS/composites/CreateItemModal'
import SKUPreviewTable from '@/components/storeOS/SKUPreviewTable'
import Loader from '@/components/storeOS/Loader'
import Pagination from '@/components/storeOS/Pagination'
import { useItemIngestion } from '@/contexts/ItemIngestionProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'
import { useStoreUser } from '@/contexts/StoreUserProvider'
import Notification from '@/components/storeOS/Notification'
import Toast from '@/components/storeOS/Toast'
import SvgIcon from '@mui/material/SvgIcon'
import {
    MagnifyingGlassIcon,
    ChevronDownIcon,
    XMarkIcon,
    PlusIcon,
    ArrowDownRightIcon,
} from '@heroicons/react/24/outline'

const BarcodeIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M2 2h2v20H2V2zm4 0h1v20H6V2zm3 0h2v20H9V2zm4 0h1v20h-1V2zm3 0h2v20h-2V2zm4 0h1v20h-1V2z" />
    </SvgIcon>
)

const BRISK_CHANNEL_PLATFORM_API_URL =
    process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

const Items = () => {
    const {
        fetchSavedProducts,
        savedProducts,
        loading,
        pagination,
        page,
        pageSize,
        searchQuery,
        handlePageChange,
        clearSearchInput,
        localSearchQuery,
        handleInputChange,
    } = useItemIngestion()

    const { tenantId } = useTenantFacility()

    const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility state
    const [isLoading, setIsLoading] = useState(false) // Loader state
    const [itemPageNotification, setItemPageNotification] = useState({
        type: '',
        message: '',
    })
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const { storeStaff } = useStoreUser()
    const searchInputRef = useRef(null) // Ref for search input

    //TODO:storeStaff is undefined sometimes
    // this should be fixed after not retuning provider untill values are resolved! Need to test and remove
    const role = storeStaff?.role || 'sales_associate'
    const canEdit = role === 'sales_associate'

    // KPI Computation
    const computeStockValue = () =>
        savedProducts.reduce(
            (total, sku) =>
                total + Number(sku.stockQty) * Number(sku.sellingPrice),
            0
        )

    const computeLowStockCount = () =>
        savedProducts.filter((sku) => Number(sku.stockQty) < 10).length

    const computeItemsExpiring = () => 0 // Placeholder for now

    // Add SKUs and Refresh Data
    const handleAddSKUs = async () => {
        try {
            setIsLoading(true) // Show loader
            await fetchSavedProducts()
        } catch (error) {
            console.error('Error adding SKUs:', error)
        } finally {
            setItemPageNotification({
                type: 'success',
                message: 'Items saved successfully!',
            })
            setIsLoading(false) // Hide loader
        }
    }

    const handleUpdate = async (skuId, updatedRow) => {
        try {
            setIsLoading(true) // Show loader

            if (Array.isArray(updatedRow)) {
                // **Bulk Update Logic**
                const groupedByStyle = updatedRow.reduce((acc, sku) => {
                    const { styleCode } = sku
                    if (!acc[styleCode]) acc[styleCode] = []
                    acc[styleCode].push(sku)
                    return acc
                }, {})

                const productsPayload = Object.entries(groupedByStyle).map(
                    ([styleCode, skus]) => ({
                        name: styleCode,
                        product_id: updatedRow[0].product_id,
                        sale_channel: 'both',
                        is_active: true,
                        skus: skus.map((sku) => ({
                            sku_id: sku.id,
                            base_price: sku.mrp,
                            offer_price: sku.sellingPrice,
                            inventory: {
                                facility_id: sku.facility_id,
                                // TODO -- Not updating stocks as decrements lead to sales
                                // stock: parseFloat(sku.stockQty),
                                channel: sku.sale_channel,
                                transaction_type: 'price_update',
                            },
                        })),
                    })
                )

                const payload = {
                    tenant_id: tenantId,
                    products: productsPayload,
                }

                const response = await fetch(
                    `${BRISK_CHANNEL_PLATFORM_API_URL}/products/bulk_update`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }
                )

                if (!response.ok) throw new Error('Bulk update failed')
            } else {
                // **Single Update Logic**
                // const payload = {
                //     id: updatedRow.id,
                //     sku: {
                //         base_price: updatedRow.mrp,
                //         selling_price: updatedRow.sellingPrice,
                //     },
                //     inventory: {
                //         stock: parseFloat(updatedRow.stockQty),
                //         facility_id: updatedRow.facility_id,
                //     },
                // }

                //using bulk update api as Single Update Logic has bugs in backend like invnetory transactions report not getting updated

                const payload = {
                    tenant_id: tenantId,
                    products: [
                        {
                            // name: item.styleCode, // Style or product name
                            product_id: updatedRow.product_id, // Product ID
                            //  sale_channel: 'both', // Sale channel (can be dynamic if needed)
                            is_active: true, // Assuming the product is active
                            skus: [
                                {
                                    sku_id: updatedRow.id,
                                    custom_code: updatedRow.customCode,
                                    offer_price: updatedRow.sellingPrice,
                                    base_price: updatedRow.mrp,
                                    inventory: {
                                        // TODO -- Not updating stocks as decrements lead to sales
                                        // stock: parseFloat(updatedRow.stockQty), // Updated stock value
                                        facility_id: updatedRow.facility_id, // Facility ID
                                        transaction_type: 'price_update',
                                        //channel: item.saleChannel || 'offline', // Sale channel
                                    },
                                },
                            ],
                        },
                    ],
                }

                // const response = await fetch(
                //     `${BRISK_CHANNEL_PLATFORM_API_URL}/sku_with_inventory/`,
                //     {
                //         method: 'PUT',
                //         headers: { 'Content-Type': 'application/json' },
                //         body: JSON.stringify(payload),
                //     }
                // )

                // Make the API request
                const response = await fetch(
                    `${BRISK_CHANNEL_PLATFORM_API_URL}/products/bulk_update`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }
                )

                if (!response.ok) throw new Error('Single update failed')
            }

            // Refresh data from the backend
            await fetchSavedProducts()

            setToastMessage('Update successful!')
            setShowToast(true)
        } catch (error) {
            console.error('Error updating SKU(s):', error)
            setToastMessage(
                'An unexpected error occurred during the update, please try again'
            )
            setShowToast(true)
        } finally {
            setIsLoading(false) // Hide loader
        }
    }

    const disableSKU = async (skuId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/${skuId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sku: { is_disabled: true },
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(`Failed to disable SKU ${skuId}`)
            }

            const data = await response.json()
            console.log(`SKU ${skuId} disabled successfully:`, data)

            // Optional: Refresh the SKU data after disabling
            await fetchSavedProducts()
        } catch (error) {
            console.error(`Error disabling SKU ${skuId}:`, error)
        }
    }

    const disableStyles = async (productId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/products/${productId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        product: {
                            is_active: false,
                        },
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(
                    `Failed to disable style (product) ${productId}`
                )
            }

            const data = await response.json()
            console.log(
                `Style (Product) ${productId} disabled successfully:`,
                data
            )

            // Optional: Refresh the SKU data after disabling

            const refreshedData = await fetchSavedProducts()
        } catch (error) {
            console.error(
                `Error disabling style (product) ${productId}:`,
                error
            )
        }
    }

    return (
        <Layout title="Items">
            {(isLoading || loading) && <Loader />}
            {/* Toast for feedback */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)} // Close toast
                />
            )}
            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-6">
                <Card
                    title="Total Styles In Store"
                    value={pagination?.total_entries}
                    bgColor="bg-white"
                    borderColor="border-gray-200"
                    shadow="shadow-md hover:shadow-lg"
                    padding="p-4"
                    rounded="rounded-lg"
                />
                {/* <Card
                    title="Low Stock"
                    value={computeLowStockCount()}
                    bgColor="bg-white"
                    borderColor="border-gray-200"
                    shadow="shadow-md hover:shadow-lg"
                    padding="p-4"
                    rounded="rounded-lg"
                />
                <Card
                    title="Items Expiring (30 days)"
                    value={computeItemsExpiring()}
                    bgColor="bg-white"
                    borderColor="border-gray-200"
                    shadow="shadow-md hover:shadow-lg"
                    padding="p-4"
                    rounded="rounded-lg"
                /> */}
            </div>

            {/* Search and Barcode Section */}
            <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-md">
                <div className="relative w-full sm:flex-1">
                    {/* Full width on mobile, flex-1 on larger screens */}
                    <input
                        type="text"
                        ref={searchInputRef}
                        placeholder="Search Style Code or Display Name (2+ chars)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-300 focus:outline-none"
                        value={localSearchQuery}
                        onChange={(e) =>
                            handleInputChange(
                                e.target?.value.toLowerCase().trim()
                            )
                        }
                    />
                    {!searchQuery && (
                        <MagnifyingGlassIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    )}
                    {searchQuery && (
                        <XMarkIcon
                            className="absolute right-3 top-3 w-5 h-5 text-gray-400 cursor-pointer"
                            onClick={clearSearchInput}
                        />
                    )}
                </div>
                <Button
                    label="Scan Barcode"
                    iconBefore={() => <BarcodeIcon className="mr-2" />}
                    onClick={() => searchInputRef.current.focus()} // Focus on input
                    variant="primary"
                    className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-lg shadow-md w-full sm:w-auto"
                />
                {/* <div className="min-w-[180px] max-w-sm">
                    <Button
                        label="Show Low Stock"
                        iconBefore={() => (
                            <ArrowDownRightIcon className="w-5 h-5 text-red-500" />
                        )}
                        variant="outline"
                        size="medium"
                        onClick={() =>
                            setFilteredData(
                                savedProducts.filter(
                                    (sku) => Number(sku.stockQty) < 2
                                )
                            )
                        }
                    />
                </div> */}
                {/* <Button
                    label="Bulk Actions"
                    iconAfter={() => (
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                    variant="secondary"
                    size="medium"
                /> */}
                {!canEdit && (
                    <Button
                        label="Create Item"
                        iconBefore={() => (
                            <PlusIcon className="w-5 h-5 text-white" />
                        )}
                        variant="primary"
                        size="medium"
                        onClick={() => setIsModalOpen(true)} // Open modal
                    />
                )}
            </div>

            {itemPageNotification.message && (
                <Notification
                    message={itemPageNotification.message}
                    type={itemPageNotification.type}
                    onClose={() =>
                        setItemPageNotification({ type: '', message: '' })
                    }
                />
            )}

            {/* SKU Table */}
            <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-4 overflow-x-auto border border-gray-200">
                <SKUPreviewTable
                    data={savedProducts}
                    onUpdate={handleUpdate}
                    disableSKU={disableSKU}
                    disableStyles={disableStyles}
                    isPreview={false}
                    hideActions={canEdit}
                />
            </div>

            {/* Pagination */}
            {savedProducts.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={pagination?.total_pages || 1}
                    pageSize={pageSize} // Pass pageSize explicitly
                    onPageChange={handlePageChange}
                />
            )}

            {/* Create Item Modal */}
            <CreateItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddSKUs}
            />
        </Layout>
    )
}

export default Items
