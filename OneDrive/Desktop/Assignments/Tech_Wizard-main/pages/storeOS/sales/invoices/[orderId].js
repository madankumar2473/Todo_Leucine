import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SalesInvoiceProvider } from '@/contexts/SalesInvoiceProvider';
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider';
import Button from '@/components/storeOS/Button';

const InvoicePageContent = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const { generateInvoice, loading, error, clearErrorState } = useSalesInvoice();

  const [pdfUrl, setPdfUrl] = useState('');
  const [invoiceHTML, setInvoiceHTML] = useState('');
  const [attempted, setAttempted] = useState(false); // Prevents infinite loops

  // Fetch and display both HTML & PDF invoices
  useEffect(() => {
    if (orderId && !attempted) {
      (async () => {
        try {
          setAttempted(true); // Ensure it runs only once per orderId

          // Call the merged function to get both HTML & PDF
          const { invoiceHTML: fetchedHTML, pdfUrl: fetchedPdfUrl } = await generateInvoice(orderId, setPdfUrl);

          if (fetchedHTML) {
            setInvoiceHTML(fetchedHTML); // Store HTML invoice for preview
          }
          if (fetchedPdfUrl) {
            console.log('Generated PDF URL:', fetchedPdfUrl);
            setPdfUrl(fetchedPdfUrl); // Store Blob URL for PDF preview
          }
        } catch (error) {
          console.error('Error generating invoice:', error);
        }
      })();
    }
  }, [orderId, attempted]);

  // **Loading Spinner**
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-100 text-primary-700 font-sans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-4 text-sm text-gray-600">Generating Invoice...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-100 font-sans">
        <p className="text-red-600 text-lg font-semibold mb-4">{error.message}</p>
        <Button
          label="Retry"
          onClick={() => {
            clearErrorState();
            setPdfUrl(''); // Reset URL on retry
            setInvoiceHTML('');
            setAttempted(false); // Allow re-attempt
          }}
          variant="primary"
        />
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 font-sans">
      <div className="bg-white shadow-md p-6 rounded-md">
        {/* Top Buttons */}
        <div className="flex justify-center sm:justify-between items-center gap-4 mb-6 print:hidden">
          <Button
            label="Create Another Invoice"
            onClick={() => router.push('/storeOS/sales/invoices')}
            variant="secondary"
            className="bg-secondary_violet-600 hover:bg-secondary_violet-700 text-white px-6 py-2 rounded-md shadow-sm"
          />
          {pdfUrl && (
            <a
              href={pdfUrl}
              download="invoice.pdf"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Invoice
            </a>
          )}
        </div>

        {/* PDF Preview */}
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Invoice PDF"
            width="100%"
            height="700px"
            frameBorder="0"
            className="border border-gray-300 rounded-md"
          />
        ) : (
          <div className="flex items-center justify-center h-screen bg-neutral-100 text-primary-700 font-sans">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-sm text-gray-600">Generating Invoice...</p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

const InvoicePage = () => {
  return (
    <SalesInvoiceProvider>
      <InvoicePageContent />
    </SalesInvoiceProvider>
  );
};

export default InvoicePage;
