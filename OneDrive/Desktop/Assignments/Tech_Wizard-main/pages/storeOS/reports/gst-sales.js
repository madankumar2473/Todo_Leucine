import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import Dropdown from '@/components/storeOS/Dropdown'
import Table from '@/components/storeOS/Table'
import { useReporting, ReportingProvider } from '@/contexts/ReportingProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const GstSalesReport = () => {
    const { tenantId, normalizedFacilities, facilityId } = useTenantFacility()
    const { fetchGstData, gstData, loading, error } = useReporting()
    const [filters, setFilters] = useState({
        from: `${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]} 00:00:00`,
        to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
        facility_id: facilityId,
        tenant_id: tenantId,
    })
    const [filterLabel, setFilterLabel] = useState('Past 30 Days')
    const [tableData, setTableData] = useState([])

    const resetFilters = () => {
        setFilters({
            from: `${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]} 00:00:00`,
            to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
            facility_id: facilityId,
            tenant_id: tenantId,
        })
        setFilterLabel('Past 30 Days')
    }

    const facilitiesOptions = Object.values(normalizedFacilities).map(
        (facility) => ({
            label: facility.name, // Facility name as the label
            value: facility.id, // Facility ID as the value
        })
    )

    useEffect(() => {
        const validFilters = { ...filters }
        if (!filters.facility_id) delete validFilters.facility_id
        fetchGstData(validFilters)
    }, [filters, fetchGstData])

    useEffect(() => {
        if (gstData?.order_details) {
            const formattedData = gstData.order_details.flatMap((order) =>
                order.gst_breakdown.map((gst) => ({
                    invoiceNumber: order.invoice_number,
                    hsnCode: gst.hsn_code || 'N/A',
                    gstRate: gst.GST_rate || 'N/A',
                    itemPrice:
                        gst.item_price != null ? `₹${gst.item_price}` : 'N/A',
                    cgst: gst.CGST != null ? `₹${gst.CGST}` : 'N/A',
                    sgst: gst.SGST != null ? `₹${gst.SGST}` : 'N/A', // ✅ Handles 0.0 correctly
                    gstAmount:
                        gst.GST_amount != null ? `₹${gst.GST_amount}` : 'N/A',
                }))
            )
            setTableData(formattedData)
        }
    }, [gstData])

    const handleFilterChange = (filterKey, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: value,
        }))

        if (filterKey === 'time') {
            const today = new Date()
            let from

            if (value === 'daily') {
                from = `${today.toISOString().split('T')[0]} 00:00:00`
                setFilterLabel('Today')
            } else if (value === 'weekly') {
                const last7Days = new Date(today.setDate(today.getDate() - 7))
                from = `${last7Days.toISOString().split('T')[0]} 00:00:00`
                setFilterLabel('Past 7 Days')
            } else if (value === 'monthly') {
                const last30Days = new Date(today.setDate(today.getDate() - 30))
                from = `${last30Days.toISOString().split('T')[0]} 00:00:00`
                setFilterLabel('Past 30 Days')
            }

            setFilters((prev) => ({
                ...prev,
                from,
                to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
            }))
        }
    }

    return (
        <Layout title="GST Sales Report (With HSN)">
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <Dropdown
                        triggerLabel={filterLabel}
                        options={[
                            { label: 'Today', value: 'daily' },
                            { label: 'Past 7 Days', value: 'weekly' },
                            { label: 'Past 30 Days', value: 'monthly' },
                        ]}
                        onSelect={(option) =>
                            handleFilterChange('time', option.value)
                        }
                    />
                    <Dropdown
                        triggerLabel="Select Facility"
                        options={facilitiesOptions} // Dynamically populated options
                        onSelect={(option) =>
                            handleFilterChange('facility_id', option.value)
                        }
                    />
                </div>

                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Reset Filters
                </button>

                {/* Table */}
                {loading ? (
                    <p>Report Loading ...please wait</p>
                ) : error ? (
                    <p>Error: Not a valid query </p>
                ) : (
                    <Table
                        title="GST Sales Data"
                        columns={[
                            { key: 'invoiceNumber', label: 'Invoice Number' },
                            { key: 'hsnCode', label: 'HSN Code' },
                            { key: 'gstRate', label: 'GST Rate (%)' },
                            { key: 'itemPrice', label: 'Item Price' },
                            { key: 'cgst', label: 'CGST' },
                            { key: 'sgst', label: 'SGST' },
                            { key: 'gstAmount', label: 'GST Amount' },
                        ]}
                        data={tableData}
                        pagination={{ enabled: true, pageSize: 5 }}
                    />
                )}
            </div>
        </Layout>
    )
}

const GstSalesReportWithProvider = () => (
    <ReportingProvider>
        <GstSalesReport />
    </ReportingProvider>
)

export default GstSalesReportWithProvider
