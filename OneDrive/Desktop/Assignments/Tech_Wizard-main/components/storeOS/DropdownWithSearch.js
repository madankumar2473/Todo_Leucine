import React, { useState, useRef, useEffect } from 'react'

const DropdownWithSearch = ({
    placeholder = 'Search...',
    options = [],
    onSelect,
    footerCTA, // Optional CTA at the bottom
    onFooterClick, // Action when CTA is clicked
    onSearchChange,
    searchQuery,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Filtered Options based on Search
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Toggle Dropdown
    const toggleDropdown = () => setIsOpen((prev) => !prev)

    // Handle Select Option
    const handleSelect = (option) => {
        if (onSelect) onSelect(option)
        setIsOpen(false) // Close dropdown on selection
    }

    // Close Dropdown on Click Outside
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Search Input */}
            <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onClick={() => setIsOpen(true)} // Open dropdown on input click
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value.id || option.value} // Use unique key
                                onClick={() => handleSelect(option)}
                                className="px-4 py-2 cursor-pointer hover:bg-primary-500 hover:text-white"
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-neutral-500">
                            No results, please enter three or more characters.
                        </div>
                    )}

                    {/* Footer CTA */}
                    {footerCTA && onFooterClick && (
                        <div
                            className="px-4 py-2 text-primary-500 cursor-pointer hover:bg-gray-100"
                            onClick={onFooterClick}
                        >
                            {footerCTA}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default DropdownWithSearch
