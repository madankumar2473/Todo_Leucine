import React, { useState, useEffect } from 'react'

//TODO: this component is not getting used ...we need to re-work on it
const SellOnlineTab = React.forwardRef(({ data, setData }, ref) => {
    const [error, setError] = useState('')

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setData((prevData) => ({
                    ...prevData,
                    mainImage: reader.result, // Save base64 image for preview
                }))
            }
            reader.readAsDataURL(file)
        }
    }
    // Forward reference to expose validation and data retrieval
    React.useImperativeHandle(ref, () => ({
        validateAndGetData: () => {
            // Required fields validation
            if (
                !data.productName ||
                !data.brand ||
                !data.description ||
                !data.mainImage
            ) {
                setError('Please fill all required fields for online sales.')
                return null // Return null if validation fails
            }

            setError('') // Clear error if validation passes
            return {
                productName: data.productName,
                brand: data.brand,
                description: data.description,
                highlights: data.highlights,
                mainImage: data.mainImage,
            }
        },
        hasStarted: () => {
            return (
                data.productName ||
                //  data.brand !== '' || // Check if the default brand has changed
                data.description ||
                data.highlights ||
                data.mainImage
            )
        },
    }))

    return (
        <div className="space-y-4">
            {/* {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )} */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Product Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.productName || ''}
                    onChange={(e) =>
                        setData({ ...data, productName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Enter Product Name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Brand <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.brand}
                    onChange={(e) =>
                        setData({ ...data, brand: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Enter Brand Name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={data.description || ''}
                    onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Enter Product Description"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Highlights
                </label>
                <textarea
                    value={data.highlights || ''}
                    onChange={(e) =>
                        setData({ ...data, highlights: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    placeholder="Enter Product Highlights"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Main Image <span className="text-red-500">*</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                />
                {data.mainImage && (
                    <div className="mt-2">
                        <img
                            src={data.mainImage}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
            </div>
        </div>
    )
})

export default SellOnlineTab
