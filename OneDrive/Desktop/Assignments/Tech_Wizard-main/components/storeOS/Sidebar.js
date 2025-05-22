// Sidebar.js - Refactored
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    ChevronDownIcon,
    Bars3Icon, // Hamburger menu icon
    XMarkIcon, // Close icon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = ({ menuConfig, setMenuState, menuState, userRole }) => {
    const [activeMenu, setActiveMenu] = useState(null) // Tracks which menu is expanded
    const [isMobileOpen, setIsMobileOpen] = useState(false) // Tracks mobile sidebar visibility
    const router = useRouter() // Next.js hook to get the current path

    const filterMenuByRole = (menuConfig, role) => {
        return menuConfig
            .map((item) => {
                // Check if the user role is allowed
                if (item.roles && !item.roles.includes(role)) {
                    return null
                }

                // If the item has children, recursively filter them
                const filteredChildren = item.children
                    ? item.children.filter(
                          (child) => !child.roles || child.roles.includes(role)
                      )
                    : null

                return { ...item, children: filteredChildren }
            })
            .filter(Boolean) // Remove null items
    }

    // Dynamically filter menuConfig based on user role
    const filteredMenu = filterMenuByRole(menuConfig, userRole)

    // Toggle a menu
    const toggleMenu = (key) => {
        setActiveMenu((prev) => (prev === key ? null : key))
    }

    // Toggle mobile sidebar
    const toggleMobileSidebar = () => {
        setIsMobileOpen((prev) => !prev)
    }

    // Check if a menu item is active
    const isActive = (route) => router.pathname.startsWith(route)

    // Render menu items dynamically based on menuState
    const renderMenu = () => {
        return filteredMenu.map((item) => (
            <div key={item.label} className="mb-2">
                <Link
                    href={item.route || '#'}
                    onClick={() => {
                        if (item.label === 'Settings') {
                            setMenuState('settings')
                        }
                        toggleMenu(item.label)
                    }}
                    className={`flex items-center w-full p-3 rounded-lg ${
                        isActive(item.route)
                            ? 'bg-primary-100 text-primary-800'
                            : 'hover:bg-primary-50 text-neutral-800'
                    }`}
                >
                    {item.icon && (
                        <item.icon
                            className={`w-5 h-5 mr-2 ${
                                isActive(item.route)
                                    ? 'text-primary-700'
                                    : 'text-neutral-700'
                            }`}
                        />
                    )}
                    <span className="flex-1 text-sm font-medium">
                        {item.label}
                    </span>
                    {item.children && (
                        <span className="ml-auto">
                            {activeMenu === item.label ? (
                                <ChevronDownIcon className="w-4 h-4 text-primary-700" />
                            ) : (
                                <ChevronRightIcon className="w-4 h-4 text-neutral-700" />
                            )}
                        </span>
                    )}
                </Link>
                {item.children && activeMenu === item.label && (
                    <div className="ml-8 mt-2 space-y-2">
                        {item.children.map((child) => (
                            <Link
                                key={child.label}
                                href={child.route || '#'}
                                className={`block w-full text-left text-sm ${
                                    isActive(child.route)
                                        ? 'text-primary-700'
                                        : 'text-neutral-700 hover:text-primary-700'
                                }`}
                            >
                                {child.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        ))
    }

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <button
                className="lg:hidden p-2 fixed top-4 left-4 z-50 bg-white rounded-full shadow-md"
                onClick={toggleMobileSidebar}
            >
                {isMobileOpen ? (
                    <XMarkIcon className="w-6 h-6 text-neutral-800" />
                ) : (
                    <Bars3Icon className="w-6 h-6 text-neutral-800" />
                )}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform lg:translate-x-0 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 lg:w-64 w-72`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-center p-4 border-b bg-neutral-100 md:py-6">
                    <img
                        src="https://briskk-bucket.s3.ap-south-1.amazonaws.com/BrandLogos/stag-beetle_logo.png"
                        alt="Brand Logo"
                        width={50}
                        height={50}
                        className="object-contain lg:w-[100%] lg:h-[100px]"
                    />
                </div>

                {/* Menu Section */}
                <div className="p-4">
                    {menuState === 'settings' && (
                        <div className="flex items-center p-3 mb-2">
                            <button
                                onClick={() => setMenuState('default')} // Switch back to default menu
                                className="flex items-center text-sm font-medium text-primary-700 hover:text-primary-900 transition"
                            >
                                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                    {renderMenu()}
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-sm text-neutral-500 text-center border-t">
                    © 2025 Briskk StoreOS. All rights reserved.
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}
        </>
    )
}

Sidebar.propTypes = {
    menuConfig: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
            children: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    route: PropTypes.string, // Add route for navigation
                })
            ),
            route: PropTypes.string, // Add route for navigation
        })
    ).isRequired,
    setMenuState: PropTypes.func.isRequired, // Function to toggle menu state
}

export default Sidebar
