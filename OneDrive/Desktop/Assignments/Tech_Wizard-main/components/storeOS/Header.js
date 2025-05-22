import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'
import Cookies from 'js-cookie'
import Dropdown from '@/components/storeOS/Dropdown'
import {
    BellIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline'

const Header = ({ storeStaff, onLogout, toggleMobileSidebar }) => {
    const { normalizedFacilities, facilityId, setFacilityId } =
        useTenantFacility()
    const currentFacility = normalizedFacilities[facilityId] || {}
    const [dropdownLabel, setDropdownLabel] = useState(
        currentFacility?.name || 'Select Facility'
    )

    useEffect(() => {
        const newLabel =
            typeof currentFacility?.name === 'string' && currentFacility?.name
                ? currentFacility.name
                : 'Select Facility'
        setDropdownLabel(newLabel)
    }, [facilityId, normalizedFacilities, storeStaff])

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleFacilityChange = (option) => {
        setFacilityId(option.value) // Update facilityId in context
    }

    const handleLogout = () => {
        onLogout() // Callback for parent logout handling
    }

    return (
        <>
            <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
                {/* Branding and Hamburger for Mobile */}
                <div className="flex items-center">
                    {/* Hamburger Menu */}
                    <button
                        onClick={toggleMobileSidebar}
                        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full mr-3"
                    >
                        <Bars3Icon className="w-6 h-6 text-primary-800" />
                    </button>

                    {/* Facility Dropdown */}
                    <Dropdown
                        triggerLabel={dropdownLabel}
                        options={Object.values(normalizedFacilities).map(
                            (facility) => ({
                                label: facility.name,
                                value: facility.id,
                            })
                        )}
                        selectedValue={facilityId}
                        onSelect={handleFacilityChange}
                        width="w-54" // Increased width for better visibility
                        className="text-sm font-semibold " // Adjusted alignment and styling
                        menuClassName="mt-2 lg:mt-3 shadow-lg border border-gray-200"
                        optionClassName="py-2 px-3 hover:bg-primary-50 hover:text-primary-700"
                        labelClassName="text-primary-700 !font-bold py-1"
                    />
                </div>
                {/* Search Bar- TODO - add it back very less priority  */}

                {/* <div className="hidden lg:flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="ml-2 bg-transparent focus:outline-none text-sm text-gray-700"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div> */}

                {/* Right Section */}
                <div className="flex items-center">
                    {/* Notifications */}
                    <button className="relative mr-4 hidden md:flex">
                        <BellIcon className="w-6 h-6 text-gray-500" />
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* storeStaff Dropdown */}
                    {storeStaff ? (
                        <div className="relative">
                            <button
                                className="flex items-center space-x-2"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            >
                                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                    {storeStaff?.name.charAt(0)}
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700"
                            onClick={() => setLoginModalOpen(true)}
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>
        </>
    )
}

Header.propTypes = {
    storeStaff: PropTypes.shape({
        name: PropTypes.string,
    }),
    onSearch: PropTypes.func.isRequired, // Callback for search input
    onLogout: PropTypes.func.isRequired, // Callback for logout button
    toggleMobileSidebar: PropTypes.func.isRequired, // Toggle for mobile sidebar
}

export default Header
