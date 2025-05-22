import React, { useRef, useEffect } from 'react'
import JsBarcode from 'jsbarcode'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const BarcodeGenerator = ({
    skuId,
    productName = 'Product Name',
    price = 0,
    barcode, // Receive barcode directly as a prop
}) => {
    const barcodeRef = useRef(null)
    const { normalizedFacilities, facilityId } = useTenantFacility()
    const currentFacility = normalizedFacilities[facilityId] || {}

    const storeName = currentFacility?.name // Extract facility_name

    // Apply JsBarcode to generate the barcode
    useEffect(() => {
        if (barcode) {
            JsBarcode(barcodeRef.current, barcode, {
                format: 'CODE128',
                lineColor: '#000',
                width: 1.4,
                height: 50,
                displayValue: true,
                textMargin: 5,
                fontSize: 12,
                margin: 0,
            })
        }
    }, [barcode])

    // Print two barcodes side by side
    const handlePrint = () => {
        const printWindow = window.open('', 'PRINT', 'height=600,width=800')
        const barcodeSVG = barcodeRef.current.outerHTML

        printWindow.document.write(`
     <html>
     <head>
       <title>Print Barcodes</title>
       <style>
         @page {
           size: 4in 1in; /* Combined label size for two barcodes */
           margin: 0;
         }
         body {
           margin: 0;
           padding: 0;
           display: flex;
           justify-content: flex-start; /* Align content to the left */
          align-items: flex-start;
         }
         .barcode-container {
           width: 2in;
           height: 1in;
           padding: 5px;
           box-sizing: border-box;
           font-family: Arial, sans-serif;
           font-size: 12px;
           display: flex;
           flex-direction: column;
           justify-content: center;
           align-items: center;
           text-align: center;
         }
         .barcode-container p {
           margin: 0;
           padding: 0;
         }
        svg {
          width: 100%; /* Ensure SVG fits the container */
          height: auto; /* Maintain aspect ratio */
        }
       </style>
     </head>
     <body>
       <div class="barcode-container">
         <p><strong>${storeName}</strong></p>
         ${barcodeSVG}
         <p>${skuId}</p>
         <p>SP: ₹${price}</p>
       </div>
       <div class="barcode-container">
         <p><strong>${storeName}</strong></p>
         ${barcodeSVG}
         <p>${skuId}</p>
         <p>SP: ₹${price}</p>
       </div>
     </body>
     </html>
   `)

        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
    }

    return (
        <div className="flex flex-col items-center">
            {/* Displaying only one barcode in the preview */}
            <div className="barcode-container text-center border border-gray-300 p-4 rounded-md shadow-md">
                <p className="font-bold text-lg">{storeName}</p>
                <svg ref={barcodeRef} className="my-2" />
                <p className="text-sm">{skuId}</p>
                <p className="text-sm font-bold">SP: ₹{price}</p>
            </div>

            {/* Print Button */}
            <button
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 focus:ring-2 focus:ring-primary-500"
                onClick={handlePrint}
            >
                Print Barcodes
            </button>
        </div>
    )
}

export default BarcodeGenerator
