import React, { useState } from 'react'

const MultiSelectDropdown = ({
    label,
    options = [],
    selectedOptions = [],
    onChange,
    allowAddNew = false,
    onAddNewOption, // New prop for external callback
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [newOption, setNewOption] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

    const handleAddNewOption = () => {
        if (newOption.trim() === '') {
            setErrorMessage('Option cannot be empty')
            return
        }

        const isDuplicate = options.some(
            (option) => option.label.toLowerCase() === newOption.toLowerCase()
        )

        if (isDuplicate) {
            setErrorMessage('This option already exists.')
            return
        }

        const newOptionObject = {
            label: newOption.trim(),
            value: newOption.toLowerCase().trim(),
        }

        const updatedOptions = [...options, newOptionObject]
        const updatedSelectedOptions = [
            ...selectedOptions,
            newOptionObject.value,
        ]

        // Notify parent component of the new option
        if (onAddNewOption) {
            onAddNewOption(newOptionObject)
        }

        onChange(updatedSelectedOptions, updatedOptions)

        setNewOption('')
        setErrorMessage('')
    }

    const handleOptionSelect = (option) => {
        if (selectedOptions.includes(option.value)) {
            onChange(
                selectedOptions.filter((item) => item !== option.value),
                options
            )
        } else {
            onChange([...selectedOptions, option.value], options)
        }
    }

    const filteredOptions = options.filter(
        (option) =>
            option.label
                ? option.label.toLowerCase().includes(searchQuery.toLowerCase())
                : false // Ignore options without labels
    )

    const clearAllSelected = () => {
        onChange([], options)
    }

    return (
        <div className="w-full mb-6 relative">
            {label && (
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                    {label}
                </label>
            )}
            <div
                className="w-full border border-neutral-400 rounded-md shadow-sm cursor-pointer relative"
                onClick={toggleDropdown}
            >
                <div className="w-full px-4 py-2 flex flex-wrap gap-2 items-center">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((optionValue) => {
                            const option = options.find(
                                (opt) => opt.value === optionValue
                            )
                            return (
                                option && (
                                    <span
                                        key={option.value}
                                        className="relative px-4 py-2 text-xs bg-primary-500 text-white rounded-md"
                                    >
                                        {option.label}
                                        <span
                                            className="absolute top-0 right-0 px-1 text-white text-sm cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleOptionSelect(option)
                                            }}
                                        >
                                            &times;
                                        </span>
                                    </span>
                                )
                            )
                        })
                    ) : (
                        <span className="text-neutral-500 text-sm">
                            Select options...
                        </span>
                    )}
                    {selectedOptions.length > 0 && (
                        <button
                            className="ml-2 px-3 py-1 text-xs bg-secondary_violet-800 text-white rounded-md hover:bg-secondary_violet-900"
                            onClick={(e) => {
                                e.stopPropagation()
                                clearAllSelected()
                            }}
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-500">
                    {dropdownOpen ? '▲' : '▼'}
                </span>
            </div>
            {dropdownOpen && (
                <div className="absolute z-50 bg-white border border-neutral-400 rounded-md shadow-lg mt-2 w-full max-h-60 overflow-y-auto">
                    <div className="p-2">
                        <input
                            type="text"
                            className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Search options..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-primary-500 hover:text-white ${
                                        selectedOptions.includes(option.value)
                                            ? 'bg-primary-100'
                                            : ''
                                    }`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-neutral-500">
                                No options available.
                            </li>
                        )}
                    </ul>
                    {allowAddNew && (
                        <div className="p-2 flex items-center gap-2 border-t border-neutral-200">
                            <input
                                type="text"
                                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="Add new option..."
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                            />
                            <button
                                className="px-3 py-1 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 focus:ring-2 focus:ring-primary-400"
                                onClick={handleAddNewOption}
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            )}
            {errorMessage && (
                <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
            )}
        </div>
    )
}

export default MultiSelectDropdown
