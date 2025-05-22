import React from 'react'

const InputField = ({
    label,
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    validation = {},
    error = '',
    isRequired = false,
    disabled = false, // New prop for disabling input
    className = '',
}) => {
    // Consolidated validation logic
    const handleValidation = (value) => {
        const errors = []

        if (isRequired && !value) {
            errors.push('This field is required.')
        }
        if (validation.minLength && value.length < validation.minLength) {
            errors.push(`Must be at least ${validation.minLength} characters.`)
        }
        if (validation.maxLength && value.length > validation.maxLength) {
            errors.push(`Cannot exceed ${validation.maxLength} characters.`)
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            errors.push('Invalid format.')
        }
        if (validation.custom && typeof validation.custom === 'function') {
            const customError = validation.custom(value)
            if (customError) errors.push(customError)
        }

        return errors.join(' ')
    }

    const handleChange = (e) => {
        const inputValue = e.target.value
        const errorMessage = handleValidation(inputValue)
        onChange(inputValue, errorMessage)
    }

    return (
        <div className="w-full">
            {label && (
                <label
                    className="flex items-center text-sm font-medium text-neutral-900 mb-2"
                    htmlFor={label}
                >
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={label}
                className={`w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:outline-none ${className} ${
                    error ? 'border-red-500' : 'border-neutral-400'
                } ${disabled ? 'bg-neutral-300 cursor-not-allowed' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                aria-label={label}
                aria-invalid={!!error}
                aria-describedby={error ? `${label}-error` : undefined}
                max={validation.max || undefined}
                min={validation.min || undefined}
            />
            {error && (
                <p id={`${label}-error`} className="text-xs text-red-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}

export default InputField
