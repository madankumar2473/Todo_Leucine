import React from 'react'

const ToggleSwitch = ({ label, checked, onChange }) => {
    return (
        <div className="flex items-center space-x-3">
            {label && (
                <span className="text-sm font-medium text-neutral-900">
                    {label}
                </span>
            )}
            <button
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    checked ? 'bg-primary-500' : 'bg-neutral-300'
                }`}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
            >
                <span
                    className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-5' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    )
}

export default ToggleSwitch
