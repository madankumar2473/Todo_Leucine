import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import SingleItemEditModal from './composites/SingleItemEditModal'
import BulkEditModal from './composites/BulkEditModal'
import BarcodeGenerator from '@/components/storeOS/BarcodeGenerator'
import BulkBarcodeGenerator from '@/components/storeOS/BulkBarcodeGenerator'
import Modal from '@/components/storeOS/Modal'

const SKUPreviewTable = ({
    data = [], // Safeguard for undefined data
    onUpdate,
    disableSKU,
    disableStyles,
    onSelect, // Callback for selected SKUs
    showCheckbox = false,
    isPreview = false,
    hideActions = false,
}) => {
    const [selectedSKUs, setSelectedSKUs] = useState([])
    const [singleBarcodeSku, setSingleBarcodeSku] = useState(null)
    const [bulkBarcodeStyle, setBulkBarcodeStyle] = useState(null)
    const [editRow, setEditRow] = useState(null)
    const [bulkEditStyle, setBulkEditStyle] = useState(null)
    const shouldHideActions = isPreview || hideActions

    const handleSelectSKU = (skuId) => {
        setSelectedSKUs((prev) => {
            if (prev.includes(skuId)) {
                return prev.filter((id) => id !== skuId) // Remove if already selected
            } else {
                return [...prev, skuId] // Add if not selected
            }
        })
    }

    const groupByStyle = (data) => {
        return data.reduce((acc, sku) => {
            if (!sku || !sku.styleCode) return acc // Safeguard against invalid SKU
            if (!acc[sku.styleCode]) acc[sku.styleCode] = []
            acc[sku.styleCode].push(sku)
            return acc
        }, {})
    }

    const groupedData = groupByStyle(data)

    const [collapsedStyles, setCollapsedStyles] = useState([])

    useEffect(() => {
        const styleCodes = Object.keys(groupedData)
        setCollapsedStyles(styleCodes) // Initialize all as collapsed by default
    }, [data])

    const toggleCollapseStyle = (styleCode) => {
        setCollapsedStyles((prev) => {
            if (prev.includes(styleCode)) {
                return prev.filter((code) => code !== styleCode) // Remove to expand
            } else {
                return [...prev, styleCode] // Add to collapse
            }
        })
    }

    const calculateOfferPercentage = (mrp, sellingPrice) => {
        if (!mrp || !sellingPrice) return '0%'
        const percentage = ((mrp - sellingPrice) / mrp) * 100
        return `${percentage.toFixed(2)}%`
    }

    useEffect(() => {
        if (onSelect) {
            const selectedSKUObjects = data.filter((sku) =>
                selectedSKUs.includes(sku.skuId)
            )
            onSelect(selectedSKUObjects)
        }
    }, [selectedSKUs, data, onSelect])

    return (
        <>
            {/* Single Item Edit Modal */}
            {editRow && (
                <SingleItemEditModal
                    isOpen={!!editRow}
                    onClose={() => setEditRow(null)}
                    skuData={editRow}
                    onSave={(updatedRow) => {
                        const completeRow = { ...editRow, ...updatedRow } // Merge existing data with updates
                        onUpdate(completeRow.skuId, completeRow)
                        setEditRow(null)
                    }}
                />
            )}

            {/* Bulk Edit Modal */}
            {bulkEditStyle && (
                <BulkEditModal
                    isOpen={!!bulkEditStyle}
                    onClose={() => setBulkEditStyle(null)}
                    skus={groupedData[bulkEditStyle]}
                    onSave={(updatedRows) => {
                        onUpdate(null, updatedRows)
                        setBulkEditStyle(null)
                    }}
                />
            )}

            {/* Single Barcode Modal */}
            {singleBarcodeSku && (
                <Modal
                    isOpen={!!singleBarcodeSku}
                    onClose={() => setSingleBarcodeSku(null)}
                    size="large"
                >
                    <BarcodeGenerator
                        skuId={singleBarcodeSku.skuId}
                        productName={singleBarcodeSku.productName}
                        price={singleBarcodeSku.sellingPrice}
                        barcode={singleBarcodeSku.barcode}
                    />
                </Modal>
            )}

            {/* Bulk Barcode Modal */}
            {bulkBarcodeStyle && (
                <Modal
                    isOpen={!!bulkBarcodeStyle}
                    onClose={() => setBulkBarcodeStyle(null)}
                    size="large"
                >
                    <BulkBarcodeGenerator
                        items={groupedData[bulkBarcodeStyle]}
                    />
                </Modal>
            )}

            <table className="w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2"></th>
                        <th className="border px-4 py-2 text-left">Style ID</th>
                        <th className="border px-4 py-2 text-left">
                            Total Stock Qty
                        </th>
                        <th className="border px-4 py-2 text-left">
                            Average Selling Price
                        </th>
                        {!shouldHideActions && (
                            <th className="border px-4 py-2 text-left">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedData).map((styleCode) => {
                        const skus = groupedData[styleCode]
                        const totalStock = skus.reduce(
                            (sum, sku) => sum + (Number(sku.stockQty) || 0),
                            0
                        )
                        const avgSellingPrice =
                            skus.reduce(
                                (sum, sku) =>
                                    sum + (Number(sku.sellingPrice) || 0),
                                0
                            ) / skus.length || 0
                        const isCollapsed = collapsedStyles.includes(styleCode)

                        return (
                            <React.Fragment key={styleCode}>
                                <tr className="bg-gray-200 hover:bg-gray-300">
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() =>
                                                toggleCollapseStyle(styleCode)
                                            }
                                            className="focus:outline-none"
                                        >
                                            {isCollapsed ? (
                                                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2 uppercase">
                                        {styleCode}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {totalStock}
                                    </td>
                                    <td className="border px-4 py-2">
                                        ₹{avgSellingPrice.toFixed(2)}
                                    </td>
                                    {!shouldHideActions && (
                                        <div className="space-y-2">
                                            <td className=" px-4 py-2">
                                                <button
                                                    className="px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                                                    onClick={() =>
                                                        setBulkEditStyle(
                                                            styleCode
                                                        )
                                                    }
                                                >
                                                    Bulk Edit
                                                </button>
                                            </td>
                                            {/* <td className="border px-4 py-2">
                                                <button
                                                    className="px-2 py-1 bg-neutral-700 text-white rounded hover:bg-neutral-800"
                                                    onClick={() =>
                                                        setBulkBarcodeStyle(
                                                            styleCode
                                                        )
                                                    }
                                                >
                                                    Print Barcodes
                                                </button>
                                            </td> */}
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="px-2 py-1 bg-neutral-600 text-white rounded hover:bg-neutral-700"
                                                    onClick={() => {
                                                        const confirmed =
                                                            window.confirm(
                                                                'Are you sure you want to disable this style? This action will disable all associated SKUs.'
                                                            )
                                                        if (confirmed) {
                                                            disableStyles(
                                                                skus[0]
                                                                    .product_id
                                                            ) // Pass the first SKU's product_id
                                                        }
                                                    }}
                                                >
                                                    Disable Style
                                                </button>
                                            </td>
                                        </div>
                                    )}
                                </tr>

                                {!isCollapsed && (
                                    <>
                                        <tr className="bg-gray-100">
                                            <th></th>
                                            <th className="border px-4 py-2 text-left">
                                                SKU Details
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Stock Qty
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                MRP
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Selling Price
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Offer %
                                            </th>
                                            {!shouldHideActions && (
                                                <th className="border px-4 py-2 text-left">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                        {skus.map((sku) => (
                                            <tr
                                                key={sku.skuId}
                                                className="hover:bg-gray-100"
                                            >
                                                {!showCheckbox && <td></td>}

                                                {showCheckbox && (
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSKUs.includes(
                                                                sku.skuId
                                                            )}
                                                            onChange={() =>
                                                                handleSelectSKU(
                                                                    sku.skuId
                                                                )
                                                            }
                                                            className="form-checkbox h-5 w-5 text-primary-500"
                                                        />
                                                    </td>
                                                )}
                                                <td className="border px-4 py-2 uppercase">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-secondary_violet-900 uppercase">
                                                            {sku.display_name}
                                                        </span>
                                                        <span className="text-sm text-gray-500 uppercase">
                                                            ({sku.skuId})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {sku.stockQty}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    ₹{sku.mrp}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    ₹{sku.sellingPrice}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {calculateOfferPercentage(
                                                        sku.mrp,
                                                        sku.sellingPrice
                                                    )}
                                                </td>
                                                {!shouldHideActions && (
                                                    <td className="border px-4 py-2 flex space-x-2">
                                                        <button
                                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            onClick={() =>
                                                                setEditRow(sku)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-neutral-600 text-white rounded hover:bg-neutral-700"
                                                            onClick={() => {
                                                                const confirmed =
                                                                    window.confirm(
                                                                        'Are you sure you want to disable this SKU?'
                                                                    )
                                                                if (confirmed) {
                                                                    disableSKU(
                                                                        sku.id
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            Disable
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                            onClick={() =>
                                                                setSingleBarcodeSku(
                                                                    sku
                                                                )
                                                            }
                                                        >
                                                            Print Barcode
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default SKUPreviewTable
