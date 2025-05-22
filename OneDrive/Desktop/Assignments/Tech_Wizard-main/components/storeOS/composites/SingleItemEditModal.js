import React, { useState, useEffect } from 'react'
import Modal from '../Modal'

const SingleItemEditModal = ({ isOpen, onClose, skuData, onSave }) => {
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        skuId: '',
        mrp: 0,
        sellingPrice: 0,
        stockQty: 0,
        offerPercentage: 0,
    })

    useEffect(() => {
        if (skuData) {
            setFormData({
                skuId: skuData.skuId,
                mrp: skuData.mrp,
                sellingPrice: skuData.sellingPrice,
                stockQty: skuData.stockQty,
                offerPercentage: skuData.offerPercentage || 0,
            })
        }
    }, [skuData])

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
        setError('') // Clear error on input
    }

    const validateFields = () => {
        if (
            formData.mrp &&
            formData.sellingPrice &&
            parseFloat(formData.mrp) < parseFloat(formData.sellingPrice)
        ) {
            setError('MRP must be greater than Selling Price.')
            return false
        }
        return true
    }

    const handleSave = () => {
        if (!validateFields()) return
        onSave(formData)
        onClose() // Close modal after saving
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="medium"
            header={
                <h2 className="text-lg font-bold">
                    Edit Item: {formData.skuId}
                </h2>
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
                        Save
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
                <div>
                    <label className="block text-sm font-medium mb-1">
                        MRP
                    </label>
                    <input
                        type="number"
                        value={formData.mrp}
                        onChange={(e) => handleChange('mrp', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Selling Price
                    </label>
                    <input
                        type="number"
                        value={formData.sellingPrice}
                        onChange={(e) =>
                            handleChange('sellingPrice', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                </div>
                {/* <div>
                    <label className="block text-sm font-medium mb-1">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        value={formData.stockQty}
                        onChange={(e) =>
                            handleChange('stockQty', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                </div> */}
                {/* <div>
                    <label className="block text-sm font-medium mb-1">
                        Offer %
                    </label>
                    <input
                        type="number"
                        value={formData.offerPercentage}
                        onChange={(e) =>
                            handleChange('offerPercentage', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                </div> */}
            </div>
        </Modal>
    )
}

export default SingleItemEditModal
