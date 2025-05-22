import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const Dropdown = ({
    triggerLabel,
    triggerIcon: TriggerIcon,
    options,
    onSelect,
    width,
    className,
    menuClassName,
    optionClassName,
    position,
    isOpen: controlledIsOpen,
    onToggle,
    defaultValue,
    selectedValue,
    labelClassName = '',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef()
    const [selectedLabel, setSelectedLabel] = useState(triggerLabel || '')

    // Sync label with triggerLabel if provided
    useEffect(() => {
        if (triggerLabel) {
            setSelectedLabel(triggerLabel)
        }
    }, [triggerLabel])

    const toggleDropdown = () => {
        if (onToggle) {
            onToggle(!isOpen)
        } else {
            setIsOpen((prev) => !prev)
        }
    }

    const handleSelect = (option) => {
        setSelectedLabel(option.label)
        setIsOpen(false)
        if (onSelect) onSelect(option)
    }

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const positionClasses = {
        bottom: 'top-full left-0',
        top: 'bottom-full left-0',
        left: 'top-0 right-full',
        right: 'top-0 left-full',
    }

    const isDropdownOpen =
        controlledIsOpen !== undefined ? controlledIsOpen : isOpen

    return (
        <div className={`relative ${width} ${className}`} ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg shadow-md focus:outline-none hover:bg-gray-200"
            >
                <div className="flex items-center space-x-2">
                    {TriggerIcon && (
                        <TriggerIcon className="w-5 h-5 text-gray-600" />
                    )}
                    <span
                        className={`text-gray-700 font-medium ${labelClassName}`}
                    >
                        {selectedLabel || 'Select an Option'}
                    </span>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </button>

            {isDropdownOpen && (
                <div
                    role="menu"
                    className={`absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${menuClassName} ${positionClasses[position]}`}
                >
                    {options.map((option, index) => (
                        <button
                            key={index}
                            role="menuitem"
                            tabIndex={0}
                            onClick={() => handleSelect(option)}
                            className={`flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all ${optionClassName} ${
                                selectedValue === option.value
                                    ? 'bg-primary-100 text-primary-700 font-semibold'
                                    : ''
                            }`}
                        >
                            {option.icon && (
                                <option.icon className="w-5 h-5 text-primary-600 mr-2" />
                            )}
                            <span className="text-sm">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

Dropdown.propTypes = {
    triggerLabel: PropTypes.string, // Label for the dropdown trigger
    triggerIcon: PropTypes.elementType, // Optional icon for the trigger
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired, // Option label
            value: PropTypes.string.isRequired, // Option value
            icon: PropTypes.elementType, // Optional icon for the option
        })
    ).isRequired,
    onSelect: PropTypes.func, // Callback for option selection
    width: PropTypes.string, // Custom width (e.g., 'w-full', 'w-auto')
    className: PropTypes.string, // Custom class for the container
    menuClassName: PropTypes.string, // Custom class for the dropdown menu
    optionClassName: PropTypes.string, // Custom class for dropdown options
    position: PropTypes.oneOf(['bottom', 'top', 'left', 'right']), // Dropdown position
    isOpen: PropTypes.bool, // Controlled state for dropdown visibility
    onToggle: PropTypes.func, // Callback for toggle event
    defaultValue: PropTypes.string, // Default selected value
    selectedValue: PropTypes.string, // Value of the currently selected option
}

Dropdown.defaultProps = {
    triggerIcon: null, // No trigger icon by default
    onSelect: () => {}, // No-op callback
    width: 'auto', // Default to auto for flexibility
    className: '', // Default to no additional styling
    menuClassName: '', // No additional menu styling by default
    optionClassName: '', // No additional option styling by default
    position: 'bottom', // Default dropdown position
    isOpen: undefined, // Uncontrolled by default
    onToggle: null, // No-op toggle handler
    selectedValue: null, // No selected value initially
}

export default Dropdown
