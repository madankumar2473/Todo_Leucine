// StoreUserContext.js
import React, { createContext, useReducer, useEffect } from 'react'
import Cookies from 'js-cookie'
import Loader from '@/components/storeOS/Loader'

const StoreUserContext = createContext()

const initialState = {
    storeStaff: null,
    loading: false,
    error: null,
    blockRendering: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_BLOCKRENDERING':
            return { ...state, blockRendering: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }
        case 'SET_STORE_STAFF':
            return {
                ...state,
                storeStaff: action.payload,
                loading: false,
                error: null,
            }
        case 'CLEAR_STORE_STAFF':
            return { ...initialState }
        default:
            return state
    }
}

export const StoreUserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const BRISK_CHANNEL_PLATFORM_API_URL =
        process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

    useEffect(() => {
        const initializeStoreStaff = async () => {
            try {
                dispatch({ type: 'SET_BLOCKRENDERING', payload: true })
                const savedStaff = JSON.parse(
                    localStorage.getItem('storeStaff')
                )
                if (savedStaff) {
                    dispatch({ type: 'SET_STORE_STAFF', payload: savedStaff })
                } else {
                    console.warn('No saved storeStaff found in localStorage.')
                }
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message })
            } finally {
                dispatch({ type: 'SET_BLOCKRENDERING', payload: false })
            }
        }
        initializeStoreStaff()
    }, [])

    const fetchStoreStaffDetails = async (staffId, tenantId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/store_staffs/${staffId}?tenant_id=${tenantId}`
            )
            if (!response.ok) {
                throw new Error('Failed to fetch storeStaff details.')
            }
            const data = await response.json()
            dispatch({ type: 'SET_STORE_STAFF', payload: data.data })
            localStorage.setItem('storeStaff', JSON.stringify(data.data)) // Persist to localStorage
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message })
        } finally {
        }
    }

    const sendOtp = async (phone) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/store_staffs/${phone}/otp`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to send OTP.')
            }
            return { success: true }
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message })
            return { success: false, message: err.message }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const verifyOtp = async (phone, otp) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/store_staffs/${phone}/verify/${otp}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                if (response.status === 422) {
                    throw new Error('Invalid OTP. Please try again.')
                }
                throw new Error('OTP verification failed.')
            }

            const data = await response.json()
            const { token } = data
            const storeStaffData = data.data

            Cookies.set('authToken', token, {
                expires: 30,
                path: '/',
                sameSite: 'Lax',
            }) // Persist auth token
            localStorage.setItem('storeStaff', JSON.stringify(storeStaffData)) // Persist storeStaff details
            dispatch({ type: 'SET_STORE_STAFF', payload: storeStaffData })
            return { success: true }
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message })
            return { success: false, message: err.message }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const clearStoreStaff = () => {
        dispatch({ type: 'CLEAR_STORE_STAFF' })
        localStorage.removeItem('storeStaff')
        Cookies.remove('authToken') // Clear auth token
    }

    if (state.blockRendering) {
        // Block rendering until initialization is complete
        return (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
                <Loader message="Hold tight! We are Loading Facility Details 🚀✨" />
            </div>
        )
    }

    return (
        <StoreUserContext.Provider
            value={{
                storeStaff: state.storeStaff,
                error: state.error,
                loading: state.loading,
                sendOtp,
                verifyOtp,
                fetchStoreStaffDetails,
                clearStoreStaff,
            }}
        >
            {children}
        </StoreUserContext.Provider>
    )
}

export const useStoreUser = () => React.useContext(StoreUserContext)
