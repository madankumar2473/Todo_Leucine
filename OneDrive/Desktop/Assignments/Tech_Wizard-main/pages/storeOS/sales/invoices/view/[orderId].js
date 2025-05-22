import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SalesInvoiceProvider } from '@/contexts/SalesInvoiceProvider'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import Button from '@/components/storeOS/Button'

const InvoicePageContent = () => {
    const router = useRouter()
    const { orderId } = router.query
    const [invoiceHTML, setInvoiceHTML] = useState('')

    const { generateInvoice, loading, error, clearErrorState } =
        useSalesInvoice()

    // State for the raw JSPrintManager module and printers
    const [jspmModule, setJspmModule] = useState(null)
    const [printers, setPrinters] = useState([])
    const [selectedPrinter, setSelectedPrinter] = useState('')

    // 1. Standard browser print
    const handleBackToDashboardClick = () => {
        router.push('/storeOS/dashboard')
    }

    // // 2. JSPrintManager direct print
    // const handleJSPMPrint = async () => {
    //     if (!selectedPrinter) {
    //         alert('Please select a printer before printing!')
    //         return
    //     }
    //     if (!jspmModule) {
    //         alert('JSPrintManager module not loaded yet.')
    //         return
    //     }

    //     try {
    //         // Destructure from the loaded module
    //         const { ClientPrintJob, InstalledPrinter } = jspmModule.default
    //         const cpj = new ClientPrintJob()

    //         // Set up the printer
    //         cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

    //         // Use printerCommands for raw HTML content
    //         cpj.printerCommands = invoiceHTML // Ensure invoiceHTML is a valid HTML string
    //         cpj.printerCommandsCopies = 1 // Specify the number of copies

    //         // Send the print job
    //         await cpj.sendToClient()
    //         console.log('Print job sent to JSPrintManager successfully!')
    //     } catch (err) {
    //         console.error('Error sending print job via JSPM:', err)
    //     }
    // }

    // // 3. Conditionally import JSPrintManager in a browser-only useEffect
    // useEffect(() => {
    //     // Prevent SSR usage
    //     if (typeof window === 'undefined') return

    //     async function initJSPM() {
    //         try {
    //             // Dynamically import the jsprintmanager package
    //             const mod = await import('jsprintmanager')
    //             console.log('Raw import of jsprintmanager:', mod)

    //             const { JSPrintManager } = mod || {}

    //             if (!JSPrintManager) {
    //                 console.error(
    //                     'Could not find JSPrintManager export in module!'
    //                 )
    //                 return
    //             }

    //             // Configure JSPrintManager
    //             // JSPrintManager.wsPort = 23443 // Non-SSL WebSocket port
    //             // JSPrintManager.sslPort = 27443 // SSL WebSocket port
    //             JSPrintManager.autoReconnect = true
    //             await JSPrintManager.start()
    //             console.log('JSPrintManager started!')

    //             // Fetch printers
    //             const printerList = await JSPrintManager.getPrinters()
    //             console.log('Fetched printers:', printerList)

    //             // Expose the entire module for use
    //             setJspmModule({
    //                 ...mod.default,
    //                 ClientPrintJob: JSPrintManager.ClientPrintJob,
    //                 InstalledPrinter: JSPrintManager.InstalledPrinter,
    //             })

    //             setPrinters(printerList)
    //         } catch (err) {
    //             console.error('Error initializing JSPrintManager:', err)
    //         }
    //     }

    //     initJSPM()
    // }, [])
    // // 4. Fetch invoice once route params are ready
    useEffect(() => {
        if (orderId) {
            generateInvoice(orderId, false, setInvoiceHTML, 'html')
        }
    }, [orderId])

    // 5. Handle loading / error states
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-neutral-100 text-primary-700 font-sans">
                <p>Loading invoice...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-neutral-100 font-sans">
                <p className="text-red-600 text-lg font-semibold mb-4">
                    {error}
                </p>
                <Button
                    label="Retry"
                    onClick={() => {
                        clearErrorState()
                        generateInvoice(orderId)
                    }}
                    variant="primary"
                />
            </div>
        )
    }

    // 6. Render UI
    return (
        <div className="bg-neutral-100 font-sans">
            <div className="bg-white shadow-md p-6 rounded-md">
                {/* Top Buttons */}
                <div className="flex justify-center sm:justify-between items-center gap-4 mb-6 print:hidden">
                    <Button
                        label="Back to Dashboard"
                        onClick={handleBackToDashboardClick}
                        variant="primary"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md shadow-sm"
                    />
                    <Button
                        label="Create Another Invoice"
                        onClick={() => router.push('/storeOS/sales/invoices')}
                        variant="secondary"
                        className="bg-secondary_violet-600 hover:bg-secondary_violet-700 text-white px-6 py-2 rounded-md shadow-sm"
                    />
                </div>

                {/* JSPrintManager Printers */}
                {/* <div className="flex justify-center items-center gap-4 mb-6 print:hidden">
                    <div>
                        <label
                            htmlFor="printer-select"
                            className="block text-sm font-medium text-gray-700"
                        >
                            JSPrintManager Printers
                        </label>
                        <select
                            id="printer-select"
                            value={selectedPrinter}
                            onChange={(e) => setSelectedPrinter(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                            <option value="">Select a printer</option>
                            {printers.map((printer, idx) => (
                                <option key={idx} value={printer}>
                                    {printer}
                                </option>
                            ))}
                        </select>
                    </div> */}

                {/* <Button
                        label="JSPM Print"
                        onClick={handleJSPMPrint}
                        variant="primary"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md shadow-sm"
                    /> */}
                {/* </div> */}

                {/* Invoice Content */}
                <div
                    dangerouslySetInnerHTML={{ __html: invoiceHTML }}
                    className="invoice-content border border-neutral-300 rounded-md p-4 bg-neutral-200"
                />
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media screen {
                    body {
                        background-color: #f9fafb;
                        font-size: 14px;
                    }
                    .bg-white {
                        background-color: #f7f7f7;
                    }
                }

                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }

                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 10px;
                        line-height: 1.2;
                        background-color: #fff !important;
                    }

                    .print\\:hidden {
                        display: none !important;
                    }

                    .invoice-content {
                        border: none !important;
                        background-color: #fff !important;
                        margin: 0;
                        padding: 0;
                        width: 80mm;
                        box-sizing: border-box;
                    }

                    table {
                        width: 100%;
                        table-layout: fixed;
                        border-collapse: collapse;
                    }

                    thead,
                    tbody,
                    tfoot {
                        page-break-inside: avoid;
                    }

                    tr {
                        page-break-inside: avoid;
                    }

                    th,
                    td {
                        border: 1px solid #ddd;
                        padding: 6px;
                        word-wrap: break-word;
                    }

                    th {
                        text-align: left;
                        font-weight: bold;
                        font-size: 10px;
                        background-color: #f0f0f0;
                    }

                    td.text-right,
                    th.text-right {
                        text-align: right;
                    }

                    td.text-center,
                    th.text-center {
                        text-align: center;
                    }

                    .totals {
                        font-weight: bold;
                        text-align: right;
                        padding-right: 6px;
                    }

                    .invoice-content table + table {
                        margin-top: 12px;
                    }

                    .terms {
                        font-size: 9px;
                        text-align: left;
                        margin-top: 10px;
                        list-style-type: square;
                        padding-left: 20px;
                    }

                    .footer {
                        text-align: center;
                        margin-top: 15px;
                        font-size: 9px;
                    }

                    .header {
                        font-size: 12px;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 10px;
                    }
                }
            `}</style>
        </div>
    )
}

const InvoicePage = () => {
    return (
        <SalesInvoiceProvider>
            <InvoicePageContent />
        </SalesInvoiceProvider>
    )
}

export default InvoicePage
