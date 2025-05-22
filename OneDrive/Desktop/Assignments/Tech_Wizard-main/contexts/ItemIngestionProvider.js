import React, {
    createContext,
    useState,
    useContext,
    useCallback,
    useEffect,
} from 'react'
import debounce from 'lodash.debounce'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'

const ItemIngestionContext = createContext()

// Provider Component
export const ItemIngestionProvider = ({ children }) => {
    const {
        tenantId,
        facilityId,
        loading: tenantFacilityLoading,
    } = useTenantFacility()
    const [savedProducts, setSavedProducts] = useState([]) // Centralized SKUs
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({}) // Pagination metadata
    const [page, setPage] = useState(1) // Current page state
    const [pageSize, setPageSize] = useState(20) // Items per page
    const [searchQuery, setSearchQuery] = useState('') // Search query state
    const [localSearchQuery, setLocalSearchQuery] = useState('')

    const BRISK_CHANNEL_PLATFORM_API_URL =
        process.env.NEXT_PUBLIC_BRISK_CHANNEL_PLATFORM_API_URL

    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

    let isFetching = false
    const fetchSavedProducts = async () => {
        if (tenantFacilityLoading) {
            console.log('Waiting for TenantFacilityContext to load...')
            return
        }
        if (!tenantId || !facilityId) {
            console.warn(
                'Tenant ID or Facility ID not available, skipping fetchSavedProducts.'
            )
            return
        }
        if (isFetching) return
        isFetching = true
        try {
            setLoading(true) // Show loader
            setError(null)

            const queryParams = new URLSearchParams({
                tenant_id: tenantId,
                facility_id: facilityId,
                includes: 'sku.inventory.facility',
                page: page || 1,
                page_size: pageSize || 20,
            })

            if (searchQuery) {
                queryParams.append('display_name', searchQuery)
                queryParams.append('custom_code', searchQuery)
                // queryParams.append('barcode', searchQuery)
            }

            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/products/search?${queryParams.toString()}`
            )

            if (response.ok) {
                const responseData = await response.json()
                const transformedData = transformFetchedProducts(
                    responseData.data || []
                )
                setSavedProducts(transformedData) // Store transformed data
                setPagination(responseData.data?.pagination || {})
                return transformedData
            }

            if (!response.ok) {
                throw new Error('Failed to fetch products')
            }
        } catch (error) {
            console.error('Error fetching saved products:', error)
            setError('Failed to fetch saved products.')
            return []
        } finally {
            isFetching = false
            setLoading(false) // Hide loader
        }
    }

    useEffect(() => {
        fetchSavedProducts()
    }, [page, pageSize, searchQuery, facilityId]) // Consolidated dependencies

    // Handle Pagination Changes
    const handlePageChange = (newPage, newPageSize = pageSize) => {
        if (page !== newPage || pageSize !== newPageSize) {
            setPage(newPage)
            setPageSize(newPageSize)
            // No need to call fetchSavedProducts here, as useEffect will handle it
        }
    }

    // Handle Search Query Changes
    const handleSearchChange = debounce((query) => {
        if (query.length >= 2) {
            setSearchQuery(query) // Update search query
            setPage(1) // Reset to the first page
        }
    }, 500) // 500ms debounce delay

    // Clear Search Query
    const clearSearchInput = () => {
        setLocalSearchQuery('')
        setSearchQuery('') // Reset search query
        setPage(1) // Reset to the first page
        fetchSavedProducts() // Refetch data without search
    }

    const handleInputChange = (query) => {
        setLocalSearchQuery(query) // Update local state immediately
        handleSearchChange(query) // Trigger debounced function
    }

    // Function to ingest manual data (add or update)
    const ingestManualData = async (data) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`${NEXT_PUBLIC_API_URL}/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json()
                if (data.tenantId) {
                    const updatedData = await fetchSavedProducts({}) // Refresh saved products
                    setSavedProducts(updatedData) // Update local state
                }
                return { success: true, responseData }
            } else {
                const errorData = await response.json()
                console.error('Error ingesting manual data:', errorData)
                setError('Failed to ingest data. Please try again.')
                return { success: false }
            }
        } catch (err) {
            console.error('Error ingesting manual data:', err)
            setError('Failed to ingest data. Please try again.')
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    // Function to enhance manual data
    const enhanceManualData = (data) => {
        return data.map((item) => ({
            product_id: item.styleCode || '', // Map from `styleCode` to `product_id`
            category: item.category || 'default-category', // Ensure category is present
            hsn_code: item.hsnCode || '6205', // Add placeholder for HSN code
            price: item.mrp || '0', // Use `mrp` for price
            offer_price: item.sellingPrice || item.mrp || '0', // Use selling price or fallback to MRP
            stock: item.stockQty || '0', // Map `stockQty` to `stock`
            sku_id: item.skuId || '', // Map `skuId` directly
            size: item.size || '', // Map size
            color: item.color || '', // Map color
            barcode: item.barcode || '', // Map barcode
            main_image:
                item.main_image ||
                'https://briskk-bucket.s3.ap-south-1.amazonaws.com/BrandLogos/stag-beetle_logo.png', // Default placeholder image
            //TODO: facilty while ingestion is searched via name ..so we can remove facility_id from payload
            //later we will pass facility_id fecthed from Store staff login and in data ingestion we will do these changes
            // facility_id: item.facility_id || , //
            facility_name: item.facility_name,
            facility_type: item.facility_type || 'store', // Add placeholder
            sale_channel: item.sale_channel || 'offline', // Default sale channel
            display_name: item.display_name || '',
        }))
    }

    // Function to add a new SKU
    const addSKU = async (newSKU) => {
        try {
            const enhancedData = enhanceManualData([newSKU]) // Enhance data
            await ingestManualData({ manualEntryData: enhancedData }) // Sync with backend
            setSavedProducts((prev) => [...prev, ...enhancedData]) // Update local state after success
        } catch (error) {
            console.error('Error adding SKU:', error)
            throw error // Ensure error propagates for handling
        }
    }

    // Function to edit an existing SKU

    const editSKU = async (updatedSKU) => {
        try {
            const enhancedData = enhanceManualData([updatedSKU]) // Enhance data
            await ingestManualData({ manualEntryData: enhancedData }) // Sync with backend
            setSavedProducts((prev) =>
                prev.map((sku) =>
                    sku.skuId === updatedSKU.skuId ? enhancedData[0] : sku
                )
            ) // Update local state after success
        } catch (error) {
            console.error('Error editing SKU:', error)
            throw error // Ensure error propagates for handling
        }
    }

    // Function to delete a SKU
    const deleteSKU = async (skuId) => {
        try {
            const response = await fetch(
                `${BRISK_CHANNEL_PLATFORM_API_URL}/skus/${skuId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                throw new Error(`Failed to delete SKU with ID: ${skuId}`)
            }

            setSavedProducts((prev) =>
                prev.filter((sku) => sku.skuId !== skuId)
            ) // Update local state after success
        } catch (error) {
            console.error(`Error deleting SKU with ID ${skuId}:`, error)
            throw error // Ensure error propagates for handling
        }
    }

    // Function to transform fetched data
    const transformFetchedProducts = (fetchedData) => {
        const transformedData = []

        fetchedData.products
            .filter((product) => product.is_active) // Only include active products
            .forEach((product) => {
                product.sku
                    ?.filter((sku) => !sku.is_disabled) // Only include enabled SKUs
                    .forEach((sku) => {
                        // Filter inventory for the selected facility
                        const inventory =
                            sku?.inventory?.find(
                                (inv) => inv.facility_id === facilityId
                            ) || {}
                        const facility = inventory?.facility || {}
                        transformedData.push({
                            product_id: product.id,
                            styleCode: product.name || '',
                            skuId: sku.custom_code || '',
                            barcode: sku.barcode || '',
                            stockQty: inventory.stock || '0',
                            mrp: sku.base_price || '0',
                            sellingPrice:
                                sku.offer_price || sku.base_price || '0',
                            category: 'MEN', // Hardcoded for now
                            hsnCode: sku.hsn_code_id || 'N/A',
                            size: sku.size || '',
                            color: sku.color || '',
                            main_image: sku.image_path || '',
                            facility_id: facility.id || 'default_facility',
                            facility_name: facility?.name || 'Default Facility',
                            facility_type: facility.type || 'store',
                            sale_channel: inventory.channel || 'offline',
                            id: sku.id,
                            display_name: sku.display_name,
                            allInventory: sku.inventory || [],
                        })
                    })
            })

        return transformedData
    }

    return (
        <ItemIngestionContext.Provider
            value={{
                savedProducts,
                loading,
                error,
                fetchSavedProducts,
                ingestManualData,
                addSKU,
                editSKU,
                deleteSKU,
                enhanceManualData,
                transformFetchedProducts,
                pagination, // Expose pagination for UI
                page,
                pageSize,
                setPageSize, // Allow updating page size if needed
                handlePageChange, // Pagination handler
                handleSearchChange, // Search handler
                clearSearchInput,
                searchQuery,
                localSearchQuery,
                handleInputChange,
            }}
        >
            {children}
        </ItemIngestionContext.Provider>
    )
}

// Custom Hook
export const useItemIngestion = () => {
    return useContext(ItemIngestionContext)
}
