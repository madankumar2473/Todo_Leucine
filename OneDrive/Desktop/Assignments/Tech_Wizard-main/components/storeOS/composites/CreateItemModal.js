import React, { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import { openDB } from 'idb'
import Modal from '../Modal'
import SellInStoreTab from './SellInStoreTab'
import Notification from '../Notification'
import SKUPreviewTable from '../SKUPreviewTable'
import { useItemIngestion } from '@/contexts/ItemIngestionProvider'
import { useTenantFacility } from '@/contexts/TenantFacilityProvider'
import { useStoreUser } from '@/contexts/StoreUserProvider'

const CreateItemModal = ({ isOpen, onClose, onSave }) => {
    const { storeStaff } = useStoreUser()
    const { ingestManualData, enhanceManualData, loading } = useItemIngestion()
    const { tenantId, normalizedFacilities, facilityId } = useTenantFacility()
    const [step, setStep] = useState(1) // Step 1: Form, Step 2: SKU Preview
    const [skuData, setSkuData] = useState([])
    const [notification, setNotification] = useState({ type: '', message: '' })
    // Extract facility_name and brandName

    const currentFacility = normalizedFacilities[facilityId] || {}

    const facility_name = currentFacility?.name // Extract facility_name
    const facility_type = currentFacility?.type // Extract facility_name

    const brandName =
        storeStaff?.tenant?.name || 'BUG:Check FE code CreateItemModal.js'

    const initialSellInStoreData = {
        styleCode: '',
        colors: [],
        sizes: [],
        colorOptions: [],
        category: ['MEN'],
        hsnCode: ['6205'],
        stockQty: '',
        mrp: '',
        sellingPrice: '',
    }
    const [sellInStoreData, setSellInStoreData] = useState(
        initialSellInStoreData
    )

    useEffect(() => {
        if (isOpen) {
            setStep(1) // Reset to Step 1
            setNotification({ type: '', message: '' }) // Clear notification
        }
    }, [isOpen])

    // Fetch colors.json on component mount
    useEffect(() => {
        const fetchColors = async () => {
            try {
                // Later color need to be picked from COLORS API CALL
                const response = await fetch('/colors.json') // Path to colors.json in the public folder
                const colors = await response.json()
                setSellInStoreData((prevData) => ({
                    ...prevData,
                    colorOptions: colors, // Update colorOptions with fetched data
                }))
            } catch (error) {
                console.error('Error fetching colors.json:', error)
            }
        }

        fetchColors()
    }, [])

    //  TODO add tenantId in generateBarcode to avoid duplicates

    const generateBarcode = (skuId) => {
        // Generate a SHA256 hash of the SKU ID
        const hash = CryptoJS.SHA256(skuId)
            .toString(CryptoJS.enc.Hex) // Convert hash to Hexadecimal format
            .replace(/[^a-zA-Z0-9]/g, '') // Remove any special characters (just in case)
            .toUpperCase() // Convert to uppercase for consistency

        // Take the first 12 characters of the hash for the barcode
        return hash.substring(0, 12)
    }

    // Generate SKUs
    const handleGenerateSKUs = () => {
        if (
            !sellInStoreData.styleCode ||
            sellInStoreData.sizes.length === 0 ||
            !sellInStoreData.mrp ||
            !sellInStoreData.sellingPrice ||
            !sellInStoreData.stockQty
        ) {
            setNotification({
                type: 'error',
                message:
                    'Please fill all mandatory fields before generating SKUs.',
            })
            return
        }

        //TODO: in gnerated skus ....will pass facility.id later .....
        //currently facility name is used while ingestion to get facility
        // And once all products is fectched using transformFetchedProducts we assign the facilty object to sku object
        const generatedSKUs =
            sellInStoreData.colors.length > 0
                ? sellInStoreData.colors.flatMap((color) => {
                      // With Colors
                      const colorCode =
                          color.short_code ||
                          color.value.substring(0, 4).toUpperCase()

                      return sellInStoreData.sizes.map((size) => {
                          const skuId = `${sellInStoreData.styleCode}-${colorCode}-${size}`
                          const displayName = `${sellInStoreData.styleCode}-${color.value}-${size}`
                          const barcode = generateBarcode(skuId)
                          // TODO :  handle sale_channel with toggle
                          return {
                              styleCode: sellInStoreData.styleCode,
                              skuId,
                              barcode,
                              display_name: displayName,
                              stockQty: sellInStoreData.stockQty,
                              mrp: sellInStoreData.mrp,
                              sellingPrice: sellInStoreData.sellingPrice,
                              category: sellInStoreData.category[0],
                              hsnCode: sellInStoreData.hsnCode[0],
                              size: size,
                              color: color.value, // Include color value
                              main_image:
                                  'https://briskk-bucket.s3.ap-south-1.amazonaws.com/BrandLogos/stag-beetle_logo.png',
                              facility_name: facility_name,
                              facility_type: facility_type,
                              sale_channel: 'offline',
                          }
                      })
                  })
                : sellInStoreData.sizes.map((size) => {
                      // Without Colors
                      const skuId = `${sellInStoreData.styleCode}-${size}`
                      const displayName = `${sellInStoreData.styleCode}-${size}`
                      const barcode = generateBarcode(skuId)

                      return {
                          styleCode: sellInStoreData.styleCode,
                          skuId,
                          barcode,
                          display_name: displayName,
                          stockQty: sellInStoreData.stockQty,
                          mrp: sellInStoreData.mrp,
                          sellingPrice: sellInStoreData.sellingPrice,
                          category: sellInStoreData.category[0],
                          hsnCode: sellInStoreData.hsnCode[0],
                          size: size,
                          color: '', // Pass empty string for color
                          main_image:
                              'https://briskk-bucket.s3.ap-south-1.amazonaws.com/BrandLogos/stag-beetle_logo.png',
                          facility_name: facility_name,
                          facility_type: facility_type,
                          sale_channel: 'offline',
                      }
                  })

        setSkuData(generatedSKUs)
        setStep(2) // Transition to SKU Preview
        setNotification({
            type: 'success',
            message: 'SKUs generated successfully!',
        })
    }

    const handleSaveSKUs = async () => {
        try {
            // Enhance SKU data
            const enhancedData = enhanceManualData(skuData)

            // Prepare payload
            const payload = {
                manualEntry: true,
                tenantId: tenantId, // Ensure tenantId is passed
                brandName: brandName, // Ensure brandName is passed
                fileName: 'manual_entry.xlsx', // Optional or dynamic
                manualEntryData: enhancedData,
            }

            // Call ingestion API
            const result = await ingestManualData(payload)

            if (result.success) {
                onSave(result.responseData) // Pass response data to parent
                onClose()
                setSellInStoreData(initialSellInStoreData) // Reset form to initial state
            } else {
                setNotification({
                    type: 'error',
                    message: 'Failed to save SKUs. Please try again.',
                })
            }
        } catch (error) {
            console.error('Error saving SKUs:', error)
            setNotification({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.',
            })
        }
    }

    const handleBackToForm = () => {
        setStep(1)
        setNotification({ type: '', message: '' })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="large"
            header={
                <div>
                    <h2 className="text-lg font-bold mb-2">
                        {step === 1
                            ? 'Fill Details to Generate SKUs'
                            : 'Review Generated SKUs'}
                    </h2>
                    {notification.message && (
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            onClose={() =>
                                setNotification({ type: '', message: '' })
                            }
                        />
                    )}
                </div>
            }
            footer={
                <div className="sticky bottom-0 bg-white flex justify-between space-x-2 p-4 shadow">
                    {step === 1 ? (
                        <>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                                onClick={handleGenerateSKUs}
                            >
                                Generate SKUs
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={handleBackToForm}
                            >
                                Go Back to Edit
                            </button>
                            <button
                                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                                onClick={handleSaveSKUs}
                            >
                                Save SKUs
                            </button>
                        </>
                    )}
                </div>
            }
        >
            {step === 1 ? (
                <SellInStoreTab
                    data={sellInStoreData}
                    setData={setSellInStoreData}
                    setNotification={setNotification}
                />
            ) : (
                <div>
                    <SKUPreviewTable
                        data={skuData}
                        onUpdate={(skuId, updatedRow) => {
                            const updatedSKUs = skuData.map((row) =>
                                row.skuId === skuId ? updatedRow : row
                            )
                            setSkuData(updatedSKUs)
                        }}
                        onDelete={(skuId) => {
                            const filteredSKUs = skuData.filter(
                                (row) => row.skuId !== skuId
                            )
                            setSkuData(filteredSKUs)
                        }}
                        isPreview={false} // Hide edit/delete features
                    />
                </div>
            )}
        </Modal>
    )
}

export default CreateItemModal
