import React, {
    createContext,
    useState,
    useContext,
    useReducer,
    useCallback,
} from 'react'
import Cookies from 'js-cookie'

const ReportingContext = createContext()

const BRISK_CHANNEL_PLATFORM_API_URL =
    process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

const initialState = {
    salesData: null,
    gstData: null,
    stockMovementData: null,
    loading: false,
    error: null,
}

const reportingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload } // Dynamically set loading state
        case 'SET_SALES_DATA':
            return { ...state, loading: false, salesData: action.payload }
        case 'SET_GST_DATA':
            return { ...state, loading: false, gstData: action.payload }
        case 'SET_STOCK_MOVEMENT_DATA':
            return {
                ...state,
                loading: false,
                stockMovementData: action.payload,
            }
        case 'SET_ERROR':
            return {
                ...state,
                loading: false,
                error: `Error ${action.payload.status}: ${action.payload.message}`,
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

export const ReportingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reportingReducer, initialState)

    const buildFilters = (filters) => new URLSearchParams(filters).toString()

    let isFetching = false
    const fetchSalesData = useCallback(async (filters) => {
        if (isFetching) return
        isFetching = true
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const query = buildFilters(filters)
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/reports/sales?${query}`
            )
            if (!response.ok)
                throw {
                    status: response.status,
                    message: 'Failed to fetch sales data.',
                }
            const data = await response.json()
            dispatch({
                type: 'SET_SALES_DATA',
                payload: modifyResponse(data.data),
            })
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
            isFetching = false
        }
    }, [])

    const fetchGstData = useCallback(async (filters) => {
        try {
            const query = buildFilters(filters)
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/reports/gst_breakdown?${query}`
            )
            if (!response.ok)
                throw {
                    status: response.status,
                    message: 'Failed to fetch GST data.',
                }
            const data = await response.json()
            dispatch({
                type: 'SET_GST_DATA',
                payload: modifyResponse(data.data),
            })
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err })
        }
    }, [])

    const fetchStockMovementData = useCallback(async (filters) => {
        try {
            const query = buildFilters(filters)
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/reports/inventory/stock_movement?${query}`
            )
            if (!response.ok)
                throw {
                    status: response.status,
                    message: 'Failed to fetch stock movement data.',
                }
            const data = await response.json()
            dispatch({
                type: 'SET_STOCK_MOVEMENT_DATA',
                payload: data,
            })
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err })
        }
    }, [])

    const modifyResponse = (data) => {
        return {
            ...data,
            modifiedAt: new Date().toISOString(),
        }
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const fetchOrders = useCallback(async (filters = {}) => {
        try {
            // Include default filters, such as 'source: in_store'
            const defaultFilters = { source: 'in_store' }
            const query = new URLSearchParams({
                ...defaultFilters,
                ...filters,
                page_size: 100,
            }).toString()

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/orders?${query}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                }
            )

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: 'Failed to fetch orders.',
                }
            }
            const data = await response.json()
            return data
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err })
            return { data: [] } // Return an empty array in case of errors
        } finally {
        }
    }, [])

    return (
        <ReportingContext.Provider
            value={{
                salesData: state.salesData,
                gstData: state.gstData,
                stockMovementData: state.stockMovementData,
                loading: state.loading,
                error: state.error,
                fetchSalesData,
                fetchGstData,
                fetchStockMovementData,
                clearError,
                fetchOrders,
            }}
        >
            {children}
        </ReportingContext.Provider>
    )
}

export const useReporting = () => {
    return useContext(ReportingContext)
}
