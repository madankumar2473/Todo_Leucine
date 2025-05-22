import React from 'react'

const Card = ({
    title, // Main title
    description, // Optional subtitle
    value, // Highlighted value (e.g., ₹1,598)
    leftIcon, // Icon beside the title
    rightIcon, // Icon beside the value
    bgColor = 'bg-white', // Background color
    borderColor = 'border-gray-200', // Border color
    hoverEffect = 'hover:shadow-md', // Hover shadow effect
    className = '', // Additional custom classes
    onClick, // Click handler
}) => {
    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg border ${bgColor} ${borderColor} ${hoverEffect} ${className}`}
            onClick={onClick}
        >
            {/* Left Section */}
            <div className="flex items-center space-x-2">
                {leftIcon && (
                    <div className="text-green-500 text-xl">{leftIcon}</div>
                )}
                <div>
                    {title && (
                        <h4 className="text-lg font-medium text-gray-800">
                            {title}
                        </h4>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1">
                {rightIcon && (
                    <div className="text-green-500 text-xl">{rightIcon}</div>
                )}
                {value && (
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                )}
            </div>
        </div>
    )
}

export default Card
