import { useEffect } from 'react'

const Toast = ({ message, onClose, type = 'neutral' }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 2000)

        return () => clearTimeout(timer)
    }, [onClose])

    const colorClasses = {
        success: 'bg-green-700',
        error: 'bg-red-700',
        neutral: 'bg-neutral-900',
    }

    return (
        <>
            {message && (
                <div
                    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg ${colorClasses[type]} text-white font-bold px-4 py-2 rounded shadow-lg z-10`}
                >
                    {message}
                </div>
            )}
        </>
    )
}

export default Toast
