import React from 'react'

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange }) => {
    return (
        <div className="flex justify-between items-center py-4 px-6 border-t border-gray-200 bg-white">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1, pageSize)} // Explicitly pass pageSize
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-700 text-white hover:bg-primary-800'}`}
            >
                Previous
            </button>

            <span className="text-sm text-gray-700">
                Page <strong>{currentPage}</strong> of{' '}
                <strong>{totalPages}</strong>
            </span>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1, pageSize)} // Explicitly pass pageSize
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
                    ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-700 text-white hover:bg-primary-800'}`}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination
