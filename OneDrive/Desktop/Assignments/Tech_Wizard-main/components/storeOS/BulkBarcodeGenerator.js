import React, { useRef, useEffect, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const BulkBarcodeGenerator = ({ items }) => {
    const { normalizedFacilities, facilityId } = useTenantFacility()
    const barcodeRefs = useRef({})
    const [selectedItems, setSelectedItems] = useState(items)
    const [selectAll, setSelectAll] = useState(true)

    const currentFacility = normalizedFacilities[facilityId] || {}

    const storeName = currentFacility?.name // Extract facility_name

    useEffect(() => {
        // Render barcodes for each selected item
        selectedItems.forEach((item) => {
            const barcodeRef = barcodeRefs.current[item.skuId]
            if (barcodeRef && item.barcode) {
                JsBarcode(barcodeRef, item.barcode, {
                    format: 'CODE128',
                    lineColor: '#000',
                    width: 1.4,
                    height: 50,
                    displayValue: true,
                    textMargin: 5,
                    fontSize: 14,
                    margin: 0,
                })
            }
        })
    }, [selectedItems])

    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked)
        setSelectedItems(isChecked ? items : [])
    }

    const handleItemSelect = (item, isChecked) => {
        if (isChecked) {
            setSelectedItems((prev) => [...prev, item])
        } else {
            setSelectedItems((prev) =>
                prev.filter((i) => i.skuId !== item.skuId)
            )
        }
    }

    const handlePrintSelected = () => {
        const printWindow = window.open('', 'PRINT', 'height=600,width=800')
        const barcodesHTML = selectedItems
            .map(
                (item) => `
          <div class="barcode-container">
            <p><strong>{storeName}</strong></p>
            ${barcodeRefs.current[item.skuId].outerHTML}
            <p>${item.skuId}</p>
            <p>SP: ₹${item.sellingPrice}</p>
          </div>
        `
            )
            .join('')

        printWindow.document.write(`
      <html>
      <head>
        <title>Print Barcodes</title>
        <style>
          @page {
            /* The entire label is 4" wide and 1" tall */
            size: 4in 1in; 
            margin: 0; 
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap; /* So that we can place multiple barcodes per row */
            justify-content: flex-start; 
            align-items: flex-start;
          }
          .barcode-container {
            /* Make each barcode label 2" wide x 1" tall 
               => So two barcodes fit side-by-side on the 4" width */
            width: 2in;
            height: 1in;
            padding: 5px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            font-size: 12px;
            display: block;      /* Just a block, no flex centering */
            text-align: center;
            margin: 0;           /* no extra margins between labels */
          }
          .barcode-container p {
            margin: 0;
            font-size: 10px;
          }
          svg {
            width: 100%;  /* Fill the container’s width */
            height: auto; /* Keep aspect ratio */
          }
        </style>
      </head>
      <body>
        ${barcodesHTML}
      </body>
      </html>
    `)

        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Briskk - Bulk Barcode Generator
            </h1>
            <div className="flex items-center justify-between mb-4">
                {/* Select All Checkbox */}
                <label className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="form-checkbox rounded text-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Select All
                    </span>
                </label>
                {/* Print Button */}
                <button
                    className="px-6 py-2 text-sm bg-primary-500 text-white font-semibold rounded-md shadow hover:bg-primary-600 focus:ring-2 focus:ring-primary-500"
                    onClick={handlePrintSelected}
                    disabled={selectedItems.length === 0}
                >
                    Print Selected Barcodes
                </button>
            </div>
            {/* Barcode Grid (preview before printing) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div
                        key={item.skuId}
                        className="flex flex-col items-center border border-gray-200 rounded-md p-4 shadow-sm bg-gray-50 hover:shadow-md w-full"
                    >
                        {/* Checkbox for individual selection */}
                        <label className="flex items-center space-x-2 mb-3">
                            <input
                                type="checkbox"
                                checked={selectedItems.some(
                                    (i) => i.skuId === item.skuId
                                )}
                                onChange={(e) =>
                                    handleItemSelect(item, e.target.checked)
                                }
                                className="form-checkbox rounded text-primary-500 focus:ring-2 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-800">
                                {item.skuId}
                            </span>
                        </label>
                        {/* Barcode + Details */}
                        <div className="flex flex-col justify-center items-center text-center">
                            <p className="font-semibold text-sm text-gray-700">
                                {storeName}
                            </p>
                            <svg
                                ref={(el) =>
                                    (barcodeRefs.current[item.skuId] = el)
                                }
                                className="w-full"
                            />
                            <p className="text-sm text-gray-600">
                                {item.skuId}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                                SP: ₹{item.sellingPrice}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BulkBarcodeGenerator
