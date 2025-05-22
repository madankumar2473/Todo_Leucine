import React, { useState, useEffect } from 'react'
import Modal from '../Modal'

const BulkEditModal = ({ isOpen, onClose, onSave, skus }) => {
    const [fields, setFields] = useState({
        stockQty: '',
        mrp: '',
        sellingPrice: '',
    })

    const [error, setError] = useState('')

    // Prepopulate fields with the first SKU's data
    useEffect(() => {
        if (skus && skus.length > 0) {
            setFields({
                stockQty: skus[0].stockQty || '', // Default to the first SKU's stockQty
                mrp: skus[0].mrp || '', // Default to the first SKU's MRP
                sellingPrice: skus[0].sellingPrice || '', // Default to the first SKU's sellingPrice
            })
        }
    }, [skus])

    const handleChange = (field, value) => {
        setFields({ ...fields, [field]: value })
        setError('') // Clear error on input
    }

    const validateFields = () => {
        if (
            fields.mrp &&
            fields.sellingPrice &&
            parseFloat(fields.mrp) < parseFloat(fields.sellingPrice)
        ) {
            setError('MRP must be greater than Selling Price.')
            return false
        }
        return true
    }

    const handleSave = () => {
        if (!validateFields()) return

        // Merge updated fields into each SKU
        const updatedSKUs = skus.map((sku) => ({
            ...sku,
            ...Object.keys(fields).reduce((acc, key) => {
                if (fields[key] !== '') acc[key] = fields[key] // Only update non-empty fields
                return acc
            }, {}),
        }))

        onSave(updatedSKUs)
        setFields({ stockQty: '', mrp: '', sellingPrice: '' }) // Reset form fields
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="medium"
            header={
                <div>
                    <h2 className="text-lg font-bold">Bulk Edit Items</h2>
                    <p className="text-sm text-gray-500">
                        Editing <strong>{skus.length}</strong> SKUs
                    </p>
                </div>
            }
            footer={
                <>
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
                {/* <div>
                    <label className="block text-sm font-medium mb-1">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        value={fields.stockQty}
                        onChange={(e) =>
                            handleChange('stockQty', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="Enter new stock quantity"
                    />
                </div> */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        MRP
                    </label>
                    <input
                        type="number"
                        value={fields.mrp}
                        onChange={(e) => handleChange('mrp', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="Enter new MRP"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Selling Price
                    </label>
                    <input
                        type="number"
                        value={fields.sellingPrice}
                        onChange={(e) =>
                            handleChange('sellingPrice', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="Enter new selling price"
                    />
                </div>
            </div>
        </Modal>
    )
}

export default BulkEditModal
