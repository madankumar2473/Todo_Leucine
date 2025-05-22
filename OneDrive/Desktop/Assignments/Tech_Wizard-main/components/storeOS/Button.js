import React from 'react'
import PropTypes from 'prop-types'

const Button = ({
    label,
    iconBefore: IconBefore,
    iconAfter: IconAfter,
    variant,
    width,
    size,
    onClick,
    disabled, // Added disabled prop
}) => {
    // Define button styles based on the variant
    const baseStyles = `inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-all`
    const sizeStyles = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-md',
        large: 'px-5 py-3 text-lg',
    }
    const variantStyles = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        outline:
            'border border-primary-600 text-primary-600 hover:bg-primary-100',
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled} // Disable button when loading or explicitly disabled
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${width} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`} // Add visual feedback for disabled state
        >
            {/* Optional Icon Before */}

            {IconBefore && <IconBefore className="w-5 h-5 mr-2" />}
            {label}
            {/* Optional Icon After */}
            {IconAfter && <IconAfter className="w-5 h-5 ml-2" />}
        </button>
    )
}

Button.propTypes = {
    label: PropTypes.string.isRequired, // Button text
    iconBefore: PropTypes.elementType, // Optional icon before the label
    iconAfter: PropTypes.elementType, // Optional icon after the label
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline']), // Button style variant
    width: PropTypes.string, // Custom width (e.g., 'w-full', 'w-auto')
    size: PropTypes.oneOf(['small', 'medium', 'large']), // Button size
    onClick: PropTypes.func, // Click handler
    loading: PropTypes.bool, // Loading state
    disabled: PropTypes.bool, // Disabled state
}

Button.defaultProps = {
    iconBefore: null, // No icon before by default
    iconAfter: null, // No icon after by default
    variant: 'primary', // Default to primary style
    width: 'w-auto', // Default width
    size: 'medium', // Default size
    onClick: () => {}, // No-op click handler
    loading: false, // Default to not loading
    disabled: false, // Default to not disabled
}

export default Button
