import React, { createContext, useReducer, useContext } from 'react'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const BRISK_CHANNEL_PLATFORM_API_URL =
    process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

/** -------------------------
 *     INITIAL STATE
 * -------------------------- */
export const initialState = {
    // Holds all scanned items
    scannedItems: [],

    // Barcodes currently in-flight (prevents concurrent fetch of same barcode)
    fetchingBarcodes: new Set(),

    // Timestamp of last scan, used for ignoring duplicates < 200ms
    lastScanTime: 0,

    // A simple global loading state (true if any fetch is ongoing)
    loading: false,

    // Holds any global error messages from scanning/fetching
    error: null,
}

/** -------------------------
 *     REDUCER
 * -------------------------- */
export const purchaseEntryReducer = (state, action) => {
    switch (action.type) {
        /** ADD_ITEM
         * If barcode exists, increment quantity;
         * else, add a new row with additionalQty = 1
         */
        case 'ADD_ITEM': {
            const existingIndex = state.scannedItems.findIndex(
                (item) => item.barcode === action.payload.barcode
            )
            if (existingIndex !== -1) {
                // Adjust quantity by (incrementBy || 1)
                return {
                    ...state,
                    scannedItems: state.scannedItems.map((item, idx) =>
                        idx === existingIndex
                            ? {
                                  ...item,
                                  additionalQty:
                                      item.additionalQty +
                                      (action.payload.incrementBy || 1),
                              }
                            : item
                    ),
                }
            }
            // Otherwise, add a new item with quantity=1
            return {
                ...state,
                scannedItems: [
                    ...state.scannedItems,
                    {
                        ...action.payload,
                        additionalQty: 1,
                    },
                ],
            }
        }

        /** UPDATE_ITEM_QTY
         * Directly set additionalQty for a specific barcode
         */
        case 'UPDATE_ITEM_QTY': {
            return {
                ...state,
                scannedItems: state.scannedItems.map((item) =>
                    item.barcode === action.payload.barcode
                        ? {
                              ...item,
                              additionalQty: action.payload.newQty,
                          }
                        : item
                ),
            }
        }

        /** REMOVE_ITEM
         * Remove an item by barcode
         */
        case 'REMOVE_ITEM': {
            return {
                ...state,
                scannedItems: state.scannedItems.filter(
                    (i) => i.barcode !== action.payload.barcode
                ),
            }
        }

        /** UPDATE_ITEM_FIELD
         * Generic field update, e.g., changing customCode
         */
        case 'UPDATE_ITEM_FIELD': {
            const { barcode, field, value } = action.payload
            return {
                ...state,
                scannedItems: state.scannedItems.map((item) =>
                    item.barcode === barcode
                        ? { ...item, [field]: value }
                        : item
                ),
            }
        }

        /** MARK_FAILED_ITEMS
         * Mark given array of barcodes with updateStatus = 'failed'
         */
        case 'MARK_FAILED_ITEMS': {
            const failedBarcodes = action.payload // array of barcodes
            return {
                ...state,
                scannedItems: state.scannedItems.map((item) =>
                    failedBarcodes.includes(item.barcode)
                        ? { ...item, updateStatus: 'failed' }
                        : item
                ),
            }
        }

        /** SET_SCANNED_ITEMS
         * Replace the entire scannedItems array (e.g., after a stock refresh)
         */
        case 'SET_SCANNED_ITEMS': {
            return {
                ...state,
                scannedItems: action.payload,
            }
        }

        /** SET_FETCHING
         * Add a barcode to the fetching set, set loading = true
         */
        case 'SET_FETCHING': {
            const newFetching = new Set(state.fetchingBarcodes)
            newFetching.add(action.payload.barcode)
            return {
                ...state,
                fetchingBarcodes: newFetching,
                loading: true,
            }
        }

        /** CLEAR_FETCHING
         * Remove a barcode from the fetching set
         * loading = false if no more barcodes are in flight
         */
        case 'CLEAR_FETCHING': {
            const newFetching = new Set(state.fetchingBarcodes)
            newFetching.delete(action.payload.barcode)
            return {
                ...state,
                fetchingBarcodes: newFetching,
                loading: newFetching.size === 0, // only false if all done
            }
        }

        /** SET_LAST_SCAN_TIME
         * Keep track of the last scan timestamp
         */
        case 'SET_LAST_SCAN_TIME': {
            return {
                ...state,
                lastScanTime: action.payload.time,
            }
        }

        /** SET_ERROR
         * Set global error message, turn off loading
         */
        case 'SET_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        }

        /** CLEAR_ERROR
         * Clear the global error
         */
        case 'CLEAR_ERROR': {
            return {
                ...state,
                error: null,
            }
        }

        default:
            return state
    }
}

/** -------------------------
 *  CONTEXT + PROVIDER
 * -------------------------- */
const PurchaseEntryContext = createContext()

export const PurchaseEntryProvider = ({ children }) => {
    const { facilityId } = useTenantFacility()
    const [state, dispatch] = useReducer(purchaseEntryReducer, initialState)

    /** fetchSKUByBarcode
     * 1) Skip if within 200ms of last scan
     * 2) Skip if we are already fetching the same barcode
     * 3) Otherwise, fetch from the backend; dispatch ADD_ITEM on success
     */
    const fetchSKUByBarcode = async (barcodeValue) => {
        const now = Date.now()

        // 1) Rapid scan check
        if (now - state.lastScanTime < 200) {
            return { error: 'rapid_scan' }
        }
        dispatch({ type: 'SET_LAST_SCAN_TIME', payload: { time: now } })

        // 2) If item already exists, just increment
        const existingItem = state.scannedItems.find(
            (item) => item.barcode === barcodeValue
        )
        if (existingItem) {
            // Increase the existing quantity by 1
            const newQty = existingItem.additionalQty + 1
            updateItemQty(barcodeValue, newQty)
            return { success: true, alreadyInList: true }
        }

        // 3) Concurrency check
        if (state.fetchingBarcodes.has(barcodeValue)) {
            return { error: 'already_fetching' }
        }

        // 4) Dispatch SET_FETCHING for this barcode
        dispatch({ type: 'SET_FETCHING', payload: { barcode: barcodeValue } })

        try {
            // 5) Do the actual fetch
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/search?includes=inventory.facility&barcode=${barcodeValue}`
            )
            if (!response.ok) {
                throw new Error('Failed to fetch SKU details')
            }

            const data = await response.json()
            const item = data?.data?.[0]
            if (!item) {
                throw new Error('SKU not found')
            }

            // HERE we check if item belongs to same facilty
            const matchingInventory = item.inventory?.find(
                (inv) => inv.facility_id === facilityId
            )

            if (!matchingInventory) {
                // If none found, set an error or return an error message
                dispatch({
                    type: 'SET_ERROR',
                    payload:
                        'This item is not available for the selected facility.',
                })
                // Early exit
                return { error: 'facility_mismatch' }
            }

            const existingStock = matchingInventory.stock || 0

            // If item found, dispatch ADD_ITEM
            dispatch({
                type: 'ADD_ITEM',
                payload: {
                    barcode: barcodeValue,
                    displayName: item.display_name,
                    customCode: item.custom_code,
                    mrp: item.base_price,
                    sellingPrice: item.offer_price,
                    existingStock: existingStock,
                    facilityId: matchingInventory.facility_id,
                    id: item.id,
                    product_id: item.product_id,
                },
            })
            return { success: true, alreadyInList: false }
        } catch (error) {
            // On fetch fail, set global error
            dispatch({ type: 'SET_ERROR', payload: error.message })
            return { error: error.message }
        } finally {
            // 6) CLEAR_FETCHING
            dispatch({
                type: 'CLEAR_FETCHING',
                payload: { barcode: barcodeValue },
            })
        }
    }

    /** updateItemQty
     *  Simple dispatch: set a new quantity
     */
    const updateItemQty = (barcode, newQty) => {
        dispatch({
            type: 'UPDATE_ITEM_QTY',
            payload: { barcode, newQty },
        })
    }

    /** removeItem
     *  Remove an item by barcode
     */
    const removeItem = (barcode) => {
        dispatch({
            type: 'REMOVE_ITEM',
            payload: { barcode },
        })
    }

    /** updateItemField
     *  e.g., for customCode or any other field
     */
    const updateItemField = (barcode, field, value) => {
        dispatch({
            type: 'UPDATE_ITEM_FIELD',
            payload: { barcode, field, value },
        })
    }

    /** markFailedItems
     *  e.g., after a failed saveAllChanges
     */
    const markFailedItems = (barcodesArray) => {
        dispatch({
            type: 'MARK_FAILED_ITEMS',
            payload: barcodesArray,
        })
    }

    /** setScannedItems
     *  Replace the entire array (e.g., post-refresh)
     */
    const setScannedItems = (newItems) => {
        dispatch({
            type: 'SET_SCANNED_ITEMS',
            payload: newItems,
        })
    }

    /** clearError
     *  So we can clear global error from the UI
     */
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    // Bundle all these in a single value for the context
    return (
        <PurchaseEntryContext.Provider
            value={{
                state,
                dispatch,
                fetchSKUByBarcode,
                updateItemQty,
                removeItem,
                updateItemField,
                markFailedItems,
                setScannedItems,
                clearError,
            }}
        >
            {children}
        </PurchaseEntryContext.Provider>
    )
}

/** Hook to use context from any component */
export const usePurchaseEntry = () => {
    return useContext(PurchaseEntryContext)
}
