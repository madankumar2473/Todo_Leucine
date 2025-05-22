import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Loader from '@/components/storeOS/Loader'
import { useStoreUser } from '@/contexts/StoreUserProvider'
import { menuConfig } from '@/layouts/Layout' // Import your menuConfig

const ProtectedRoute = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false)
    const { storeStaff, fetchStoreStaffDetails, loading } = useStoreUser()
    const router = useRouter()

    useEffect(() => {
        const initialize = async () => {
            setIsMounted(true)

            const authToken = Cookies.get('authToken')
            if (!authToken) {
                console.warn('No auth token found. Redirecting to login.')
                await router.push('/storeOS/login')
                return
            }
            //  TODO: to be added later ...validate storeStaff
            // if (!storeStaff) {
            //     try {
            //         console.log('Fetching store staff details...')
            //         await fetchStoreStaffDetails()
            //     } catch (error) {
            //         console.error('Error fetching store staff:', error)
            //         await router.push('/storeOS/login')
            //     }
            // }
        }

        initialize()
    }, [storeStaff, fetchStoreStaffDetails, router])

    // Ensure data is fully loaded before checking access
    if (!isMounted || loading || !storeStaff) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader message="Authenticating... Please wait." />
            </div>
        )
    }

    // Helper Function to Match Dynamic Routes
    const matchDynamicRoute = (template, actualRoute) => {
        const templateSegments = template?.split('/')
        const actualSegments = actualRoute.split('/')

        if (templateSegments?.length !== actualSegments.length) {
            return false
        }

        return templateSegments.every((segment, index) => {
            return segment.startsWith(':') || segment === actualSegments[index]
        })
    }

    // Validate route based on menuConfig and user role
    const currentRoute = router.pathname // Get current route
    const isRouteAccessible = menuConfig.default.some((menuItem) => {
        const roles = menuItem.roles || []
        const isParentRouteAccessible =
            roles.includes(storeStaff?.role) &&
            currentRoute.startsWith(menuItem.route)

        const isChildRouteAccessible = menuItem.children?.some((child) => {
            const childRoles = child.roles || roles // Inherit parent roles if child roles are missing
            return (
                childRoles.includes(storeStaff?.role) &&
                matchDynamicRoute(child.route, currentRoute)
            )
        })

        const isExplicitRouteAccessible =
            matchDynamicRoute(menuItem.route, currentRoute) &&
            roles.includes(storeStaff?.role)

        return (
            isParentRouteAccessible ||
            isChildRouteAccessible ||
            isExplicitRouteAccessible
        )
    })

    if (!isRouteAccessible) {
        console.warn(`Access denied for role: ${storeStaff?.role}`)
        router.push('/storeOS/dashboard') // TODO: Redirect unauthorized users later
        return null
    }

    return <>{children}</>
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ProtectedRoute

// Why Use matchDynamicRoute in isChildRouteAccessible?
// Dynamic Child Routes:

// When dealing with child routes like /storeOS/sales/invoices/:id, matchDynamicRoute ensures that:
// The current route (currentRoute) matches the dynamic template (child.route).
// The user's role is validated against the child’s roles or the inherited parent roles.
// Child-Specific Matching:

// isChildRouteAccessible focuses exclusively on child routes under a parent. It checks for routes explicitly defined in the children array of a menuItem.
// Why Not Rely on isExplicitRouteAccessible?

// isExplicitRouteAccessible is designed for top-level routes directly listed in menuConfig.default.
// Child routes often need additional validation to ensure they belong to the correct parent. This avoids granting access to unrelated dynamic routes.
// How isExplicitRouteAccessible Differs
// isExplicitRouteAccessible is for standalone routes directly listed in menuConfig.default or at the top level.
// Example:
// A route like /storeOS/sales/edit/:orderId could be directly defined in menuConfig.default.
// When Both Are Used
// If a route matches a top-level route or a parent-child relationship, both conditions may apply:
// isChildRouteAccessible ensures the current route matches a child of the parent.
// isExplicitRouteAccessible validates standalone top-level routes or dynamic routes directly listed in menuConfig.
