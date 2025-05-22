import React, { useEffect } from 'react'

const Notification = ({
    message,
    type,
    onClose,
    autoClose = true,
    duration = 2000,
}) => {
    // Close the notification automatically after the specified duration
    useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer) // Cleanup timer on unmount or prop change
        }
    }, [autoClose, duration, onClose])

    if (!message) return null

    return (
        <div
            className={`p-3 rounded text-sm mb-4 ${
                type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-green-50 text-green-700'
            }`}
        >
            <div className="flex justify-between items-center">
                <span>{message}</span>
                {onClose && (
                    <button
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                )}
            </div>
        </div>
    )
}

export default Notification
