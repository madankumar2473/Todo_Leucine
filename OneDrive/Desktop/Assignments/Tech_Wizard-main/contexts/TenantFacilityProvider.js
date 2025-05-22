// TenantFacilityContext.js

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useRef,
} from 'react'
import Loader from '@/components/storeOS/Loader'
import { useStoreUser } from '@/contexts/StoreUserProvider'

const BRISK_CHANNEL_PLATFORM_API_URL =
    process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

// Initial state
const initialState = {
    tenantId: null,
    facilityId: null,
    facilities: {}, // Cached facilities
    normalizedFacilities: {}, // Cached facilities by facilityId
    loading: true, // By Default make loading true ...check line 113 ..
    //one of great hacks used in industry and luckily i learned these hacks
    error: null,
}

// Reducer function
const tenantFacilityReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TENANT':
            return { ...state, tenantId: action.payload }
        case 'SET_FACILITY':
            return { ...state, facilityId: action.payload }
        case 'SET_FACILITIES':
            const normalizedFacilities = action.payload.reduce(
                (acc, facility) => {
                    acc[facility.id] = facility // Normalize by facilityId
                    return acc
                },
                {}
            )
            return {
                ...state,
                facilities: {
                    ...state.facilities,
                    [action.tenantId]: action.payload,
                },
                normalizedFacilities: {
                    ...state.normalizedFacilities,
                    ...normalizedFacilities, // Facility-based caching
                },
            }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        default:
            return state
    }
}

const TenantFacilityContext = createContext()

export const TenantFacilityProvider = ({ children }) => {
    const { storeStaff } = useStoreUser()
    const [state, dispatch] = useReducer(tenantFacilityReducer, initialState)
    const isFetching = useRef(false) // Track ongoing API calls

    // Fetch facilities for the tenant
    const fetchFacilities = async (tenantId) => {
        if (state.facilities[tenantId]) {
            console.log(
                'Returning cached facilities:',
                state.facilities[tenantId]
            )
            return state.facilities[tenantId] // Return cached facilities
        }
        if (isFetching.current) {
            console.log('API call in progress, skipping duplicate fetch')
            return
        }
        isFetching.current = true
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/facilities?tenant_id=${tenantId}`
            )
            const data = await response.json()
            dispatch({ type: 'SET_FACILITIES', tenantId, payload: data.data }) // Cache the facilities
            return data.data
        } catch (error) {
            console.error('Failed to fetch facilities:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
            return []
        } finally {
            isFetching.current = false // Reset the flag
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    useEffect(() => {
        const initialize = async () => {
            const staff =
                storeStaff || JSON.parse(localStorage.getItem('storeStaff'))
            const savedFacilityId = localStorage.getItem('selectedFacilityId')

            if (staff) {
                dispatch({ type: 'SET_TENANT', payload: staff.tenant_id })
                dispatch({
                    type: 'SET_FACILITY',
                    payload: savedFacilityId || staff.facility_id,
                })
                await fetchFacilities(staff.tenant_id) // Wait for initialization
            }
            dispatch({ type: 'SET_LOADING', payload: false })
        }
        initialize()
    }, [storeStaff])

    if (state.loading) {
        // Block rendering until initialization is complete
        return (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
                <Loader message="Hold tight! We are Loading Facility Details 🚀✨" />
            </div>
        )
    }

    const getFacilityById = (facilityId) => {
        return state.normalizedFacilities[facilityId] || null
    }

    return (
        <TenantFacilityContext.Provider
            value={{
                tenantId: state.tenantId,
                facilityId: state.facilityId,
                facilities: state.facilities,
                normalizedFacilities: state.normalizedFacilities,
                error: state.error,
                getFacilityById,
                setTenantId: (newTenantId) =>
                    dispatch({ type: 'SET_TENANT', payload: newTenantId }),
                setFacilityId: (newFacilityId) => {
                    dispatch({ type: 'SET_LOADING', payload: true }) // Set loading to true
                    localStorage.setItem('selectedFacilityId', newFacilityId) // Save in localStorage
                    dispatch({ type: 'SET_FACILITY', payload: newFacilityId }) // Update facilityId
                    setTimeout(() => {
                        dispatch({ type: 'SET_LOADING', payload: false }) // Clear loading after transition
                    }, 300) // Optional delay for smooth transitions
                },
                fetchFacilities, // Expose fetch function if needed
            }}
        >
            {children}
        </TenantFacilityContext.Provider>
    )
}

export const useTenantFacility = () => useContext(TenantFacilityContext)
