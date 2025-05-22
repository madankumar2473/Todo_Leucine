import React, { useState, useEffect, useRef } from 'react'
import SKUPreviewTable from '@/components/storeOS/SKUPreviewTable'
import Modal from '@/components/storeOS/Modal'
import Button from '@/components/storeOS/Button'
import Dropdown from '@/components/storeOS/Dropdown'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import { useItemIngestion } from '@/contexts/ItemIngestionProvider'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Loader from '@/components/storeOS/Loader'
import {PlusIcon} from '@heroicons/react/24/outline'
import CreateItemModal from '@/components/storeOS/composites/CreateItemModal' // Import the CreateItemModal


const AddItemWhileSale = ({ isOpen, onClose,onCreateItem }) => {
    const { addSKUToInvoice } = useSalesInvoice()
    const {
        savedProducts,
        loading,
        searchQuery,
        clearSearchInput,
        localSearchQuery,
        handleInputChange,
    } = useItemIngestion()

    const [selectedCategory, setSelectedCategory] = useState('')
    const [categories, setCategories] = useState([
        { label: 'All Categories', value: '' },
        { label: 'Men', value: 'MEN' },
        { label: 'Women', value: 'WOMEN' },
    ])
    const [selectedSKUs, setSelectedSKUs] = useState([]) // Track selected SKUs
    const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false) // Modal state
    const searchInputRef = useRef(null) // Ref for search input

    // // Search and Filter Handlers
    // useEffect(() => {
    //     const filtered = skuData.filter((sku) => {
    //         const matchesSearch =
    //             sku.styleCode
    //                 .toLowerCase()
    //                 .includes(searchQuery.toLowerCase()) ||
    //             sku.skuId.toLowerCase().includes(searchQuery.toLowerCase())
    //         const matchesCategory =
    //             selectedCategory === '' || sku.category === selectedCategory
    //         return matchesSearch && matchesCategory
    //     })
    //     setFilteredData(filtered)
    // }, [searchQuery, selectedCategory, skuData])

    // Handle the Create Item button click
    const handleCreateItem = () => {
        setIsCreateItemModalOpen(true) // Open CreateItemModal
    }

    const handleDone = () => {
        const mappedSKUs = selectedSKUs.map((sku) => ({
            id: sku.id,
            display_name: sku.display_name || sku.skuId,
            base_price: parseFloat(sku.mrp),
            offer_price: parseFloat(sku.sellingPrice),
            quantity: sku.quantity || 1,
            size: sku.size,
            color: sku.color,
            custom_code: sku.skuId,
            hsn_code_id: sku.hsnCode,
        }))
        mappedSKUs.forEach((sku) => addSKUToInvoice({ sku }))
        onClose()
    }

    return (
        <>
            {loading && <Loader />}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                header={
                    <h3 className="text-xl font-bold text-center text-neutral-800">
                        Add Items
                    </h3>
                }
                className="max-w-screen-lg mx-auto"
            >
                <p className="text-sm text-neutral-600 text-center mb-4">
                    Select items to add to your invoice. You can search or
                    filter by category.
                </p>
                <div className="p-4 space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="relative flex-1 min-w-[250px] max-w-sm">
                            <input
                                type="text"
                                ref={searchInputRef}
                                placeholder="Search by Style Code or Display Name"
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

                        {/* Create Item Button */}

                        {/* Create Item Button */}
                        <Button
                            label="Create Item"
                            iconBefore={() => (
                                <PlusIcon className="w-5 h-5 text-white" />
                            )} // Pass icon as function
                            variant="primary"
                            onClick={handleCreateItem} // Pass function here
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md"
                        />
                        {/* <Dropdown
                        triggerLabel="Select Categories"
                        options={categories}
                        value={selectedCategory}
                        onSelect={(value) => setSelectedCategory(value)}
                        width="w-full"
                    /> */}
                    </div>

                    {/* SKU Preview Table */}
                    <div className="max-h-[500px] overflow-y-auto border border-neutral-300 rounded-lg">
                        <SKUPreviewTable
                            data={savedProducts}
                            showCheckbox={true} // Enable checkboxes
                            onSelect={setSelectedSKUs} // Update selected SKUs
                            isPreview={true}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 bg-white py-3 px-4 border-t border-neutral-300 z-10 shadow-lg">
                        <div className="flex justify-end gap-4">
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onClick={onClose}
                                className="px-6 py-2"
                            />
                            <Button
                                label="Done"
                                variant="primary"
                                onClick={handleDone}
                                className="px-6 py-2"
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* CreateItemModal */}
            <CreateItemModal
                isOpen={isCreateItemModalOpen}
                onClose={() => setIsCreateItemModalOpen(false)} // Close modal on close
                onSave={(newItem) => {
                    // Handle the newly created item here (optional: update savedProducts)
                    setIsCreateItemModalOpen(false) // Close modal after save
                }}
            />
        </>
    )
}

export default AddItemWhileSale
