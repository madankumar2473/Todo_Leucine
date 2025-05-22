import React, { useState, useEffect } from 'react'
import Modal from '@/components/storeOS/Modal'
import InputField from '@/components/storeOS/InputField'
import Button from '@/components/storeOS/Button'
import Toast from '@/components/storeOS/Toast'
import Dropdown from '@/components/storeOS/Dropdown'
import { useExpenditure } from '@/contexts/ExpenditureProvider'
import { formatPrice } from '@/utils/util'

const CreateExpenditureModal = ({ isOpen, onClose, initialData }) => {
    const { createExpenditure, updateExpenditure, loading } = useExpenditure()

    const [formData, setFormData] = useState({
        category: '',
        payment_type: '',
        expenditure_items: [],
    })
    const [currentItem, setCurrentItem] = useState({
        item_name: '',
        item_type: '',
        quantity: 1,
        price: '',
    })
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                category: '',
                payment_type: '',
                expenditure_items: [],
            })
            setToastMessage('')
        }
    }, [initialData])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleItemChange = (field, value) => {
        setCurrentItem((prev) => ({ ...prev, [field]: value }))
    }

    const addItem = () => {
        const { item_name, quantity, price } = currentItem
        if (!item_name) {
            setToastMessage('Item Name is required.')
            setShowToast(true)
            return
        }
        if (!price) {
            setToastMessage('Price is required.')
            setShowToast(true)
            return
        }
        setFormData((prev) => ({
            ...prev,
            expenditure_items: [...prev.expenditure_items, currentItem],
        }))
        setCurrentItem({
            item_name: '',
            item_type: '',
            quantity: 1,
            price: '',
        })
    }

    const removeItem = (index) => {
        setFormData((prev) => ({
            ...prev,
            expenditure_items: prev.expenditure_items.filter(
                (_, i) => i !== index
            ),
        }))
    }

    const handleSubmit = async () => {
        const { category, payment_type } = formData

        if (!category) {
            setToastMessage('Category is required.')
            setShowToast(true)
            return
        }
        if (!payment_type) {
            setToastMessage('Payment Mode is required.')
            setShowToast(true)
            return
        }
        const action = initialData ? updateExpenditure : createExpenditure
        const result = await action(formData)

        if (result.success) {
            setFormData({
                category: '',
                payment_type: '',
                expenditure_items: [],
            })
            setToastMessage('Expenditure saved successfully.')
            setTimeout(() => {
                onClose()
            }, 2000) // 2-second delay for toast visibility
        } else {
            setToastMessage('Failed to save expenditure.')
        }
        setShowToast(true)
    }

    const categoryOptions = [
        { label: 'Printing & Stationery', value: 'Printing & Stationery' },
        { label: 'Repair & Maintenance', value: 'Repair & Maintenance' },
        { label: 'Transportation', value: 'Transportation' },
        { label: 'Rent Expense', value: 'Rent Expense' },
        { label: 'Utilities', value: 'Utilities' },
        { label: 'Food and Beverages', value: 'Food and Beverages' },
        { label: 'Employee Salaries', value: 'Employee Salaries' },
        { label: 'Miscellaneous', value: 'Miscellaneous' },
    ]

    const paymentOptions = [
        { label: 'Cash', value: 'cash' },
        { label: 'Card', value: 'card' },
        { label: 'UPI', value: 'upi' },
    ]

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="large"
            header={
                <h3 className="text-lg font-bold">
                    {initialData ? 'Edit Expenditure' : 'Create Expenditure'}
                </h3>
            }
            footer={
                <div className="flex justify-end space-x-4">
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={onClose}
                    />
                    <Button
                        label={loading ? 'Saving...' : 'Save'}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    />
                </div>
            }
        >
            <div className="space-y-6">
                {/* Category Field */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Category
                    </label>
                    <Dropdown
                        triggerLabel={formData.category || 'Select Category'}
                        options={categoryOptions}
                        onSelect={(option) =>
                            handleInputChange('category', option.value)
                        }
                        className="w-full"
                    />
                </div>

                {/* Payment Mode Field */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Payment Mode
                    </label>
                    <Dropdown
                        triggerLabel={
                            formData.payment_type || 'Select Payment Mode'
                        }
                        options={paymentOptions}
                        onSelect={(option) =>
                            handleInputChange('payment_type', option.value)
                        }
                        className="w-full"
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            handleInputChange('description', e.target.value)
                        }
                        placeholder="Enter description"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                </div>

                {/* Add Item Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
                    <h4 className="text-md font-bold text-primary-700">
                        Add Items
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                        <InputField
                            placeholder="Item Name"
                            value={currentItem.item_name}
                            onChange={(e) => handleItemChange('item_name', e)}
                        />
                        <InputField
                            placeholder="Item Type"
                            value={currentItem.item_type}
                            onChange={(e) => handleItemChange('item_type', e)}
                        />
                        <InputField
                            placeholder="Quantity"
                            type="number"
                            value={currentItem.quantity}
                            onChange={(e) => handleItemChange('quantity', e)}
                        />
                        <InputField
                            placeholder="Price"
                            type="number"
                            value={currentItem.price}
                            onChange={(e) => handleItemChange('price', e)}
                        />
                    </div>
                    <Button
                        label="Add Item"
                        variant="primary"
                        onClick={addItem}
                    />
                </div>

                {/* Items Table */}
                {formData.expenditure_items.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">
                                        Item Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Item Type
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Quantity
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Price
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.expenditure_items.map(
                                    (item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-2 border">
                                                {item.item_name}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.item_type || '-'}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {formatPrice(item.price)}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <Button
                                                    label="Remove"
                                                    variant="outline"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Toast for notifications */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}
        </Modal>
    )
}

export default CreateExpenditureModal
