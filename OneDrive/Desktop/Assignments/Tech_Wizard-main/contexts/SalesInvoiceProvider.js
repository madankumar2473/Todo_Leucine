import React, {
    createContext,
    useContext,
    useReducer,
    useState,
    useEffect,
} from 'react'
import Cookies from 'js-cookie'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'
import { useStoreUser } from '@/contexts/StoreUserProvider'

const SalesInvoiceContext = createContext()

// Initial State
const initialState = {
    customers: [],
    items: [],
    salesOrders: [],
    selectedCustomer: null,
    selectedSKUs: [],
    discountsLog: [], // New addition to log discounts
    invoiceTotals: {
        subtotal: 0.0,
        taxes: 0.0,
        total: 0.0,
        gstBreakdown: {},
        totalQuantity: 0,
    },
    hsnDetailsCache: {}, // New cache for HSN details
    loading: false,
    error: null,
    errorDetails: null, // Detailed error logs
    invoiceHTML: '',
    storeStaff: [],
    selectedStaff: null,
    cartId: null,
    cartItems: [],
    paymentMethod: '',
    toast: {
        type: '',
        message: '',
        isVisible: false,
    },
}

// Reducer Function
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload } // Dynamically set loading state
        case 'SET_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
                errorDetails: action.payload.details || null,
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null, errorDetails: null }
        case 'SET_CUSTOMERS':
            return { ...state, loading: false, customers: action.payload }
        case 'SET_SELECTED_CUSTOMER':
            return { ...state, selectedCustomer: action.payload }
        case 'SET_ITEMS':
            return { ...state, loading: false, items: action.payload }
        case 'ADD_SKU':
            return {
                ...state,
                selectedSKUs: [...state.selectedSKUs, action.payload],
            }
        case 'REMOVE_SKU':
            return {
                ...state,
                selectedSKUs: state.selectedSKUs.filter(
                    (sku) => sku.id !== action.payload
                ),
            }
        case 'UPDATE_SKU':
            return {
                ...state,
                selectedSKUs: state.selectedSKUs.map((sku) =>
                    sku.id === action.payload.id
                        ? { ...sku, ...action.payload.updates }
                        : sku
                ),
            }
        case 'RESET_SKU_IN_CART':
            return {
                ...state,
                selectedSKUs: [],
            }
        case 'UPDATE_TOTALS':
            return { ...state, invoiceTotals: action.payload }
        case 'UPDATE_TOTAL_ONLY':
            return {
                ...state,
                invoiceTotals: {
                    ...state.invoiceTotals,
                    total: action.payload.total, // Only update the total
                },
            }
        case 'CACHE_HSN_DETAILS':
            return {
                ...state,
                hsnDetailsCache: {
                    ...state.hsnDetailsCache,
                    [action.payload.hsnCodeId]: action.payload.details,
                },
            }
        case 'SET_INVOICE_HTML':
            return { ...state, invoiceHTML: action.payload }
        case 'SET_STORE_STAFF':
            return { ...state, loading: false, storeStaff: action.payload }
        case 'SET_SELECTED_STAFF':
            return { ...state, selectedStaff: action.payload }
        case 'SET_CART_ID':
            return { ...state, cartId: action.payload }
        case 'SET_CART_ITEMS':
            return { ...state, cartItems: action.payload }
        case 'ADD_CART_ITEM':
            return { ...state, cartItems: [...state.cartItems, action.payload] }
        case 'UPDATE_CART_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            }
        case 'DELETE_CART_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.id !== action.payload
                ),
            }
        case 'SET_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload }
        case 'SET_SALES_ORDERS':
            return { ...state, salesOrders: action.payload }
        case 'SHOW_TOAST':
            return {
                ...state,
                toast: {
                    type: action.payload.type,
                    message: action.payload.message,
                    isVisible: true,
                },
            }
        case 'HIDE_TOAST':
            return {
                ...state,
                toast: {
                    ...state.toast,
                    isVisible: false,
                },
            }
        default:
            return state
    }
}

// Debounce Function
const debounce = (fn, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

// Provider Component
export const SalesInvoiceProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { tenantId, facilityId } = useTenantFacility()
    const { storeStaff } = useStoreUser()
    const brandName = storeStaff?.tenant?.name || 'BRISKK'

    useEffect(() => {
        const calculateTotals = () => {
            const taxes = state.selectedSKUs.reduce((acc, sku) => {
                // Taxes are pre-calculated GST amounts
                return acc + sku.GST_amount * (sku.quantity || 1)
            }, 0)

            const total = state.selectedSKUs.reduce((acc, sku) => {
                // Total is the item total value (unit price * quantity)
                return acc + sku.unit_price * (sku.quantity || 1)
            }, 0)

            const subtotal = total - taxes

            // GST Breakdown
            const gstBreakdown = state.selectedSKUs.reduce((acc, sku) => {
                const slab = sku.GST_rate // Identify GST slab
                if (!acc[slab]) {
                    acc[slab] = { cgst: 0, sgst: 0 }
                }
                acc[slab].cgst +=
                    (sku.cgstRate / 100) * sku.unit_price * sku.quantity
                acc[slab].sgst +=
                    (sku.sgstRate / 100) * sku.unit_price * sku.quantity
                return acc
            }, {})

            // Total Quantity
            const totalQuantity = state.selectedSKUs.reduce((acc, sku) => {
                return acc + (sku.quantity || 1)
            }, 0)

            // Dispatch updated totals
            dispatch({
                type: 'UPDATE_TOTALS',
                payload: {
                    subtotal: subtotal.toFixed(2), // Ensure precision for taxable value
                    taxes: taxes.toFixed(2), // Total GST amount
                    total: total.toFixed(2), // Final invoice total including GST
                    gstBreakdown,
                    totalQuantity,
                },
            })
        }

        // Recalculate totals whenever selected SKUs change
        if (state.selectedSKUs.length > 0) {
            calculateTotals()
        } else {
            // Reset totals if no SKUs are selected
            dispatch({
                type: 'UPDATE_TOTALS',
                payload: {
                    subtotal: 0,
                    taxes: 0,
                    total: 0,
                    gstBreakdown: {}, // Reset GST breakdown
                    totalQuantity: 0,
                },
            })
        }
    }, [state.selectedSKUs]) // Dependency array to watch for changes in selected SKUs

    const BRISK_CHANNEL_PLATFORM_API_URL =
        process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL
    const BRISK_NODE_PLATFORM_API_URL = process.env.NEXT_PUBLIC_API_URL

    // Function to create a new cart
    const createCart = async (userId, deleteCartItemTemp) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/users/${userId}/carts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify({
                        cart: {
                            status: 'active',
                            user_id: userId,
                            tenant_id: tenantId,
                        },
                    }),
                }
            )

            const data = await response.json()
            if (!response.ok)
                throw new Error(data.message || 'Failed to create cart')

            dispatch({ type: 'SET_CART_ID', payload: data.data.id })
            const newCartId = data.data.id

            if (deleteCartItemTemp) {
                // Temporary Fix: Fetch and delete all existing cart items ...later on show cart item using
                //  dispatch({ type: 'SET_CART_ITEMS', payload: data.data.cart_items });

                const cartItems = data.data?.cart_items || []

                for (const item of cartItems) {
                    try {
                        await deleteCartItem(item.id)
                    } catch (error) {
                        console.error(
                            `Failed to delete cart item ${item.id}:`,
                            error
                        )
                        dispatch({
                            type: 'SHOW_TOAST',
                            payload: {
                                type: 'error',
                                message: `Failed to delete previous cart item, please try again slecting the user: ${item.name}`,
                            },
                        })
                    }
                }
            }

            return newCartId // Return the new cart ID
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const addToCart = async (cartId, skuDetails) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/cart_items`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify({
                        cart_item: {
                            cart_id: cartId,
                            sku_id: skuDetails.id,
                            quantity: skuDetails.quantity,
                            base_price: skuDetails.base_price,
                            offer_price: skuDetails.offer_price,
                            tax_rate: skuDetails.GST_rate,
                            tax_amount:
                                skuDetails.GST_amount * skuDetails.quantity ||
                                0,
                            size: skuDetails.size,
                            image_path: skuDetails.image_path,
                            is_taxable: true,
                            product_name:
                                skuDetails?.custom_code?.split('-')[0] || '',
                            unit_price: skuDetails.unit_price,
                            gst_rate: skuDetails.GST_rate,
                            cgst: skuDetails?.cgstRate,
                            sgst: skuDetails?.sgstRate,
                            hsn_code: skuDetails?.hsn_code,
                        },
                    }),
                }
            )

            const data = await response.json()
            if (!response.ok)
                throw new Error(data.message || 'Failed to add item to cart')

            dispatch({ type: 'ADD_CART_ITEM', payload: data.data })
        } catch (error) {
            console.error('Error syncing with backend:', error)
        }
    }

    // Function to update a cart item
    const updateCartItem = async (
        cartItemId,
        quantity,
        offer_price,
        final_price,
        discount_percentage,
        GST_rate
    ) => {
        try {
            // Show loader or feedback for processing
            dispatch({ type: 'SET_LOADING', payload: true })

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/cart_items/${cartItemId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                    // TODO: update gst_rate here as unit_price can be made less than 1000
                    //and calculation on BE is done on gst_rate passed from here

                    body: JSON.stringify({
                        cart_item: {
                            quantity,
                            offer_price: offer_price,
                            unit_price: final_price,
                            gst_rate: GST_rate,
                            tax_rate: GST_rate,
                            item_level_discount: {
                                discount_percentage_for_items:
                                    discount_percentage,
                            },
                        },
                    }),
                }
            )

            const data = await response.json()
            if (!response.ok)
                throw new Error(data.message || 'Failed to update cart item')

            dispatch({ type: 'UPDATE_CART_ITEM', payload: data.data })

            // Show success notification
            dispatch({
                type: 'SHOW_TOAST',
                payload: {
                    type: 'success',
                    message: 'Cart updated successfully!',
                },
            })
        } catch (error) {
            console.error('Error updating cart item in backend:', error)

            // Show error notification
            dispatch({
                type: 'SHOW_TOAST',
                payload: {
                    type: 'error',
                    message: 'Failed to update cart item, please try again',
                },
            })
            throw new Error('Failed to update cart item')
        } finally {
            // Hide loader after processing
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    // Function to delete a cart item
    const deleteCartItem = async (cartItemId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/cart_items/${cartItemId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                }
            )

            if (!response.ok) {
                // Parse error details if available
                const errorData = await response.json()
                throw new Error(
                    errorData.message ||
                        `Failed to delete cart item (HTTP ${response.status})`
                )
            }

            dispatch({ type: 'DELETE_CART_ITEM', payload: cartItemId })
        } catch (error) {
            console.error('Error syncing with backend:', error)

            throw error // Re-throw the error to propagate to the caller
        }
    }

    // TODO: remove this ...as we are never gonna show all customer to tenant any time soon
    // const fetchCustomers = async () => {
    //     dispatch({ type: 'SET_LOADING', payload: true })
    //     try {
    //         const response = await fetch(
    //             `${BRISK_CHANNEL_PLATFORM_API_URL}/users_with_tenant?tenant_id=${tenantId}`
    //         )
    //         const data = await response.json()
    //         dispatch({ type: 'SET_CUSTOMERS', payload: data })
    //     } catch (error) {
    //         dispatch({ type: 'SET_ERROR', payload: error.message })
    //     } finally {
    //         dispatch({ type: 'SET_LOADING', payload: false })
    //     }
    // }

    // Create Customer
    const createCustomer = async (customerData) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const payload = {
                user_with_tenant: {
                    ...customerData.user,
                    tenant_id: tenantId, // Include tenant_id inside the user object
                },
            }
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/users_with_tenant`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                    body: JSON.stringify(payload),
                }
            )
            if (!response.ok) {
                await response.json()
                throw new Error()
            }

            const data = await response.json()
            if (
                data?.message === 'User with given phone record already exists'
            ) {
                dispatch({
                    type: 'SET_ERROR',
                    payload:
                        'Customer already already exist with same phone number',
                })
            }
            return data.data
        } catch (error) {
            //TODO: sepearte error for customer exists with actual error from Backend
            dispatch({
                type: 'SET_ERROR',
                payload:
                    'Something is wrong at backend, please connect support!! Sorry about this',
            })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const setSelectedCustomer = async (customer) => {
        dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: customer })
        if (customer) {
            try {
                dispatch({ type: 'RESET_SKU_IN_CART' })
                await createCart(customer.user_id, true)
            } catch (error) {
                dispatch({
                    type: 'SET_ERROR',
                    payload:
                        error.message || 'Cart creation failed. Please retry.',
                })
            }
        }
    }

    const searchCustomer = async (q = '') => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (!q.trim()) {
            return []
        }

        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/users_with_tenant/search?tenant_id=${tenantId}&q=${q}`
            )
            const data = await response.json()
            dispatch({ type: 'SET_CUSTOMERS', payload: data.data })
            return Array.isArray(data.data) ? data.data : [] // Ensure an array is returned
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
            return [] // Return empty array on error
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    // Fetch SKU by Barcode
    const fetchSKUByBarcode = async ({
        barcode,
        snapshotPricing = {},
        cartIdOverride = null,
    }) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/search?includes=inventory.facility&barcode=${barcode}`
            )
            const data = await response.json()
            const sku = { ...data.data[0], quantity: 1, ...snapshotPricing }
            if (data?.data?.length > 0) {
                await addSKUToInvoice({ sku, cartIdOverride })
            } else {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'SKU not found for the given barcode.',
                })
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    // Fetch HSN Details
    const fetchHSNDetails = async (hsnCodeId) => {
        try {
            // Check if the HSN details already exist in the cache
            if (state.hsnDetailsCache[hsnCodeId]) {
                console.log(
                    'Returning cached HSN details:',
                    state.hsnDetailsCache[hsnCodeId]
                )
                return state.hsnDetailsCache[hsnCodeId] // Return cached details
            }

            dispatch({ type: 'SET_LOADING', payload: true }) // Set loading state

            // Make API call if not in cache
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/hsn_codes/${hsnCodeId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch HSN tax details')
            }

            const data = await response.json()

            // Cache the fetched details
            dispatch({
                type: 'CACHE_HSN_DETAILS',
                payload: { hsnCodeId, details: data.data },
            })

            return data.data // Return the fetched HSN details
        } catch (error) {
            console.error('Error fetching HSN tax details:', error)
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to fetch HSN tax details. Please try again.',
            })
            throw error // Ensure the error propagates for handling upstream
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false }) // Reset loading state
        }
    }

    //Initially its offerPrice ...
    //but while updating sku with offer amount and percentage the same is final_price and passed here

    const calculateTaxDetails = async (sku, offerPrice) => {
        try {
            const hsnDetails = await fetchHSNDetails(sku.hsn_code_id)

            const unitPrice = offerPrice || sku.base_price
            let cgstRate, sgstRate

            if (unitPrice < parseFloat(hsnDetails.threshold_value)) {
                cgstRate = hsnDetails.tax_rate_below_threshold / 2
                sgstRate = hsnDetails.tax_rate_below_threshold / 2
            } else {
                cgstRate = hsnDetails.tax_rate_above_threshold / 2
                sgstRate = hsnDetails.tax_rate_above_threshold / 2
            }

            const gstRate = cgstRate + sgstRate
            const gstAmount = (gstRate / 100) * unitPrice

            return {
                unit_price: unitPrice,
                GST_rate: gstRate,
                GST_amount: gstAmount,
                cgstRate: cgstRate,
                sgstRate: sgstRate,
                hsn_code: hsnDetails?.hsn_code,
            }
        } catch (error) {
            console.error('Error calculating tax details:', error)
            throw new Error('Failed to calculate tax details')
        }
    }

    // Add SKU to Invoice
    const addSKUToInvoice = async ({ sku, cartIdOverride = '' }) => {
        try {
            const existingSKU = state.selectedSKUs.find(
                (item) => item.id === sku.id
            )

            // Calculate taxes and update SKU
            const taxDetails = await calculateTaxDetails(
                sku,
                sku?.final_price || sku.offer_price
            )

            const skuWithTax = {
                ...sku,
                quantity: existingSKU ? existingSKU.quantity + 1 : sku.quantity,
                ...taxDetails,
            }

            // Sync with backend in the background
            //TODO: move background sync to upfrint sync
            const cartId = state.cartId || cartIdOverride
            if (cartId) {
                try {
                    await addToCart(cartId, skuWithTax)
                } catch (error) {
                    console.error('Failed to sync with backend:', error)
                    dispatch({
                        type: 'SHOW_TOAST',
                        payload: {
                            type: 'error',
                            message: 'Failed to sync SKU with backend.',
                        },
                    })
                    dispatch({
                        type: 'SET_ERROR',
                        payload: 'Backend sync failed',
                    })
                }
            }

            // Update UI instantly
            if (existingSKU) {
                dispatch({
                    type: 'UPDATE_SKU',
                    payload: { id: sku.id, updates: skuWithTax },
                })
            } else {
                dispatch({ type: 'ADD_SKU', payload: skuWithTax })
            }

            // Show success toast
            dispatch({
                type: 'SHOW_TOAST',
                payload: {
                    type: 'success',
                    message: 'SKU added to invoice successfully!',
                },
            })
        } catch (error) {
            console.error('Error adding SKU to invoice:', error)
            dispatch({
                type: 'SHOW_TOAST',
                payload: {
                    type: 'error',
                    message: 'Failed to add SKU to invoice.',
                },
            })
            dispatch({
                type: 'SET_ERROR',
                payload: error.message,
            })
        }
    }

    // Function to remove SKU from invoice
    const removeSKUFromInvoice = async (skuId) => {
        try {
            // Backup current cartItems state
            const previousCartItems = [...state.cartItems]

            const cartItemId = state.cartItems.find(
                (item) => item.sku_id === skuId
            )?.id

            if (cartItemId) {
                try {
                    await deleteCartItem(cartItemId)
                    // Show success toast
                    dispatch({
                        type: 'SHOW_TOAST',
                        payload: {
                            type: 'success',
                            message: 'Item removed successfully!',
                        },
                    })
                } catch (error) {
                    console.error(
                        'Error deleting cart item from backend:',
                        error
                    )

                    // Restore previous cartItems state
                    dispatch({
                        type: 'SET_CART_ITEMS',
                        payload: previousCartItems,
                    })

                    // Show error toast
                    dispatch({
                        type: 'SHOW_TOAST',
                        payload: {
                            type: 'error',
                            message: 'Failed to remove item from backend.',
                        },
                    })

                    throw error // Re-throw error to surface to caller
                }
            }

            // Remove SKU from the state
            dispatch({ type: 'REMOVE_SKU', payload: skuId })
        } catch (error) {
            console.error('Error removing SKU:', error)
        }
    }

    const updateSKUInInvoice = async (skuId, updates) => {
        try {
            const existingSKU = state.selectedSKUs.find(
                (sku) => sku.id === skuId
            )
            if (!existingSKU) return

            // Backup existing SKU state
            const previousSKU = { ...existingSKU }

            // Clone the existing SKU to apply updates
            let updatedSKU = { ...existingSKU, ...updates }

            // Handle updates based on the provided field
            if (updates.final_price !== undefined) {
                const finalPrice = parseFloat(updates.final_price) || 0
                const discountAmount = parseFloat(
                    (existingSKU.offer_price - finalPrice).toFixed(2)
                )
                const discountPercentage = parseFloat(
                    ((discountAmount / existingSKU.offer_price) * 100).toFixed(
                        2
                    )
                )

                updatedSKU.final_price = finalPrice
                updatedSKU.discount_amount = Math.max(0, discountAmount)
                updatedSKU.discount_percentage = Math.min(
                    100,
                    discountPercentage
                )
            } else if (updates.discount_amount !== undefined) {
                const discountAmount = Math.max(
                    0,
                    Math.min(updates.discount_amount, existingSKU.offer_price)
                )
                const finalPrice = parseFloat(
                    (existingSKU.offer_price - discountAmount).toFixed(2)
                )
                const discountPercentage = parseFloat(
                    ((discountAmount / existingSKU.offer_price) * 100).toFixed(
                        2
                    )
                )

                updatedSKU.discount_amount = discountAmount
                updatedSKU.final_price = finalPrice
                updatedSKU.discount_percentage = discountPercentage
            } else if (updates.discount_percentage !== undefined) {
                const discountPercentage = Math.max(
                    0,
                    Math.min(updates.discount_percentage, 100)
                )
                const discountAmount = parseFloat(
                    (
                        (existingSKU.offer_price * discountPercentage) /
                        100
                    ).toFixed(2)
                )
                const finalPrice = parseFloat(
                    (existingSKU.offer_price - discountAmount).toFixed(2)
                )

                updatedSKU.discount_percentage = discountPercentage
                updatedSKU.discount_amount = discountAmount
                updatedSKU.final_price = finalPrice
            }

            // Update quantity if provided
            if (updates.quantity !== undefined) {
                updatedSKU.quantity = Math.max(1, updates.quantity) // Ensure quantity is always ≥ 1
            }

            // Calculate tax details based on the updated final price
            if (existingSKU.hsn_code_id) {
                const finalPriceForTax =
                    updatedSKU?.final_price || updatedSKU?.offer_price
                if (finalPriceForTax <= 0) {
                    console.warn(
                        'Invalid final price for tax calculation:',
                        finalPriceForTax
                    )
                }
                const taxDetails = await calculateTaxDetails(
                    updatedSKU,
                    finalPriceForTax
                )
                updatedSKU = {
                    ...updatedSKU,
                    ...taxDetails, // Add tax details to SKU
                }
            }

            // Sync with backend if cart item exists
            const cartItemId = state.cartItems.find(
                (item) => item.sku_id === skuId
            )?.id
            if (cartItemId) {
                try {
                    await updateCartItem(
                        cartItemId,
                        updatedSKU.quantity,
                        existingSKU.offer_price,
                        updatedSKU.final_price,
                        updatedSKU.discount_percentage,
                        updatedSKU.GST_rate
                    )
                } catch (error) {
                    console.error('Error updating cart item in backend:', error)

                    // Restore previous SKU state if sync fails
                    dispatch({
                        type: 'UPDATE_SKU',
                        payload: { id: skuId, updates: previousSKU },
                    })

                    throw error // Re-throw error to surface to user
                }
            }

            // Dispatch the updated SKU
            dispatch({
                type: 'UPDATE_SKU',
                payload: { id: skuId, updates: updatedSKU },
            })
        } catch (error) {
            console.error(
                'Error updating SKU while updating items in invoice:',
                error
            )
        }
    }

    const generateSequentialInvoiceNumber = async (facilityId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/invoices/generate/${facilityId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch invoice number: ${response.statusText}`
                )
            }

            const { invoice_number } = await response.json()
            return invoice_number
        } catch (error) {
            console.error('Error fetching invoice number:', error)
            throw new Error(
                'Could not generate invoice number. Please try again.'
            )
        }
    }

    const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    // Save Invoice

    const saveInvoice = async () => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            // Construct the payload

            const GSTTotal = state.invoiceTotals.taxes

            const payload = {
                order: {
                    order_amount: state.invoiceTotals.total,
                    order_currency: 'INR',
                    user_id: state.selectedCustomer?.user_id,
                    cart_id: state.cartId,
                    tenant_id: tenantId,
                    facility_id: facilityId,
                    source: 'in_store',
                    order_note: 'Order created via POS',
                    store_staff_id: state.selectedStaff?.id,
                    payment_method: state.paymentMethod,
                    GST_total: GSTTotal,
                },
            }

            // Step 1: Create the order
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/orders`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify(payload),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to create order.')
            }

            const data = await response.json()

            // Step 2: Update order with invoice number
            try {
                const invoiceNumber = await updateOrderWithInvoiceDetails(
                    data.data.id,
                    facilityId
                )
                return { orderId: data.data.id, invoiceNumber }
            } catch (updateError) {
                console.error(
                    'Failed to update order with invoice number:',
                    updateError
                )

                // Show an alert or notification to the staff
                alert(
                    'The order was created successfully, but the invoice number could not be updated. Please try again. If the issue persists, contact support.'
                )

                throw new Error(
                    'Order was created, but invoice number update failed. Please retry.'
                )
            }
        } catch (error) {
            console.error('Error in saveInvoice:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
            throw error
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    // Handle Barcode Scanning Errors
    const setErrorState = (message) => {
        dispatch({ type: 'SET_ERROR', payload: message })
    }

    const clearErrorState = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const clearInvoiceState = () => {
        dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: null })
        dispatch({
            type: 'UPDATE_TOTALS',
            payload: { subtotal: 0, taxes: 0, total: 0 },
        })
        dispatch({ type: 'SET_ITEMS', payload: [] })
        dispatch({ type: 'CLEAR_ERROR' }) // Clear errors if any
    }

    // Generate Invoice
    const generateInvoice = async (
        orderId,
        setPdfUrl,
        setInvoiceHTML,
        format = 'pdf'
    ) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const payload = {
                orderId,
                tenantId,
                facilityId,
            }

            let pdfUrl = null
            let invoiceHTML = null

            if (format === 'html' || format === 'both') {
                // Fetch HTML Invoice
                const htmlResponse = await fetch(
                    `${BRISK_NODE_PLATFORM_API_URL}/generate-invoice-html`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }
                )

                if (!htmlResponse.ok) {
                    throw new Error('Failed to generate HTML invoice')
                }

                invoiceHTML = await htmlResponse.text()
                if (setInvoiceHTML) setInvoiceHTML(invoiceHTML)
            }

            if (format === 'pdf' || format === 'both') {
                // Fetch PDF Invoice
                const pdfResponse = await fetch(
                    `${BRISK_NODE_PLATFORM_API_URL}/generate-invoice-pdf`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }
                )

                if (!pdfResponse.ok) {
                    throw new Error('Failed to generate PDF invoice')
                }

                const pdfBlob = await pdfResponse.blob()
                pdfUrl = URL.createObjectURL(pdfBlob)
                if (setPdfUrl) setPdfUrl(pdfUrl)
            }

            return { invoiceHTML, pdfUrl } // Return results based on selected format
        } catch (error) {
            console.error('Error generating invoice:', error)
            dispatch({
                type: 'SET_ERROR',
                payload: {
                    message: 'Invoice generation failed.',
                    details: error.message,
                },
            })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const fetchStoreStaff = async () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/store_staffs?tenant_id=${tenantId}`
            )
            const data = await response.json()

            // Dispatch the fetched staff data to the state
            dispatch({ type: 'SET_STORE_STAFF', payload: data.data })
        } catch (error) {
            console.error('Error fetching store staff:', error)
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to fetch store staff',
            })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const updateOrderWithInvoiceDetails = async (orderId, facilityId) => {
        try {
            // Step 1: Generate the invoice number
            const invoiceNumber =
                await generateSequentialInvoiceNumber(facilityId)

            // Step 2: Update the order with the generated invoice number
            const updateResponse = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/orders/${orderId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify({
                        order: {
                            invoice_number: invoiceNumber,
                        },
                    }),
                }
            )

            if (!updateResponse.ok) {
                throw new Error('Failed to update order with invoice details.')
            }

            // Step 3: Trigger the SMS after updating the order
            const phoneNumber = state.selectedCustomer?.phone // Replace with actual field containing phone number

            const storeName = brandName
            const invoiceUrl = `https://briskk.one/invoice?order=${orderId}`

            const smsResponse = await fetch(
                `${BRISK_NODE_PLATFORM_API_URL}/send-invoice-sms`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phoneNumber,
                        storeName,
                        invoiceUrl,
                    }),
                }
            )

            if (!smsResponse.ok) {
                console.error(
                    'Failed to send Invoice SMS:',
                    await smsResponse.json()
                )
            } else {
                console.log('Invoice SMS sent successfully.')
            }

            return invoiceNumber
        } catch (error) {
            console.error('Error in updateOrderWithInvoiceDetails:', error)
            throw error // Ensure the error propagates for higher-level handling
        }
    }

    const setSelectedStaff = (staff) => {
        dispatch({ type: 'SET_SELECTED_STAFF', payload: staff })
    }

    const setPaymentMethod = (method) => {
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
    }

    const fetchSalesOrders = async (filters = {}) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
            // Filter out empty values
            const queryParams = new URLSearchParams({
                tenant_id: tenantId,
                facility_id: facilityId,
                page_size: 500,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value) // Exclude empty values
                ),
            }).toString()

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/orders?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                }
            )

            const data = await response.json()
            if (!response.ok)
                throw new Error(data.message || 'Failed to fetch orders')

            dispatch({ type: 'SET_SALES_ORDERS', payload: data.data }) // Dispatch sales orders
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const fetchSKUDetails = async (skuId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/${skuId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch SKU details.')
            }

            const { data } = await response.json()
            return data // Return complete SKU details
        } catch (error) {
            console.error('Error fetching SKU details:', error)
            throw error // Allow upstream handling
        }
    }

    // Fetch Order by ID
    const fetchOrderById = async (orderId) => {
        //TODO --fix loader issue on edit invoice page later
        dispatch({ type: 'SET_LOADING', payload: false })
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/orders/${orderId}?includes=cart.cart_items`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch order details.')
            }

            const { data } = await response.json() // Consistent usage of data.data

            // Map customer details to match expected structure
            const customer = {
                user_id: data.order_meta.customer_details.customer_id,
                phone: data.order_meta.customer_details.customer_phone,
                name: data.order_meta.customer_details.customer_name,
            }

            // Find staff by ID from storeStaff
            const staff = state.storeStaff.find(
                (s) => s.id === data.store_staff_id
            )

            const newCartId = await createCart(customer.user_id, false)

            // Dispatch updates
            dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: customer })
            dispatch({ type: 'SET_SELECTED_STAFF', payload: staff || null })
            //  dispatch({ type: 'SET_CART_ID', payload: newCartId })
            dispatch({
                type: 'SET_PAYMENT_METHOD',
                payload: data.payment_method,
            })

            // Populate SKUs into the state using addSKUToInvoice
            for (const cartItem of data.cart.cart_items) {
                const skuDetails = await fetchSKUDetails(cartItem.sku_id) // Fetch detailed SKU info
                const barcode = skuDetails.barcode // Extract barcode from SKU details
                console.log('Passing cartId:', newCartId)
                if (barcode) {
                    // await fetchSKUByBarcode(
                    //     barcode,
                    //     {
                    //         unit_price: cartItem.unit_price, // Use snapshot price
                    //         offer_price: cartItem.offer_price, // Use snapshot offer price
                    //         base_price: cartItem.base_price, // Use snapshot base price
                    //         quantity: cartItem.quantity,
                    //     },
                    //     newCartId
                    // )
                    //TODO: add discount percentage from cartItems...update sku and then show this in InvoiceSelectedItemsTable
                    await fetchSKUByBarcode({
                        barcode,
                        snapshotPricing: {
                            unit_price: cartItem.unit_price,
                            offer_price: cartItem.offer_price,
                            base_price: cartItem.base_price,
                            quantity: cartItem.quantity,
                            final_price: cartItem?.unit_price,
                            discount_percentage:
                                cartItem?.item_level_discount
                                    ?.discount_percentage_for_items,
                        },
                        cartIdOverride: newCartId,
                    })
                }
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    //TODO -- refine it further and fix

    const invoiceEdit = async (orderId) => {
        try {
            const payload = {
                order: {
                    order_amount: state.invoiceTotals.total,
                    user_id: state.selectedCustomer?.user_id,
                    cart_id: state.cartId,
                    store_staff_id: state.selectedStaff?.id,
                    payment_method: state.paymentMethod,
                    GST_total: state.invoiceTotals.taxes,
                    order_note:
                        'Order updated via POS, and this order is edited order', // Add an order note for tracking updates
                },
            }
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/orders/${orderId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify(payload),
                }
            )
            if (!response.ok) {
                throw new Error('Failed to update the order.')
            }
            return true
        } catch (error) {
            console.error('Error updating the invoice:', error)
            throw error
        }
    }
    const hideToast = () => {
        dispatch({ type: 'HIDE_TOAST' })
    }

    const handleRoundOff = (roundOffValue = 0) => {
        const currentTotal = state.invoiceTotals.total || 0 // Default total
        const newTotal = parseFloat(currentTotal) + parseFloat(roundOffValue) // Avoid NaN
        dispatch({
            type: 'UPDATE_TOTAL_ONLY',
            payload: { total: newTotal.toFixed(2) }, // Ensure precision
        })
    }

    const handleRoundOffToggle = (isChecked) => {
        const subtotal = parseFloat(state.invoiceTotals.subtotal) || 0 // Default subtotal
        const taxes = parseFloat(state.invoiceTotals.taxes) || 0 // Default taxes
        const total = parseFloat(state.invoiceTotals.total) || 0 // Default total

        if (isChecked) {
            const roundedTotal = Math.round(total)
            handleRoundOff(roundedTotal - total) // Apply round-off difference
        } else {
            const originalTotal = subtotal + taxes
            handleRoundOff(originalTotal - total) // Revert to original total
        }
    }

    const handleRoundOffChange = (type, value) => {
        const validValue = parseFloat(value) || 0 // Default to 0 if value is invalid

        if (type === 'add') {
            handleRoundOff(validValue)
        } else if (type === 'reduce') {
            handleRoundOff(-validValue)
        }
    }

    useEffect(() => {
        fetchStoreStaff()
    }, [])

    return (
        <SalesInvoiceContext.Provider
            value={{
                ...state,
                createCustomer,
                searchCustomer,
                fetchSKUByBarcode,
                addSKUToInvoice,
                removeSKUFromInvoice,
                updateSKUInInvoice,
                saveInvoice,
                generateInvoice,
                setSelectedCustomer,
                setErrorState,
                clearErrorState,
                clearInvoiceState,
                setSelectedStaff,
                storeStaff: state.storeStaff,
                selectedStaff: state.selectedStaff,
                createCart,
                addToCart,
                updateCartItem,
                deleteCartItem,
                updateOrderWithInvoiceDetails,
                paymentMethod: state.paymentMethod,
                error: state.error,
                setPaymentMethod,
                fetchSalesOrders,
                fetchOrderById,
                fetchStoreStaff,
                invoiceEdit,
                toast: state.toast,
                hideToast,
                handleRoundOffChange,
                handleRoundOffToggle,
            }}
        >
            {children}
        </SalesInvoiceContext.Provider>
    )
}

// Custom Hook
export const useSalesInvoice = () => {
    return useContext(SalesInvoiceContext)
}
