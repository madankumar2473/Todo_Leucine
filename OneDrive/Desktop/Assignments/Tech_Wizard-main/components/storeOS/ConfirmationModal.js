import React from 'react'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <p className="text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
