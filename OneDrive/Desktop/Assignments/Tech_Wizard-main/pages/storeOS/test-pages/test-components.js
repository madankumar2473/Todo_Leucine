import React, { useState } from 'react'
// import Card from '@/components/storeOS/Card'
// import Table from '@/components/storeOS/Table'
// import Sidebar from '../../../components/storeOS/Sidebar'
// import ChartComponent from '@/components/storeOS/ChartComponent'
// import Header from '@/components/storeOS/Header'
// import KPIWidget from '@/components/storeOS/KPIWidget'
// import Button from '@/components/storeOS/Button'
// import Dropdown from '@/components/storeOS/Dropdown'
// import InputField from '@/components/storeOS/InputField'
// import MultiSelectDropdown from '@/components/storeOS/MultiSelectDropdown'
// import ToggleSwitch from '@/components/storeOS/ToggleSwitch'
// import BarcodeGenerator from '@/components/storeOS/BarcodeGenerator'
// import BulkBarcodeGenerator from '@/components/storeOS/BulkBarcodeGenerator'
// import RadioButton from '@/components/storeOS/RadioButton'
// import Checkbox from '@/components/storeOS/Checkbox'
// import Modal from '@/components/storeOS/Modal'
// import CreateItemForm from '@/components/storeOS/CreateItemForm'

import {
    HomeIcon,
    ChartBarIcon,
    ArchiveBoxIcon,
    ChartPieIcon,
    CogIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    CalendarIcon,
    PlusIcon,
    ChevronDownIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'

import { ArrowDownward } from '@mui/icons-material'
import { CurrencyRupee } from '@mui/icons-material'

const TestComponents = () => {
    const [isModalOpen, setModalOpen] = useState(false)

    const headerContent = (
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Create Item</h2>
            <button
                className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
                onClick={() => setModalOpen(false)}
            >
                &times;
            </button>
        </div>
    )

    const footerContent = (
        <>
            <button
                className="px-4 py-2 text-sm bg-gray-200 text-neutral-700 rounded-md hover:bg-gray-300"
                onClick={() => setModalOpen(false)}
            >
                Cancel
            </button>
            <button className="px-4 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600">
                Save
            </button>
        </>
    )

    const [isChecked, setIsChecked] = useState(false)

    const [selected, setSelected] = useState('product')

    const radioOptions = [
        { label: 'Product', value: 'product' },
        { label: 'Service', value: 'service' },
    ]

    const items = [
        { skuId: 'ZEN-MR-S', productName: 'Product S', price: 3499 },
        { skuId: 'ZEN-MR-L', productName: 'Product L', price: 3499 },
        { skuId: 'ZEN-MR-XL', productName: 'Product XL', price: 3499 },
        { skuId: 'ZEN-MR-XXL', productName: 'Product XXL', price: 3599 },
        { skuId: 'ZEN-MR-3XL', productName: 'Product 3XL', price: 3699 },
        { skuId: 'ZEN-WR-S', productName: 'Women Product S', price: 3299 },
        { skuId: 'ZEN-WR-M', productName: 'Women Product M', price: 3299 },
        { skuId: 'ZEN-WR-L', productName: 'Women Product L', price: 3299 },
        { skuId: 'ZEN-WR-XL', productName: 'Women Product XL', price: 3399 },
    ]

    const [isAutoGenerate, setIsAutoGenerate] = useState(false)

    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const handleInputChange = (newValue, errorMessage) => {
        setValue(newValue)
        setError(errorMessage)
    }

    const [selectedColors, setSelectedColors] = useState([])
    const [multiOptions, setOptions] = useState([
        { value: 'Red', label: 'Red' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Green', label: 'Green' },
    ])

    const handleDropdownChange = (newSelectedOptions, updatedOptions) => {
        setSelectedColors(newSelectedOptions)
        setOptions(updatedOptions) // Update options when adding new
    }

    const user = {
        name: 'John Doe',
        storeName: 'Briskk Store',
    }

    const handleSearch = (query) => {
        console.log('Search query:', query)
    }

    const handleLogout = () => {
        console.log('User logged out')
    }

    // Example data for testing Table
    const columns = [
        { key: 'date', label: 'Date' },
        { key: 'type', label: 'Type' },
        { key: 'txnNo', label: 'Transaction No' },
        { key: 'partyName', label: 'Party Name' },
        { key: 'amount', label: 'Amount' },
    ]

    const data = [
        {
            date: '19 Nov 2024',
            type: 'Sales Invoice',
            txnNo: '5',
            partyName: 'Test',
            amount: '₹799',
        },
        {
            date: '19 Nov 2024',
            type: 'Sales Invoice',
            txnNo: '4',
            partyName: 'Bhushan',
            amount: '₹799',
        },
        {
            date: '19 Nov 2024',
            type: 'Payment In',
            txnNo: '2',
            partyName: 'Bhushan',
            amount: '₹888',
        },
        {
            date: '19 Nov 2024',
            type: 'Sales Invoice',
            txnNo: '3',
            partyName: 'Bhushan',
            amount: '₹888',
        },
        {
            date: '19 Nov 2024',
            type: 'Sales Invoice',
            txnNo: '2',
            partyName: 'Cash Sale',
            amount: '₹799',
        },
    ]

    const menuConfig = {
        default: [
            {
                label: 'Dashboard',
                icon: HomeIcon,
                route: '/storeOS/dashboard',
            },
            {
                label: 'Sales',
                icon: ChartBarIcon,
                children: [
                    {
                        label: 'Sales Invoices',
                        route: '/storeOS//sales/invoices',
                    },
                    {
                        label: 'Quotation / Estimate',
                        route: '/storeOS//sales/quotations',
                    },
                ],
            },
            {
                label: 'Items',
                icon: ArchiveBoxIcon,
                route: '/storeOS//items',
            },
            {
                label: 'Reports',
                icon: ChartPieIcon,
                route: '/storeOS//reports',
            },
            {
                label: 'Settings',
                icon: CogIcon,
                // route: '/storeOS/dashboard',
            },
        ],
        settings: [
            {
                label: 'Account',
                icon: UserIcon,
                route: '/storeOS//settings/account',
            },
            {
                label: 'Logout',
                icon: ArrowLeftOnRectangleIcon,
                route: '/storeOS//logout',
            },
        ],
    }

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales Report',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
    }

    const dropDownOptions = [
        { label: 'Today' },
        { label: 'Yesterday' },
        { label: 'This Week', icon: CalendarIcon },
        { label: 'Last Week', icon: CalendarIcon },
        { label: 'Last 7 Days', icon: CalendarIcon },
    ]

    const handleSelect = (option) => {
        console.log('Selected Option:', option)
    }

    return (
        <></>
        // <div className="flex h-screen bg-neutral-200">
        //     {/* Sidebar */}
        //     <div className="hidden md:block md:w-64 bg-primary-700 text-white">
        //         <Sidebar menuConfig={menuConfig} />
        //     </div>

        //     {/* Mobile Sidebar */}
        //     <div className="block md:hidden">
        //         <Sidebar menuConfig={menuConfig} />
        //     </div>

        //     {/* Main Content */}

        //     <div className="flex-1 overflow-auto p-8 ">
        //         {/* Header */}
        //         <div className=" bg-gray-50">
        //             <Header
        //                 user={user}
        //                 onSearch={handleSearch}
        //                 onLogout={handleLogout}
        //             />
        //             <div className="p-8">
        //                 <h1 className="text-2xl font-bold">
        //                     Welcome to the Briskk StoreOS Dashboard!
        //                 </h1>
        //             </div>
        //         </div>

        //         {/* Main Content Area */}
        //         <div className="space-y-8">
        //             {/* Card Section */}
        //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        //                 {/* To Collect Card */}
        //                 <Card
        //                     title="To Collect"
        //                     description="Outstanding payments"
        //                     value="₹1,598"
        //                     leftIcon={
        //                         <ArrowDownward className="w-6 h-6 text-green-500" />
        //                     }
        //                     rightIcon={
        //                         <CurrencyRupee className="text-green-500" />
        //                     }
        //                     bgColor="bg-white"
        //                     borderColor="border-green-100"
        //                     hoverEffect="hover:border-green-300"
        //                 />

        //                 {/* Custom Invoice Design Card */}
        //                 <Card
        //                     title="Custom Invoice Design"
        //                     description="With 50+ settings, design a custom invoice theme"
        //                     children={
        //                         <a
        //                             href="#"
        //                             className="text-blue-500 font-semibold hover:underline"
        //                         >
        //                             Create Custom Theme
        //                         </a>
        //                     }
        //                     bgColor="bg-white"
        //                     borderColor="border-gray-300"
        //                 />

        //                 {/* Total Cash + Bank Balance Card */}
        //                 <Card
        //                     title="Total Cash + Bank Balance"
        //                     value="₹1,785.79"
        //                     rightIcon={
        //                         <CurrencyRupee className="text-blue-500" />
        //                     }
        //                     bgColor="bg-blue-50"
        //                     borderColor="border-blue-200"
        //                 />
        //             </div>

        //             {/* Table Section */}
        //             <div className="bg-white p-6 shadow rounded-md">
        //                 <h2 className="text-lg font-bold mb-4">
        //                     Latest Transactions
        //                 </h2>
        //                 <Table
        //                     columns={columns}
        //                     data={data}
        //                     searchable={true}
        //                     sortable={true}
        //                     pagination={{ enabled: true, pageSize: 3 }}
        //                 />
        //             </div>
        //             {/* Chart Section */}
        //             <div className="p-8">
        //                 <h1 className="text-2xl font-bold mb-6">
        //                     Test Chart Component
        //                 </h1>
        //                 <ChartComponent
        //                     type="line"
        //                     data={chartData}
        //                     options={options}
        //                 />
        //             </div>
        //             <div className="p-8 bg-gray-100 ">
        //                 <h1 className="text-2xl font-bold mb-6">
        //                     KPI Widget Test
        //                 </h1>
        //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        //                     <KPIWidget
        //                         title="Stock Value"
        //                         value="0"
        //                         icon={CurrencyRupee}
        //                         link="https://example.com"
        //                     />
        //                     <KPIWidget
        //                         title="Total Sales"
        //                         value="3,383.79"
        //                         icon={CurrencyRupee}
        //                     />
        //                     <KPIWidget
        //                         title="Unpaid Amount"
        //                         value="1,598"
        //                         link="https://example.com/unpaid"
        //                     />
        //                 </div>
        //             </div>
        //             <div className="p-8 bg-gray-100 ">
        //                 <h1 className="text-2xl font-bold mb-6">
        //                     Customizable Button Test
        //                 </h1>
        //                 <div className="space-y-4">
        //                     {/* Button with both before and after icons */}
        //                     <Button
        //                         label="Bulk Actions"
        //                         iconBefore={PlusIcon}
        //                         iconAfter={ChevronDownIcon}
        //                         variant="secondary"
        //                         size="medium"
        //                     />
        //                     {/* Button with only before icon */}
        //                     <Button
        //                         label="Delete"
        //                         iconBefore={TrashIcon}
        //                         variant="outline"
        //                         size="small"
        //                     />
        //                     {/* Button with only after icon */}
        //                     <Button
        //                         label="Create Sales Invoice"
        //                         // iconAfter={ChevronDownIcon}
        //                         variant="primary"
        //                         size="large"
        //                     />
        //                 </div>
        //             </div>
        //             <div className="p-8 bg-gray-100 ">
        //                 <h1 className="text-2xl font-bold mb-6">
        //                     Dropdown Component Test
        //                 </h1>
        //                 <Dropdown
        //                     triggerLabel="Last 365 Days"
        //                     triggerIcon={CalendarIcon}
        //                     options={dropDownOptions}
        //                     onSelect={handleSelect}
        //                     width="w-64"
        //                 />
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test InputField Component
        //                 </h1>
        //                 <InputField
        //                     label="Username"
        //                     type="phone"
        //                     placeholder="Enter your username"
        //                     value={value}
        //                     onChange={handleInputChange}
        //                     validation={{
        //                         minLength: 3,
        //                         maxLength: 15,
        //                         pattern: '^[a-zA-Z0-9]+$',
        //                         custom: (val) =>
        //                             val === 'admin'
        //                                 ? "Username 'admin' is not allowed."
        //                                 : '',
        //                     }}
        //                     isRequired={true}
        //                     error={error}
        //                 />
        //                 <InputField
        //                     label="Age"
        //                     type="number"
        //                     placeholder="Enter your age"
        //                     value={value}
        //                     onChange={handleInputChange}
        //                     validation={{
        //                         min: 1,
        //                         max: 120,
        //                         custom: (val) =>
        //                             val < 0 ? 'Age cannot be negative.' : '',
        //                     }}
        //                     isRequired={true}
        //                     error={error}
        //                 />

        //                 <InputField
        //                     label="Email Address"
        //                     type="email"
        //                     placeholder="Enter your email"
        //                     value={value}
        //                     onChange={handleInputChange}
        //                     validation={{
        //                         pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
        //                         custom: (val) =>
        //                             val.endsWith('@example.com')
        //                                 ? 'Emails from example.com are not allowed.'
        //                                 : '',
        //                     }}
        //                     isRequired={true}
        //                     error={error}
        //                 />

        //                 <InputField
        //                     label="Password"
        //                     type="password"
        //                     placeholder="Enter your password"
        //                     value={value}
        //                     onChange={handleInputChange}
        //                     validation={{
        //                         minLength: 8,
        //                         maxLength: 20,
        //                         pattern:
        //                             '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
        //                         custom: (val) =>
        //                             val === 'password'
        //                                 ? "Password cannot be 'password'."
        //                                 : '',
        //                     }}
        //                     isRequired={true}
        //                     error={error}
        //                 />

        //                 <InputField
        //                     label="Phone Number"
        //                     type="tel"
        //                     placeholder="Enter your phone number"
        //                     value={value}
        //                     onChange={handleInputChange}
        //                     validation={{
        //                         pattern: '^\\+?[1-9][0-9]{9,14}$', // Matches international format or 10–15 digit phone numbers
        //                         custom: (val) =>
        //                             val.length < 10
        //                                 ? 'Phone number must be at least 10 digits.'
        //                                 : val.length > 15
        //                                   ? 'Phone number cannot exceed 10 digits.'
        //                                   : '',
        //                     }}
        //                     isRequired={true}
        //                     error={error}
        //                 />
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test MultiSelectDropdown Component
        //                 </h1>
        //                 <MultiSelectDropdown
        //                     label="Select Colors"
        //                     options={multiOptions}
        //                     selectedOptions={selectedColors}
        //                     onChange={handleDropdownChange}
        //                     allowAddNew={true} // Enable dynamic addition
        //                 />
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test ToggleSwitch Component
        //                 </h1>
        //                 <ToggleSwitch
        //                     label="Auto-generate SKUs"
        //                     checked={isAutoGenerate}
        //                     onChange={(newState) => setIsAutoGenerate(newState)}
        //                 />
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test RadioButton Component
        //                 </h1>
        //                 <RadioButton
        //                     options={radioOptions}
        //                     selectedOption={selected}
        //                     onChange={(value) => setSelected(value)}
        //                     name="itemType"
        //                 />
        //                 <p className="mt-4">Selected Option: {selected}</p>
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test Checkbox Component
        //                 </h1>
        //                 <Checkbox
        //                     label="Show in Online Store"
        //                     checked={isChecked}
        //                     onChange={setIsChecked}
        //                 />
        //                 <p className="mt-4">
        //                     Checked: {isChecked ? 'Yes' : 'No'}
        //                 </p>
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test Modal Component
        //                 </h1>
        //                 <button
        //                     className="px-4 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-2 focus:ring-primary-500"
        //                     onClick={() => setModalOpen(true)}
        //                 >
        //                     Open Modal
        //                 </button>

        //                 <Modal
        //                     isOpen={isModalOpen}
        //                     onClose={() => setModalOpen(false)}
        //                     header={headerContent}
        //                     footer={footerContent}
        //                     size="medium"
        //                 >
        //                     <p>
        //                         This is the body content of the modal. Add your
        //                         form or components here.
        //                     </p>
        //                 </Modal>
        //             </div>
        //             <div className="p-6">
        //                 <CreateItemForm />
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-xl font-bold mb-4">
        //                     Test BarcodeGenerator Component
        //                 </h1>
        //                 <BarcodeGenerator
        //                     skuId="123456789012"
        //                     productName="Briskk Product"
        //                     price={499}
        //                 />
        //             </div>
        //             <div className="p-4">
        //                 <h1 className="text-2xl font-bold mb-6">
        //                     Test Bulk Barcode Generator
        //                 </h1>
        //                 <BulkBarcodeGenerator items={items} />
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default TestComponents
