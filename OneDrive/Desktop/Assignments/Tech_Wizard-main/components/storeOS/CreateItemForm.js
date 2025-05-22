import React, { useState } from 'react'
import SKUPreviewTable from './SKUPreviewTable'
import MultiSelectDropdown from './MultiSelectDropdown'

const CreateItemForm = () => {
    const [styleCode, setStyleCode] = useState('')
    const [selectedColors, setSelectedColors] = useState([])
    const [selectedSizes, setSelectedSizes] = useState([])
    const [skuData, setSkuData] = useState([])

    const sizes = [
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        '28',
        '30',
        '32',
        '34',
        '36,',
        '38',
        '40',
        '42',
        'NA',
    ]
    const colors = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
    ]

    const generateSKUs = () => {
        const skus = []
        selectedColors.forEach((color) => {
            selectedSizes.forEach((size) => {
                skus.push({
                    styleCode,
                    skuId: `${styleCode}-${color}-${size}`,
                    stockQty: 0,
                    mrp: 0,
                    sellingPrice: 0,
                })
            })
        })
        setSkuData(skus)
    }

    const handleUpdate = (skuId, updatedRow) => {
        const updatedData = skuData.map((row) =>
            row.skuId === skuId ? updatedRow : row
        )
        setSkuData(updatedData)
    }

    const handleDelete = (skuId) => {
        const filteredData = skuData.filter((row) => row.skuId !== skuId)
        setSkuData(filteredData)
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Create Item</h1>

            {/* Style Code Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Style Code
                </label>
                <input
                    type="text"
                    value={styleCode}
                    onChange={(e) => setStyleCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Enter Style Code"
                />
            </div>

            {/* Color Selector */}
            <MultiSelectDropdown
                label="Select Colors"
                options={colors}
                selectedOptions={selectedColors}
                onChange={setSelectedColors}
            />

            {/* Size Selector */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                    Select Sizes
                </label>
                <div className="flex flex-wrap space-x-2">
                    {sizes.map((size) => (
                        <label
                            key={size}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                value={size}
                                checked={selectedSizes.includes(size)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedSizes([
                                            ...selectedSizes,
                                            size,
                                        ])
                                    } else {
                                        setSelectedSizes(
                                            selectedSizes.filter(
                                                (s) => s !== size
                                            )
                                        )
                                    }
                                }}
                                className="form-checkbox h-4 w-4 text-primary-500"
                            />
                            <span>{size}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Generate SKUs Button */}
            <button
                onClick={generateSKUs}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
                Generate SKUs
            </button>

            {/* SKU Preview Table */}
            {skuData.length > 0 && (
                <div className="mt-6">
                    <SKUPreviewTable
                        data={skuData}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    )
}

export default CreateItemForm
