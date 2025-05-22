import React, { useState } from 'react'
import { useSalesInvoice } from '@/contexts/SalesInvoiceProvider'
import DropdownWithSearch from '@/components/storeOS/DropdownWithSearch'
import Modal from '@/components/storeOS/Modal'
import Button from '@/components/storeOS/Button'
import Notification from '@/components/storeOS/Notification'

// --- Helper Functions ---

// Debounce utility to limit API calls
const debounce = (fn, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

// Email format validation
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Phone format validation (10 digits)
const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
}

const CustomerSelector = ({ isEditable = true }) => {
    const {
        searchCustomer,
        createCustomer,
        selectedCustomer,
        setSelectedCustomer,
    } = useSalesInvoice()

    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        email: '',
    })
    const [errors, setErrors] = useState({ name: '', phone: '', email: '' })
    const [notification, setNotification] = useState({ type: '', message: '' })
    const [suggestions, setSuggestions] = useState([])

    // --- Handlers ---

    // Fetch customer suggestions from API (debounced)
    const fetchSuggestions = async (q) => {
        if (q.length >= 3) {
            try {
                const results = await searchCustomer(q)
                setSuggestions(results)
            } catch (error) {
                console.error('Error fetching customer suggestions:', error)
            }
        } else {
            setSuggestions([])
        }
    }

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)

    const handleSearchChange = (value) => {
        setSearchQuery(value)
        if (value.length >= 3) {
            debouncedFetchSuggestions(value)
        } else {
            setSuggestions([])
        }
    }

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer)
        setSearchQuery('')
        setSuggestions([])
    }

    // Validate and track input changes
    const handleChange = (field, value) => {
        let errorMsg = ''

        if (field === 'name' && !value.trim()) {
            errorMsg = 'Name is required'
        } else if (field === 'phone') {
            if (!value.trim()) {
                errorMsg = 'Phone is required'
            } else if (!validatePhone(value)) {
                errorMsg =
                    'Invalid phone number! Please enter a 10-digit number.'
            }
        } else if (field === 'email' && value && !validateEmail(value)) {
            errorMsg = 'Invalid email address! Please enter a valid email.'
        }

        setErrors((prev) => ({ ...prev, [field]: errorMsg }))
        setNewCustomer((prev) => ({ ...prev, [field]: value }))
    }

    // Create a new customer
    const handleAddCustomer = async () => {
        const { name, phone, email } = newCustomer

        // Check required fields and current errors
        if (!name || !phone || errors.name || errors.phone || errors.email) {
            setErrors({
                name: !name ? 'Name is required' : errors.name,
                phone: !phone ? 'Phone is required' : errors.phone,
                email: errors.email,
            })
            return
        }

        try {
            const createdCustomer = await createCustomer({ user: newCustomer })
            if (!createdCustomer) {
                // If creation fails or there's no response, simply close modal
                setIsModalOpen(false)
                return
            }

            setNotification({
                type: 'success',
                message: 'Customer added successfully!',
            })
            setIsModalOpen(false)
            handleSelectCustomer(createdCustomer)

            // Reset form states
            setNewCustomer({ name: '', phone: '', email: '' })
            setErrors({ name: '', phone: '', email: '' })
        } catch (error) {
            setErrors((prev) => ({ ...prev, form: 'Failed to add customer!' }))
        }
    }

    // --- Render ---

    // If view is not editable and a customer is already selected
    if (!isEditable && selectedCustomer) {
        return (
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-primary-600 mb-2">
                    Customer Details for Placed Order
                </h3>
                <p className="text-sm text-gray-700">
                    Name: {selectedCustomer.name}
                </p>
                <p className="text-sm text-gray-700">
                    Phone: {selectedCustomer.phone}
                </p>
                <p className="text-sm text-gray-700">
                    Email: {selectedCustomer.email || 'N/A'}
                </p>
            </div>
        )
    }

    return (
        <div className="mb-6 bg-gray-50 shadow-inner p-4 rounded-lg hover:shadow-lg">
            {/* Notification */}
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ type: '', message: '' })}
                />
            )}

            {/* Customer Search & Dropdown */}
            <div className="relative mb-4">
                <DropdownWithSearch
                    placeholder="Search customer by name or phone"
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    options={suggestions.map((cust) => ({
                        label: `${cust.name} (${cust.phone})`,
                        value: cust,
                    }))}
                    onSelect={(option) => handleSelectCustomer(option.value)}
                />
            </div>

            {/* Selected Customer Preview */}
            {selectedCustomer && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
                    <h3 className="text-lg font-bold text-primary-600 mb-2">
                        Selected Customer
                    </h3>
                    <p className="text-sm text-gray-700">
                        Name: {selectedCustomer.name}
                    </p>
                    <p className="text-sm text-gray-700">
                        Phone: {selectedCustomer.phone}
                    </p>
                    <p className="text-sm text-gray-700">
                        Total Purchases:{' '}
                        {selectedCustomer.total_purchases || '0.00'}
                    </p>
                    <Button
                        label="Change Customer"
                        variant="outline"
                        size="small"
                        onClick={() => setSelectedCustomer(null)}
                        className="mt-2"
                    />
                </div>
            )}

            {/* Add Customer Button */}
            <Button
                label="+ Add Customer"
                variant="primary"
                size="medium"
                onClick={() => setIsModalOpen(true)}
                width="w-full"
            />

            {/* Add Customer Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                header={<h3 className="text-lg font-bold">Add Customer</h3>}
                footer={
                    <Button
                        label="Save Customer"
                        variant="primary"
                        size="medium"
                        onClick={handleAddCustomer}
                    />
                }
            >
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name *"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2
                                       focus:ring-2 focus:ring-primary-300 focus:outline-none"
                            value={newCustomer.name}
                            onChange={(e) =>
                                handleChange('name', e.target.value)
                            }
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <input
                            type="text"
                            placeholder="Phone *"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2
                                       focus:ring-2 focus:ring-primary-300 focus:outline-none"
                            value={newCustomer.phone}
                            onChange={(e) =>
                                handleChange('phone', e.target.value)
                            }
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2
                                       focus:ring-2 focus:ring-primary-300 focus:outline-none"
                            value={newCustomer.email}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CustomerSelector
