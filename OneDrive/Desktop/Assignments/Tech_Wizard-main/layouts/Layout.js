// Layout.js - Refactored
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Sidebar from '@/components/storeOS/Sidebar'
import Header from '@/components/storeOS/Header'
import Login from '@/components/storeOS/Login'
import ProtectedRoute from '@/components/storeOS/ProtectedRoute'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useStoreUser } from '@/contexts/StoreUserProvider'
import Loader from '@/components/storeOS/Loader'
import {
    HomeIcon,
    ChartBarIcon,
    ArchiveBoxIcon,
    ChartPieIcon,
    CogIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    ClipboardDocumentIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline'

// Menu Configuration with Roles
export const menuConfig = {
    default: [
        {
            label: 'Dashboard',
            icon: HomeIcon,
            route: '/storeOS/dashboard',
            roles: ['owner', 'sales_associate', 'manager', 'inventory_manager'],
        },
        {
            label: 'Sales',
            icon: ChartBarIcon,
            roles: ['owner', 'sales_associate', 'manager'],
            children: [
                { label: 'Sales List', route: '/storeOS/sales/list' },
                { label: 'Sales Invoices', route: '/storeOS/sales/invoices' },
                { label: 'Sales Return', route: '/storeOS/sales/salesReturn' },
            ],
        },
        {
            label: 'Items',
            icon: ArchiveBoxIcon,
            route: '/storeOS/items',
            roles: ['owner', 'sales_associate', 'inventory_manager', 'manager'],
        },
        {
            label: 'Purchase Entry',
            icon: ClipboardDocumentIcon,
            route: '/storeOS/purchaseEntry',
            roles: ['owner', 'inventory_manager', 'manager'],
        },
        {
            label: 'Purchase Return',
            icon: ArrowPathIcon,
            route: '/storeOS/purchaseReturn',
            roles: ['owner', 'inventory_manager', 'manager'],
        },
        {
            label: 'Reports',
            icon: ChartPieIcon,
            route: '/storeOS/reports',
            roles: ['owner', 'manager'],
        },
        {
            label: 'Manage Expenditures',
            icon: CurrencyDollarIcon,
            route: '/storeOS/expenditures',
            roles: ['owner', 'manager', 'sales_associate'],
        },
        {
            label: 'Settings',
            icon: CogIcon,
            route: null, // No direct route
            roles: ['owner', 'manager'],
        },
        //Edit INvoice without label
        {
            label: '',
            route: '/storeOS/sales/edit/:orderId',
            roles: ['owner', 'manager'],
        },
    ],
    settings: [
        {
            label: 'Account',
            icon: UserIcon,
            route: '/storeOS/settings/account',
        },
        // {
        //     label: 'Logout',
        //     icon: ArrowLeftOnRectangleIcon,
        //     route: '/storeOS/logout',
        // },
    ],
}

const Layout = ({ title, children }) => {
    const router = useRouter()
    const { storeStaff, clearStoreStaff } = useStoreUser()
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [isLoginModalOpen, setLoginModalOpen] = useState(false)
    const [menuState, setMenuState] = useState('default') // Tracks menu state

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev)
    }

    const handleLogout = () => {
        clearStoreStaff()
        setLoginModalOpen(true)
        router.push('/storeOS/login')
    }

    const handleLoginSuccess = () => {
        setLoginModalOpen(false)
    }

    // Determine the current menu to display
    const currentMenu =
        menuState === 'default' ? menuConfig.default : menuConfig.settings

    // great hack of all time at 5 am moring  --will remove later

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user')
            if (user) {
                Cookies.remove('authToken')
                localStorage.removeItem('user')
                router.push('/storeOS/login')
                return
            }
        }
    }, [])

    return (
        <ProtectedRoute requiredRoles={['manager', 'owner']}>
            <div className="flex h-screen bg-neutral-100">
                {/* Sidebar for Desktop */}
                <div className="hidden md:block md:w-64 bg-primary-700 text-white">
                    <Sidebar
                        menuConfig={currentMenu}
                        setMenuState={setMenuState}
                        menuState={menuState}
                        userRole={storeStaff?.role}
                    />
                </div>

                {/* Mobile Sidebar */}
                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                        onClick={toggleMobileSidebar}
                    ></div>
                )}
                <div
                    className={`fixed inset-y-0 left-0 z-50 h-screen transform bg-primary-700 shadow-md transition-transform md:hidden ${
                        isMobileSidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }`}
                >
                    <Sidebar
                        menuConfig={currentMenu}
                        setMenuState={setMenuState}
                        menuState={menuState}
                        userRole={storeStaff?.role}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 shadow-md">
                        <Header
                            storeStaff={storeStaff}
                            onLogout={handleLogout}
                            toggleMobileSidebar={toggleMobileSidebar}
                        />
                    </div>

                    {/* Page Content */}
                    <div className="flex flex-col p-4 space-y-6 overflow-y-auto">
                        {/* Dynamic Page Title */}
                        <div className="px-4 py-2 bg-white rounded-lg shadow">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {title}
                            </h1>
                        </div>

                        {/* Main Content */}
                        <main className="flex-1">{children}</main>
                    </div>
                </div>

                {/* Login Modal */}
                <Login
                    isOpen={isLoginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            </div>
        </ProtectedRoute>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired, // Content to render in the main area
    title: PropTypes.string, // Optional dynamic title
}

export default Layout
