import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import Dropdown from '@/components/storeOS/Dropdown'
import Table from '@/components/storeOS/Table'
import { useReporting, ReportingProvider } from '@/contexts/ReportingProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'
import { formatPrice } from '@/utils/util'

const SalesReport = () => {
    const { tenantId, normalizedFacilities, facilityId } = useTenantFacility()
    const { fetchSalesData, salesData, loading, error } = useReporting()

    const [filters, setFilters] = useState({
        from: `${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]} 00:00:00`,
        to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
        facility_id: facilityId,
        tenant_id: tenantId,
        // source: 'in_store',
        order_status: 'paid',
    })
    const [filterLabel, setFilterLabel] = useState('Past 30 Days')
    const [tableData, setTableData] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [staffOptions, setStaffOptions] = useState([])

    const facilitiesOptions = Object.values(normalizedFacilities).map(
        (facility) => ({
            label: facility.name, // Facility name as the label
            value: facility.id, // Facility ID as the value
        })
    )

    const resetFilters = () => {
        setFilters({
            from: `${new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]} 00:00:00`,
            to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
            facility_id: facilityId,
            tenant_id: tenantId,
            source: 'in_store',
            order_status: 'paid',
        })
        setFilterLabel('Past 30 Days')
    }

    useEffect(() => {
        const validFilters = { ...filters }
        if (!filters.payment_method) delete validFilters.payment_method
        if (!filters.store_staff_id) delete validFilters.store_staff_id
        if (tenantId) {
            fetchSalesData(validFilters)
        }
    }, [filters, fetchSalesData, tenantId])

    useEffect(() => {
        if (salesData?.payment_method_breakdown) {
            const formattedData = salesData.payment_method_breakdown.map(
                (item) => ({
                    paymentMethod: item.payment_method,
                    totalAmount: `₹${item.total_amount}`,
                    totalOrders: item.order_count,
                })
            )
            setTableData(formattedData)

            const methods = salesData.payment_method_breakdown.map((item) => ({
                label: item.payment_method,
                value: item.payment_method,
            }))
            setPaymentMethods(methods)
        }

        if (salesData?.staff_breakdown) {
            const staff = salesData.staff_breakdown.map((staff) => ({
                label: staff.staff_name || 'Unknown',
                value: staff.staff_id,
            }))
            setStaffOptions(staff)
        }
    }, [salesData])

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
        <Layout title="Sales Report">
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
                        triggerLabel="Select Payment Method"
                        options={paymentMethods}
                        onSelect={(option) =>
                            handleFilterChange('payment_method', option.value)
                        }
                    />
                    <Dropdown
                        triggerLabel="Select Staff"
                        options={staffOptions}
                        onSelect={(option) =>
                            handleFilterChange('store_staff_id', option.value)
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
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md text-center">
                                <span className="text-gray-600 mx-2">
                                    Total Sold
                                </span>
                                <span className="text-primary-600 text-lg font-bold">
                                    {formatPrice(
                                        salesData?.summary
                                            ?.total_order_amount || 0
                                    )}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md text-center">
                                <span className="text-gray-600 mx-2">
                                    Total Orders
                                </span>
                                <span className="text-primary-600 text-lg font-bold">
                                    {salesData?.summary?.total_orders || 0}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md text-center">
                                <span className="text-gray-600 mx-2">
                                    Total GST Collected
                                </span>
                                <span className="text-primary-600 text-lg font-bold">
                                    {formatPrice(
                                        salesData?.summary?.total_gst || 0
                                    )}
                                </span>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md text-center">
                                <span className="text-gray-600 mx-2">
                                    Average Order Value
                                </span>
                                <span className="text-primary-600 text-lg font-bold">
                                    {formatPrice(
                                        parseFloat(
                                            salesData?.summary
                                                ?.average_order_value || 0
                                        ).toFixed(2)
                                    )}
                                </span>
                            </div>
                        </div>
                        <Table
                            title="Sales Data"
                            columns={[
                                {
                                    key: 'paymentMethod',
                                    label: 'Payment Method',
                                },
                                { key: 'totalAmount', label: 'Total Amount' },
                                { key: 'totalOrders', label: 'Total Orders' },
                            ]}
                            data={tableData}
                            pagination={{ enabled: true, pageSize: 5 }}
                        />
                    </>
                )}
            </div>
        </Layout>
    )
}

const SalesReportWithProvider = () => (
    <ReportingProvider>
        <SalesReport />
    </ReportingProvider>
)

export default SalesReportWithProvider
