import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import Dropdown from '@/components/storeOS/Dropdown'
import Table from '@/components/storeOS/Table'
import { useReporting, ReportingProvider } from '@/contexts/ReportingProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const InventoryReport = () => {
    const { tenantId, normalizedFacilities, facilityId } = useTenantFacility()
    const { fetchStockMovementData, stockMovementData, loading, error } =
        useReporting()
    const [filters, setFilters] = useState({
        from: new Date(
            new Date().setDate(new Date().getDate() - 30)
        ).toISOString(),
        to: new Date().toISOString(),
        facility_id: facilityId,
        transaction_type: '',
    })
    const [filterLabel, setFilterLabel] = useState('Past 30 Days')
    const [tableData, setTableData] = useState([])
    const [summary, setSummary] = useState({
        inflow: 0,
        outflow: 0,
        net_change: 0,
    })

    const resetFilters = () => {
        setFilters({
            from: new Date(
                new Date().setDate(new Date().getDate() - 30)
            ).toISOString(),
            to: new Date().toISOString(),
            facility_id: facilityId,
            transaction_type: '',
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
        const validFilters = {
            ...filters,
            start_date: filters.from,
            end_date: filters.to,
        }
        delete validFilters.from
        delete validFilters.to
        if (!filters.transaction_type) delete validFilters.transaction_type
        fetchStockMovementData(validFilters)
    }, [filters, fetchStockMovementData])

    useEffect(() => {
        if (stockMovementData?.data) {
            const formattedData = stockMovementData.data.map((item) => ({
                skuName: item.sku_name,
                transactionType: item.transaction_type || 'NA',
                quantity: `${item.quantity} PCS`,
                openingStock: `${item.opening_stock} PCS`,
                closingStock: `${item.closing_stock} PCS`,
                transactionDate: new Date(
                    item.transaction_date
                ).toLocaleString(),
                invoiceNumber: item.invoice_number || '-',
            }))
            setTableData(formattedData)
            setSummary(stockMovementData.summary)
        }
    }, [stockMovementData])

    const handleFilterChange = (filterKey, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: value,
        }))

        if (filterKey === 'time') {
            const today = new Date()
            let from

            if (value === 'daily') {
                from = new Date(today).toISOString()
                setFilterLabel('Today')
            } else if (value === 'weekly') {
                const last7Days = new Date(today.setDate(today.getDate() - 7))
                from = last7Days.toISOString()
                setFilterLabel('Past 7 Days')
            } else if (value === 'monthly') {
                const last30Days = new Date(today.setDate(today.getDate() - 30))
                from = last30Days.toISOString()
                setFilterLabel('Past 30 Days')
            }

            setFilters((prev) => ({
                ...prev,
                from,
                to: new Date().toISOString(),
            }))
        }
    }

    return (
        <Layout title="Inventory Report">
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
                    <Dropdown
                        triggerLabel="Transaction Type"
                        options={[
                            { label: 'Inbound', value: 'inbound' },
                            { label: 'Outbound', value: 'outbound' },
                            { label: 'Purchase', value: 'purchase' },
                            { label: 'Sale', value: 'sale' },
                        ]}
                        onSelect={(option) =>
                            handleFilterChange('transaction_type', option.value)
                        }
                    />
                </div>

                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Reset Filters
                </button>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h3 className="text-lg font-bold">Inflow</h3>
                        <p className="text-2xl">{summary.inflow} PCS</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-md">
                        <h3 className="text-lg font-bold">Outflow</h3>
                        <p className="text-2xl">{summary.outflow} PCS</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-md">
                        <h3 className="text-lg font-bold">Net Change</h3>
                        <p className="text-2xl">{summary.net_change} PCS</p>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <p>Report Loading... Please wait.</p>
                ) : error ? (
                    <p>Error: Not a valid query.</p>
                ) : (
                    <Table
                        title="Stock Movement"
                        columns={[
                            { key: 'skuName', label: 'SKU Name' },
                            {
                                key: 'transactionType',
                                label: 'Transaction Type',
                            },
                            { key: 'quantity', label: 'Quantity' },
                            { key: 'openingStock', label: 'Opening Stock' },
                            { key: 'closingStock', label: 'Closing Stock' },
                            { key: 'transactionDate', label: 'Date' },
                            { key: 'invoiceNumber', label: 'Invoice Number' },
                        ]}
                        data={tableData}
                        pagination={{ enabled: true, pageSize: 10 }}
                    />
                )}
            </div>
        </Layout>
    )
}

const InventoryReportWithProvider = () => (
    <ReportingProvider>
        <InventoryReport />
    </ReportingProvider>
)

export default InventoryReportWithProvider
