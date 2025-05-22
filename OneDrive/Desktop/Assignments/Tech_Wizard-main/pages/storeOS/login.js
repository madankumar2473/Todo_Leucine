import React, { useEffect } from 'react'
import Login from '@/components/storeOS/Login'
import Cookies from 'js-cookie'
import { useStoreUser } from '@/contexts/StoreUserProvider'
import { useRouter } from 'next/router'

const LoginPage = () => {
    const router = useRouter()
    const { storeStaff } = useStoreUser() // Access `storeStaff` from the context

    useEffect(() => {
        const authToken = Cookies.get('authToken')
        // Redirect to dashboard if already authenticated
        if (storeStaff && authToken) {
            router.push('/storeOS/dashboard')
        }
    }, [storeStaff, router])

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Login
                isOpen={true}
                onClose={() => {}}
                onLoginSuccess={(loggedInUser) => {
                    // Redirect to the main route after successful login
                    router.push('/storeOS/dashboard')
                }}
            />
        </div>
    )
}

export default LoginPage
