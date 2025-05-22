import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import Dropdown from '@/components/storeOS/Dropdown'
import Table from '@/components/storeOS/Table'
import { useReporting, ReportingProvider } from '@/contexts/ReportingProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const Gstr3bReport = () => {
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
        if (gstData?.gst_by_hsn) {
            const formattedData = gstData.gst_by_hsn.map((hsn) => ({
                gstRate: hsn.gst_rate ? `${hsn.gst_rate}%` : 'N/A',
                taxableValue: hsn.total_taxable_value
                    ? `₹${hsn.total_taxable_value}`
                    : 'N/A',
                cgst: hsn.total_cgst ? `₹${hsn.total_cgst}` : 'N/A',
                sgst: hsn.total_sgst ? `₹${hsn.total_sgst}` : 'N/A',
                totalTax: hsn.total_gst ? `₹${hsn.total_gst}` : 'N/A',
            }))
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
        <Layout title="GSTR-3B Report">
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
                        title="GSTR-3B Data"
                        columns={[
                            { key: 'gstRate', label: 'GST Rate' },
                            { key: 'taxableValue', label: 'Taxable Value' },
                            { key: 'cgst', label: 'CGST' },
                            { key: 'sgst', label: 'SGST' },
                            { key: 'totalTax', label: 'Total Tax' },
                        ]}
                        data={tableData}
                        pagination={{ enabled: true, pageSize: 5 }}
                    />
                )}
            </div>
        </Layout>
    )
}

const Gstr3bReportWithProvider = () => (
    <ReportingProvider>
        <Gstr3bReport />
    </ReportingProvider>
)

export default Gstr3bReportWithProvider
