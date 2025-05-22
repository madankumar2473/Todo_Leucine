import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
} from '@heroicons/react/24/solid'

const Table = ({
    title, // New prop for table title
    linkText, // New prop for link text
    linkHref, // New prop for link URL
    columns,
    data,
    searchable = false,
    sortable = false,
    pagination = { enabled: false, pageSize: 10 },
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    })
    const [currentPage, setCurrentPage] = useState(1)

    const filteredData = useMemo(() => {
        if (!searchable || !searchQuery) return data
        return data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }, [data, searchQuery, searchable])

    const sortedData = useMemo(() => {
        if (!sortable || !sortConfig.key) return filteredData

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredData, sortConfig, sortable])

    const paginatedData = useMemo(() => {
        if (!pagination.enabled) return sortedData

        const startIndex = (currentPage - 1) * pagination.pageSize
        return sortedData.slice(startIndex, startIndex + pagination.pageSize)
    }, [sortedData, currentPage, pagination])

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    return (
        <div className="p-4 rounded-lg shadow-lg bg-white overflow-x-auto">
            {/* Title and Link */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                {linkHref && (
                    <a
                        href={linkHref}
                        className="text-blue-500 text-sm font-medium hover:underline"
                    >
                        {linkText}
                    </a>
                )}
            </div>

            {/* Search */}
            {searchable && (
                <input
                    type="text"
                    placeholder="Search..."
                    className="mb-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            )}

            {/* Table */}
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="text-left py-3 px-4 text-sm font-medium text-neutral-800 bg-neutral-200 border-b border-neutral-400 uppercase tracking-wider"
                            >
                                {sortable ? (
                                    <button
                                        className="flex items-center gap-1 focus:outline-none"
                                        onClick={() => handleSort(col.key)}
                                    >
                                        {col.label}
                                        {sortConfig.key === col.key ? (
                                            sortConfig.direction === 'asc' ? (
                                                <ChevronUpIcon className="w-6 h-6 text-primary-700" />
                                            ) : (
                                                <ChevronDownIcon className="w-6 h-6 text-primary-700" />
                                            )
                                        ) : (
                                            <ChevronUpDownIcon className="w-6 h-6 text-gray-400" />
                                        )}
                                    </button>
                                ) : (
                                    col.label
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <tr
                                key={index}
                                className="hover:bg-primary-100 text-sm"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className="py-2 px-4 text-gray-700 border-b"
                                    >
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="py-4 px-4 text-center text-gray-500"
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination.enabled && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {currentPage} of{' '}
                        {Math.ceil(sortedData.length / pagination.pageSize)}
                    </span>
                    <button
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        disabled={
                            currentPage ===
                            Math.ceil(sortedData.length / pagination.pageSize)
                        }
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

Table.propTypes = {
    title: PropTypes.string, // Title of the table
    linkText: PropTypes.string, // Text for the link
    linkHref: PropTypes.string, // URL for the link
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    searchable: PropTypes.bool,
    sortable: PropTypes.bool,
    pagination: PropTypes.shape({
        enabled: PropTypes.bool,
        pageSize: PropTypes.number,
    }),
}

export default Table
