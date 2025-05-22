import React, { useEffect, useState } from 'react'
import Layout from '@/layouts/Layout'
import { useReporting, ReportingProvider } from '@/contexts/ReportingProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'
import KPIWidget from '@/components/storeOS/KPIWidget'
import Card from '@/components/storeOS/Card'
import ChartComponent from '@/components/storeOS/ChartComponent'
import Table from '@/components/storeOS/Table'
import Dropdown from '@/components/storeOS/Dropdown'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import Loader from '@/components/storeOS/Loader'
import Notification from '@/components/storeOS/Notification'
import { ArrowDownward, ArrowUpward, CurrencyRupee } from '@mui/icons-material'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const columns = [
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'txnNo', label: 'Transaction No' },
    { key: 'partyName', label: 'Party Name' },
    { key: 'amount', label: 'Amount' },
]

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            enabled: true,
        },
    },
}

const DashboardContent = () => {
    const { salesData, fetchSalesData, loading, error, fetchOrders } =
        useReporting()
    const { tenantId, facilityId } = useTenantFacility()
    const [filterLabel, setFilterLabel] = useState('Past 30 Days')
    const [chartData, setChartData] = useState({ labels: [], datasets: [] })
    const [orders, setOrders] = useState([])
    const [transactionData, setTransactionData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchOrders({
                tenant_id: tenantId,
                source: 'in_store',
                facility_id: facilityId,
            })
            setOrders(response?.data || [])

            const formattedData = response?.data?.map((order) => ({
                date: new Date(order.inserted_at).toLocaleDateString(),
                type: order.source === 'in_store' ? 'Sales Invoice' : 'Unknown',
                txnNo: order.invoice_number || 'N/A',
                partyName:
                    order.order_meta?.customer_details?.customer_name ||
                    'Unknown',
                amount: `₹${Number(order.order_amount || 0).toFixed(2)}`,
            }))

            setTransactionData(formattedData || [])
        }

        fetchData()
    }, [fetchOrders])

    useEffect(() => {
        // Fetch sales data for the past 30 days by default
        const today = new Date()
        const last30Days = new Date(today.setDate(today.getDate() - 30))
        fetchSalesData({
            from: `${last30Days.toISOString().split('T')[0]} 00:00:00`,
            to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
            facility_id: facilityId,
            tenant_id: tenantId,
        })
    }, [])

    useEffect(() => {
        // Update chart data when salesData changes
        if (salesData?.payment_method_breakdown) {
            const labels = salesData.payment_method_breakdown.map(
                (item) => item.payment_method || 'Unknown'
            )
            const data = salesData.payment_method_breakdown.map((item) =>
                Number(item.total_amount || 0)
            )

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Sales by Payment Method',
                        data,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            })
        }
    }, [salesData])

    const handleFilterChange = (filter) => {
        const today = new Date()
        let from, label

        if (filter === 'daily') {
            from = `${today.toISOString().split('T')[0]} 00:00:00`
            label = 'Today'
        } else if (filter === 'weekly') {
            const last7Days = new Date(today.setDate(today.getDate() - 7))
            from = `${last7Days.toISOString().split('T')[0]} 00:00:00`
            label = 'Past 7 Days'
        } else if (filter === 'monthly') {
            const last30Days = new Date(today.setDate(today.getDate() - 30))
            from = `${last30Days.toISOString().split('T')[0]} 00:00:00`
            label = 'Past 30 Days'
        }

        fetchSalesData({
            from,
            to: `${new Date().toISOString().split('T')[0]} 23:59:59`,
            facility_id: facilityId,
            tenant_id: tenantId,
        })
        setFilterLabel(label)
    }

    const totalPending =
        salesData?.payment_status_breakdown?.reduce(
            (sum, { pending_amount }) => sum + Number(pending_amount || 0),
            0
        ) || 0

    const totalCollected = Number(salesData?.total_sales?.total_order_amount)

    return (
        <Layout className="" title="Dashboard">
            {/* Loader */}
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
                    <Loader message="Hold tight! Your magical dashboard is on the way 🚀✨" />
                </div>
            )}

            {/* Notification */}
            {(error || !salesData) && (
                <div className="mb-4">
                    {error && (
                        <Notification
                            message={error}
                            type="error"
                            onClose={() =>
                                console.log('Clear error action here')
                            }
                        />
                    )}
                </div>
            )}
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card
                    title="To Collect"
                    description="Outstanding payments"
                    value={`₹${totalPending.toFixed(2)}`}
                    leftIcon={
                        <ArrowDownward className="w-6 h-6 text-green-500" />
                    }
                    rightIcon={<CurrencyRupee className="text-green-500" />}
                    bgColor="bg-white"
                    borderColor="border-green-100"
                    hoverEffect="hover:border-green-300"
                    className="shadow-lg border rounded-xl"
                />
                {/* TODO - need to add purchase order route and then update this card data */}
                <Card
                    title="To Pay"
                    description="Pending dues"
                    value="₹0"
                    leftIcon={<ArrowUpward className="w-6 h-6 text-red-500" />}
                    rightIcon={<CurrencyRupee className="text-red-500" />}
                    bgColor="bg-white"
                    borderColor="border-red-100"
                    hoverEffect="hover:border-red-300"
                    className="shadow-lg border rounded-xl"
                />
                <Card
                    title={`Total Sales (${filterLabel})`}
                    description="Total sales in the selected duration"
                    value={`₹${totalCollected.toFixed(2)}`}
                    leftIcon={<CurrencyRupee className="text-blue-500" />}
                    rightIcon={<CurrencyRupee className="text-blue-500" />}
                    bgColor="bg-blue-50"
                    borderColor="border-blue-200"
                    hoverEffect="hover:border-blue-300"
                    className="shadow-lg border rounded-xl"
                />
            </div>

            {/* Chart and Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                    {/* Header with Dropdown */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">
                            Sales Report ({filterLabel})
                        </h2>
                        {/* Dropdown Selector */}
                        <Dropdown
                            triggerLabel={filterLabel}
                            options={[
                                { label: 'Daily', value: 'daily' },
                                { label: 'Weekly', value: 'weekly' },
                                { label: 'Monthly', value: 'monthly' },
                            ]}
                            onSelect={(option) =>
                                handleFilterChange(option.value)
                            }
                            width="w-auto"
                        />
                    </div>

                    {/* Chart */}
                    <ChartComponent
                        type="bar"
                        data={chartData}
                        options={options}
                        height={
                            typeof window !== 'undefined' &&
                            window.innerWidth < 768
                                ? 'h-100'
                                : 'h-64'
                        }
                        width="w-full"
                    />

                    {/* Stats Below the Chart */}
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Sales</p>
                            <p className="text-lg font-bold text-gray-800">
                                ₹{totalCollected.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Transactions
                            </p>
                            <p className="text-lg font-bold text-gray-800">
                                {salesData?.total_sales?.total_orders || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                    <Table
                        title="Latest Transactions"
                        linkText="See All Transactions"
                        linkHref="/storeOS/sales/list"
                        columns={columns}
                        data={transactionData}
                        searchable={true}
                        sortable={true}
                        pagination={{ enabled: true, pageSize: 3 }}
                    />
                </div>
            </div>

            {/* Promotional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <Card
                    title="Custom Invoice Templates"
                    description="Design and generate invoices that match your brand identity with ease."
                    children={
                        <a
                            href="#"
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Start Designing
                        </a>
                    }
                    bgColor="bg-blue-50"
                    borderColor="border-blue-200"
                    className="shadow-lg border rounded-xl"
                />
                <Card
                    title="Stock Alerts & Management"
                    description="Never run out of stock again! Get alerts for low inventory and manage stock seamlessly."
                    children={
                        <a
                            href="#"
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Learn More
                        </a>
                    }
                    bgColor="bg-green-50"
                    borderColor="border-green-200"
                    className="shadow-lg border rounded-xl"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <Card
                    title="Order Tracking & Reports"
                    description="Track all orders in one place and generate detailed sales and inventory reports."
                    children={
                        <a
                            href="#"
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Explore Reports
                        </a>
                    }
                    bgColor="bg-orange-50"
                    borderColor="border-orange-200"
                    className="shadow-lg border rounded-xl"
                />
                <Card
                    title="Grow Your Business"
                    description="Join our network to connect with customers and expand your offline and online presence."
                    children={
                        <a
                            href="#"
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Get Started
                        </a>
                    }
                    bgColor="bg-purple-50"
                    borderColor="border-purple-200"
                    className="shadow-lg border rounded-xl"
                />
            </div>
        </Layout>
    )
}

const Dashboard = () => (
    <ReportingProvider>
        <DashboardContent />
    </ReportingProvider>
)

export default Dashboard
