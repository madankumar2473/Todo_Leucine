import React, {
    createContext,
    useReducer,
    useContext,
    useCallback,
} from 'react'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const ExpenditureContext = createContext()

// Initial State
const initialState = {
    expenditures: [],
    loading: false,
    error: null,
}

// Reducer Function
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        case 'SET_EXPENDITURES':
            return { ...state, expenditures: action.payload, loading: false }
        case 'ADD_EXPENDITURE':
            return {
                ...state,
                expenditures: [action.payload, ...state.expenditures],
            }
        case 'UPDATE_EXPENDITURE':
            return {
                ...state,
                expenditures: state.expenditures.map((expenditure) =>
                    expenditure.id === action.payload.id
                        ? action.payload
                        : expenditure
                ),
            }
        case 'DELETE_EXPENDITURE':
            return {
                ...state,
                expenditures: state.expenditures.filter(
                    (expenditure) => expenditure.id !== action.payload
                ),
            }
        default:
            return state
    }
}

// Provider Component
export const ExpenditureProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { tenantId, facilityId } = useTenantFacility()

    const BRISK_CHANNEL_PLATFORM_API_URL =
        process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

    let isFetching = false
    // Fetch expenditures
    const fetchExpenditures = useCallback(
        async (params) => {
            if (isFetching) return
            isFetching = true
            try {
                dispatch({ type: 'SET_LOADING', payload: true })
                dispatch({ type: 'CLEAR_ERROR' })

                const queryString = new URLSearchParams({
                    ...params,
                    tenant_id: tenantId,
                    facility_id: facilityId,
                }).toString()
                const response = await fetch(
                    `${BRISK_CHANNEL_PLATFORM_API_URL}/expenditures?${queryString}`
                )
                dispatch({ type: 'SET_LOADING', payload: false })

                if (response.ok) {
                    const responseData = await response.json()
                    dispatch({
                        type: 'SET_EXPENDITURES',
                        payload: responseData.data || [],
                    })
                } else {
                    const errorData = await response.json()
                    throw new Error(
                        errorData.message || 'Failed to fetch expenditures.'
                    )
                }
            } catch (err) {
                console.error('Error fetching expenditures:', err)
                dispatch({ type: 'SET_LOADING', payload: false })
                dispatch({ type: 'SET_ERROR', payload: err.message })
            } finally {
                isFetching = false
            }
        },
        [BRISK_CHANNEL_PLATFORM_API_URL]
    )

    // Create a new expenditure
    const createExpenditure = async (data) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            dispatch({ type: 'CLEAR_ERROR' })

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/expenditures`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        expenditure: {
                            ...data,
                            tenant_id: tenantId,
                            facility_id: facilityId,
                        },
                    }),
                }
            )
            dispatch({ type: 'SET_LOADING', payload: false })
            if (response.ok) {
                const responseData = await response.json()
                dispatch({
                    type: 'ADD_EXPENDITURE',
                    payload: responseData.data,
                })
                return { success: true, data: responseData.data }
            } else {
                const errorData = await response.json()
                throw new Error(
                    errorData.message || 'Failed to create expenditure.'
                )
            }
        } catch (err) {
            console.error('Error creating expenditure:', err)
            dispatch({ type: 'SET_ERROR', payload: err.message })
            dispatch({ type: 'SET_LOADING', payload: false })
            return { success: false }
        }
    }

    // Update an expenditure
    const updateExpenditure = async (id, data) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            dispatch({ type: 'CLEAR_ERROR' })

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/expenditures/${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        expenditure: {
                            ...data,
                            tenant_id: tenantId,
                            facility_id: facilityId,
                        },
                    }),
                }
            )
            dispatch({ type: 'SET_LOADING', payload: false })
            if (response.ok) {
                const responseData = await response.json()
                dispatch({
                    type: 'UPDATE_EXPENDITURE',
                    payload: responseData.data,
                })
                return { success: true, data: responseData.data }
            } else {
                const errorData = await response.json()
                throw new Error(
                    errorData.message || 'Failed to update expenditure.'
                )
            }
        } catch (err) {
            console.error('Error updating expenditure:', err)
            dispatch({ type: 'SET_LOADING', payload: false })
            dispatch({ type: 'SET_ERROR', payload: err.message })
            return { success: false }
        }
    }

    // Delete an expenditure
    const deleteExpenditure = async (id) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            dispatch({ type: 'CLEAR_ERROR' })

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/expenditures/${id}?tenant_id=${tenantId}&facility_id=${facilityId}`,
                {
                    method: 'DELETE',
                }
            )
            dispatch({ type: 'SET_LOADING', payload: false })
            if (response.ok) {
                dispatch({ type: 'DELETE_EXPENDITURE', payload: id })
                return { success: true }
            } else {
                const errorData = await response.json()
                throw new Error(
                    errorData.message || 'Failed to delete expenditure.'
                )
            }
        } catch (err) {
            console.error('Error deleting expenditure:', err)
            dispatch({ type: 'SET_LOADING', payload: false })
            dispatch({ type: 'SET_ERROR', payload: err.message })
            return { success: false }
        }
    }

    const clearErrorState = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    return (
        <ExpenditureContext.Provider
            value={{
                ...state,
                fetchExpenditures,
                createExpenditure,
                updateExpenditure,
                deleteExpenditure,
                clearErrorState,
            }}
        >
            {children}
        </ExpenditureContext.Provider>
    )
}

// Custom Hook
export const useExpenditure = () => {
    return useContext(ExpenditureContext)
}
