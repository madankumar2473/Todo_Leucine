// /pages/storeOS/sales/list.js

import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'
import Notification from '@/components/storeOS/Notification'
import Loader from '@/components/storeOS/Loader'
import Dropdown from '@/components/storeOS/Dropdown'
import Button from '@/components/storeOS/Button'
import { formatPrice } from '@/utils/util'
import { SalesInvoiceProvider } from '@/contexts/SalesInvoiceProvider'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
} from '@heroicons/react/24/solid'

const SalesListPage = () => {
    const { fetchSalesOrders, salesOrders, loading, error } = useSalesInvoice()
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({
        order_status: '',
        payment_method: '',
        source: 'in_store',
    })
    const [sortedColumn, setSortedColumn] = useState('inserted_at')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        fetchSalesOrders(filters) // Fetch orders on component mount or filter change
    }, [filters])

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSort = (column) => {
        if (sortedColumn === column) {
            // Toggle sorting order if the same column is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            // Set the new column as sorted and define its default order
            setSortedColumn(column)
            setSortOrder(column === 'inserted_at' ? 'desc' : 'asc') // Default order
        }
    }

    // TODO : move search and sorting to backend wioth pagination

    // Sorting and Filtering Logic
    const filteredOrders = salesOrders
        .filter((order) => {
            // If there is no customer_details, include the order without filtering.
            if (!order.order_meta?.customer_details) {
                return true
            }

            const matchesSearch =
                order.invoice_number
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                order.order_meta?.customer_details?.customer_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
            return matchesSearch
        })
        .sort((a, b) => {
            if (!sortedColumn) return 0

            let aValue = a[sortedColumn]
            let bValue = b[sortedColumn]

            // Special handling for date and numeric sorting
            if (sortedColumn === 'inserted_at') {
                aValue = new Date(aValue)
                bValue = new Date(bValue)
            } else if (sortedColumn === 'order_amount') {
                aValue = parseFloat(aValue) // Ensure numerical comparison
                bValue = parseFloat(bValue)
            }

            const compare = aValue > bValue ? 1 : aValue < bValue ? -1 : 0
            return sortOrder === 'asc' ? compare : -compare
        })

    return (
        <SalesInvoiceProvider>
            <Layout title="Sales Orders">
                <div className="bg-white shadow-md rounded-lg p-6">
                    {/* Notifications */}
                    {error && (
                        <Notification
                            message={error}
                            type="error"
                            onClose={() => {}}
                        />
                    )}

                    {/* Search and Filters */}
                    <div className="mb-4 flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Search by invoice number or customer name"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:outline-none"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <Dropdown
                            triggerLabel="Order Status"
                            options={[
                                { label: 'All', value: '' },
                                { label: 'Paid', value: 'paid' },
                                { label: 'Unpaid', value: 'unpaid' },
                            ]}
                            onSelect={(option) =>
                                handleFilterChange('order_status', option.value)
                            }
                        />
                        <Dropdown
                            triggerLabel="Payment Method"
                            options={[
                                { label: 'All', value: '' },
                                { label: 'UPI', value: 'UPI' },
                                { label: 'Cash', value: 'Cash' },
                                { label: 'Card', value: 'Card' },
                            ]}
                            onSelect={(option) =>
                                handleFilterChange(
                                    'payment_method',
                                    option.value
                                )
                            }
                        />
                        <Dropdown
                            triggerLabel="Source"
                            options={[
                                { label: 'All', value: '' },
                                { label: 'In-Store', value: 'in_store' },
                                { label: 'Online', value: 'online' },
                            ]}
                            onSelect={(option) =>
                                handleFilterChange('source', option.value)
                            }
                        />
                    </div>

                    {/* Table */}
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th
                                            className="border px-4 py-2 cursor-pointer"
                                            onClick={() =>
                                                handleSort('invoice_number')
                                            }
                                        >
                                            Invoice Number
                                            {sortedColumn ===
                                            'invoice_number' ? (
                                                sortOrder === 'asc' ? (
                                                    <ChevronUpIcon className="w-5 h-5 text-primary-700 inline-block ml-2" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5 text-primary-700 inline-block ml-2" />
                                                )
                                            ) : (
                                                <ChevronUpDownIcon className="w-5 h-5 text-gray-400 inline-block ml-2" />
                                            )}
                                        </th>
                                        <th className="border px-4 py-2">
                                            Customer Name
                                            {/* No sorting for this column */}
                                        </th>

                                        <th
                                            className="border px-4 py-2 cursor-pointer"
                                            onClick={() =>
                                                handleSort('inserted_at')
                                            }
                                        >
                                            Order Date
                                            {sortedColumn === 'inserted_at' ? (
                                                sortOrder === 'asc' ? (
                                                    <ChevronUpIcon className="w-5 h-5 text-primary-700 inline-block ml-2" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5 text-primary-700 inline-block ml-2" />
                                                )
                                            ) : (
                                                <ChevronUpDownIcon className="w-5 h-5 text-gray-400 inline-block ml-2" />
                                            )}
                                        </th>
                                        <th className="border px-4 py-2">
                                            Order Status
                                        </th>
                                        <th className="border px-4 py-2">
                                            Payment Method
                                        </th>
                                        <th
                                            className="border px-4 py-2 cursor-pointer"
                                            onClick={() =>
                                                handleSort('order_amount')
                                            }
                                        >
                                            Order Amount
                                            {sortedColumn === 'order_amount' ? (
                                                sortOrder === 'asc' ? (
                                                    <ChevronUpIcon className="w-5 h-5 text-primary-700 inline-block ml-2" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5 text-primary-700 inline-block ml-2" />
                                                )
                                            ) : (
                                                <ChevronUpDownIcon className="w-5 h-5 text-gray-400 inline-block ml-2" />
                                            )}
                                        </th>
                                        <th className="border px-4 py-2">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border px-4 py-2">
                                                {order.invoice_number}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {
                                                    order.order_meta
                                                        ?.customer_details
                                                        .customer_name
                                                }
                                            </td>
                                            <td className="border px-4 py-2">
                                                {new Date(
                                                    order.inserted_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {order.order_status}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {order.payment_method}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {formatPrice(
                                                    order.order_amount
                                                )}
                                            </td>
                                            <td className="border px-4 py-2 flex gap-2">
                                                <Button
                                                    label="View"
                                                    onClick={() =>
                                                        (window.location.href = `/storeOS/sales/invoices/view/${order.id}`)
                                                    }
                                                    variant="primary"
                                                />
                                                <Button
                                                    label="Print"
                                                    onClick={() =>
                                                        (window.location.href = `/storeOS/sales/invoices/${order.id}`)
                                                    }
                                                    variant="primary"
                                                />
                                                {/* <Button
                                                    label="Edit"
                                                    onClick={() =>
                                                        (window.location.href = `/storeOS/sales/edit/${order.id}`)
                                                    }
                                                    variant="outline"
                                                /> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Layout>
        </SalesInvoiceProvider>
    )
}

const SalesListWrapper = () => (
    <SalesInvoiceProvider>
        <SalesListPage />
    </SalesInvoiceProvider>
)

export default SalesListWrapper
