import React, { useState } from 'react'
import MultiSelectDropdown from '../MultiSelectDropdown'
import Notification from '../Notification'

const SellInStoreTab = React.forwardRef(
    ({ data, setData, setNotification }, ref) => {
        const availableSizes = [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            '3XL',
            '4XL',
            '5XL',
            '28',
            '30',
            '32',
            '34',
            '36',
            '38',
            '40',
            '42',
            '44',
            '46',
            '48',
            'NA',
        ]

        React.useImperativeHandle(ref, () => ({
            validateAndGetData: () => {
                // Missing fields validation
                if (!data.styleCode) {
                    setNotification({
                        type: 'error',
                        message: 'Style Code is required.',
                    })
                    return null
                }
                if (data.sizes.length === 0) {
                    setNotification({
                        type: 'error',
                        message: 'Please select at least one size.',
                    })
                    return null
                }
                if (!data.mrp) {
                    setNotification({
                        type: 'error',
                        message: 'MRP is required.',
                    })
                    return null
                }
                if (!data.sellingPrice) {
                    setNotification({
                        type: 'error',
                        message: 'Selling Price is required.',
                    })
                    return null
                }
                if (Number(data.sellingPrice) > Number(data.mrp)) {
                    setNotification({
                        type: 'error',
                        message: 'Selling Price cannot be greater than MRP.',
                    })
                    return null
                }
                if (!data.stockQty) {
                    setNotification({
                        type: 'error',
                        message: 'Stock Quantity is required.',
                    })
                    return null
                }
                if (data.category.length === 0) {
                    setNotification({
                        type: 'error',
                        message: 'Please select at least one category.',
                    })
                    return null
                }
                if (data.hsnCode.length === 0) {
                    setNotification({
                        type: 'error',
                        message: 'Please select an HSN Code.',
                    })
                    return null
                }

                // Clear notifications if validation passes
                setNotification({ type: '', message: '' })

                return {
                    styleCode: data.styleCode,
                    colors: data.colors,
                    sizes: data.sizes,
                    mrp: data.mrp,
                    sellingPrice: data.sellingPrice,
                    stockQty: data.stockQty,
                    category: data.category,
                    hsnCode: data.hsnCode,
                }
            },
            hasStarted: () => {
                // Check if any data has been entered
                return (
                    data.styleCode ||
                    data.colors.length > 0 ||
                    data.sizes.length > 0 ||
                    data.mrp ||
                    data.sellingPrice ||
                    data.stockQty ||
                    data.category.length > 0 ||
                    data.hsnCode.length > 0
                )
            },
        }))

        const handleAddNewColor = (newColor) => {
            if (
                newColor &&
                typeof newColor === 'object' &&
                newColor.label &&
                newColor.value
            ) {
                const formattedColor = {
                    value: newColor.value.toLowerCase().trim(),
                    label: newColor.label.trim(),
                }

                setData((prevData) => {
                    // Check if the option already exists
                    if (
                        prevData.colorOptions.some(
                            (option) => option.value === formattedColor.value
                        )
                    ) {
                        setNotification({
                            type: 'error',
                            message: `Color "${formattedColor.label}" already exists.`,
                        })
                        return prevData
                    }

                    return {
                        ...prevData,
                        colorOptions: [
                            ...prevData.colorOptions,
                            formattedColor,
                        ],
                    }
                })
            } else {
                setNotification({
                    type: 'error',
                    message: 'Invalid color format.',
                })
            }
        }

        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Style Code <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.styleCode || ''}
                        onChange={(e) =>
                            setData({ ...data, styleCode: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="Enter Style Code"
                    />
                </div>
                <MultiSelectDropdown
                    label="Select Colors (Optional)"
                    options={data.colorOptions} // Bind directly to data.colorOptions
                    selectedOptions={data.colors.map((color) => color.value)} // Map to value for display
                    onChange={(selectedValues, updatedOptions) => {
                        if (!selectedValues || !Array.isArray(selectedValues)) {
                            setNotification({
                                type: 'error',
                                message: 'Invalid selection format.',
                            })
                            return
                        }

                        const selectedColors = selectedValues
                            .map((value) =>
                                updatedOptions.find(
                                    (option) => option.value === value
                                )
                            )
                            .filter(Boolean) // Ensure no undefined values

                        setData((prevData) => ({
                            ...prevData,
                            colors: selectedColors, // Store full objects here
                            colorOptions: updatedOptions, // Update with new options
                        }))
                    }}
                    allowAddNew={true}
                    onAddNewOption={handleAddNewColor}
                />
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">
                        Select Sizes <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                        {availableSizes.map((size) => (
                            <label
                                key={size}
                                className="inline-flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={data.sizes?.includes(size)}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            sizes: e.target.checked
                                                ? [...(data.sizes || []), size]
                                                : data.sizes?.filter(
                                                      (s) => s !== size
                                                  ),
                                        })
                                    }
                                    className="mr-2"
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            MRP <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={data.mrp || ''}
                            onChange={(e) =>
                                setData({ ...data, mrp: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Enter MRP"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Selling Price{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={data.sellingPrice || ''}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    sellingPrice: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Enter Selling Price"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Stock Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={data.stockQty || ''}
                        onChange={(e) =>
                            setData({ ...data, stockQty: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="Enter Stock Quantity"
                    />
                </div>
                <MultiSelectDropdown
                    label="Category *"
                    options={[
                        { value: 'MEN', label: 'MEN' },
                        { value: 'WOMENS', label: 'WOMENS' },
                        { value: 'BELT', label: 'BELT' },
                        { value: 'PERFUME', label: 'PERFUME' },
                        { value: 'CAP', label: 'CAP' },
                    ]}
                    selectedOptions={data.category || ['MEN']} // Default to 'MEN'
                    onChange={(selected) =>
                        setData({ ...data, category: selected })
                    }
                />
                <MultiSelectDropdown
                    label="HSN Code *"
                    options={[
                        {
                            value: '6205',
                            label: '6205: 5% for less than 1000 and 12% for above 1000',
                        },
                    ]}
                    selectedOptions={data.hsnCode || ['6205']} // Default to '6205'
                    onChange={(selected) =>
                        setData({ ...data, hsnCode: selected })
                    }
                />
            </div>
        )
    }
)

export default SellInStoreTab
