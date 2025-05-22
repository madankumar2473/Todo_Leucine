import React from 'react'

const Checkbox = ({ label, checked, onChange }) => {
    return (
        <label className="flex items-center space-x-3 text-sm text-neutral-900">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="form-checkbox h-5 w-5 text-primary-500 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span>{label}</span>
        </label>
    )
}

export default Checkbox
