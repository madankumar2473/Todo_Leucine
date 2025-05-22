import React, { useState, useEffect } from 'react'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import Dropdown from '@/components/storeOS/Dropdown'
import Notification from '@/components/storeOS/Notification'

const StaffSelector = ({ isEditable = true, orderPlacedBy }) => {
    const { storeStaff, selectedStaff, setSelectedStaff } = useSalesInvoice()
    const [notification, setNotification] = useState({ type: '', message: '' })
    const [orderPlacedByStaff, setOrderPlacedByStaff] = useState(null)

    // Initialize orderPlacedByStaff on component mount or when selectedStaff changes
    //TODO: to fix ..make sure selectedStaff is null so that staff select who is placing the order ..currently if not slected the last staff id who created the order will go
    // useEffect(() => {
    //     if (!orderPlacedByStaff && selectedStaff) {
    //         setOrderPlacedByStaff({ ...selectedStaff })
    //         setSelectedStaff(null) // Clear selected staff to enforce selection
    //     }
    // }, [selectedStaff, orderPlacedByStaff, setSelectedStaff])

    // Handle staff selection
    const handleStaffSelect = (staff) => {
        setSelectedStaff(staff.value)
        setNotification({
            type: 'success',
            message: `Staff selected: ${staff.value.name}`,
        })
    }

    if (!isEditable) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-primary-600 mb-2">
                    Order Placed By
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                    {selectedStaff?.name || 'N/A'}
                </p>

                <div className="bg-gray-50 shadow-inner p-4 rounded-lg hover:shadow-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Staff Editing This Order
                    </label>
                    <Dropdown
                        triggerLabel={
                            selectedStaff
                                ? `${selectedStaff.name} (${selectedStaff.phone})`
                                : 'Select Staff'
                        }
                        options={storeStaff.map((staff) => ({
                            label: `${staff.name} (${staff.phone})`,
                            value: staff,
                        }))}
                        width="w-full"
                        onSelect={handleStaffSelect}
                        className="text-primary-600 border border-primary-300 focus:ring-2 focus:ring-primary-300 rounded-md"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 shadow-inner p-4 rounded-lg hover:shadow-lg">
            {/* Static Label */}
            <label className="block text-sm font-medium text-gray-600 mb-2">
                Staff Selection
            </label>

            {/* Staff Dropdown */}
            <Dropdown
                triggerLabel={
                    selectedStaff
                        ? `${selectedStaff.name} (${selectedStaff.phone})`
                        : 'Select Staff'
                }
                options={storeStaff.map((staff) => ({
                    label: `${staff.name} (${staff.phone})`,
                    value: staff,
                }))}
                width="w-full"
                onSelect={handleStaffSelect}
                className="text-primary-600 border border-primary-300 focus:ring-2 focus:ring-primary-300 rounded-md"
            />
        </div>
    )
}

export default StaffSelector
