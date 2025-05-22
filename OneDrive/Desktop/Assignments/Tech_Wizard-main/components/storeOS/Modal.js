import React, { useEffect, useRef } from 'react'

const Modal = ({
    isOpen,
    onClose,
    header, // Dynamic header as prop
    footer, // Dynamic footer as prop
    children, // Main content
    size = 'medium',
    closeOnBackdropClick = true,
    className = '',
}) => {
    const modalRef = useRef(null)

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Focus management for accessibility
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    // Modal size classes
    const sizeClasses = {
        small: 'max-w-sm',
        medium: 'max-w-lg',
        large: 'max-w-2xl',
        full: 'w-full h-full max-w-none',
    }
    
    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeOnBackdropClick ? onClose : undefined}
        >
            <div
                className={`relative bg-white rounded-lg shadow-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 ${sizeClasses[size]} ${className} w-full`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                ref={modalRef}
                tabIndex={-1} // Allow focus on the modal
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-700 hover:text-neutral-900 focus:outline-none cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Header */}
                {header && (
                    <div className="p-4 border-b border-neutral-300">
                        {header}
                    </div>
                )}

                {/* Main Content */}
                <div className="p-4 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-neutral-200 flex justify-end space-x-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal
