import React, { useState, useEffect } from 'react'
import { useExpenditure } from '@/contexts/ExpenditureProvider'
import Loader from '@/components/storeOS/Loader'
import Button from '@/components/storeOS/Button'
import Modal from '@/components/storeOS/Modal' // For edit and delete confirmation modals
import Toast from '@/components/storeOS/Toast'
import Notification from '@/components/storeOS/Notification'
import CreateExpenditureModal from '@/components/storeOS/composites/CreateExpenditureModal'
import { formatPrice } from '@/utils/util'

const ExpenditureList = () => {
    const {
        expenditures,
        loading,
        error,
        fetchExpenditures,
        deleteExpenditure,
        clearErrorState,
    } = useExpenditure()

    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [selectedExpenditure, setSelectedExpenditure] = useState(null)

    useEffect(() => {
        fetchExpenditures({}) // Fetch initial expenditures on mount
    }, [fetchExpenditures])

    const handleDelete = async () => {
        if (selectedExpenditure) {
            const result = await deleteExpenditure(selectedExpenditure.id)
            if (result.success) {
                setToastMessage('Expenditure deleted successfully.')
            } else {
                setToastMessage('Failed to delete expenditure.')
            }
            setShowToast(true)
            setDeleteModalOpen(false)
        }
    }

    const handleEdit = (data) => {
        setModalData(data)
        setCreateModalOpen(true)
    }

    const handleCreate = () => {
        setModalData(null) // Clear modal data for create
        setCreateModalOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Add Expenditure Button */}
            <div className="flex justify-end">
                <Button
                    label="Add Expenditure"
                    variant="primary"
                    size="medium"
                    onClick={handleCreate}
                />
            </div>

            {/* Filters */}
            {error && (
                <Notification
                    message={error}
                    type="error"
                    onClose={clearErrorState}
                />
            )}

            {/* Table */}
            {loading ? (
                <Loader message="Loading expenditures..." />
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">
                                    Category
                                </th>
                                <th className="px-4 py-2 text-left">
                                    Payment Mode
                                </th>
                                <th className="px-4 py-2 text-left">
                                    Total Amount
                                </th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenditures.map((expenditure, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">
                                        {expenditure.category}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {expenditure.payment_type}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {formatPrice(expenditure.total_amount)}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {new Date(
                                            expenditure.inserted_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <div className="space-x-2">
                                            {/* <Button
                                                label="Edit"
                                                size="small"
                                                variant="primary"
                                                onClick={() =>
                                                    handleEdit(expenditure)
                                                }
                                            /> */}
                                            <Button
                                                label="Delete"
                                                size="small"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedExpenditure(
                                                        expenditure
                                                    )
                                                    setDeleteModalOpen(true)
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Expenditure Modal */}
            <CreateExpenditureModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                initialData={modalData}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                header={<h3 className="text-lg font-bold">Confirm Delete</h3>}
                footer={
                    <div className="flex justify-end space-x-4">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => setDeleteModalOpen(false)}
                        />
                        <Button
                            label="Delete"
                            variant="outline"
                            onClick={handleDelete}
                        />
                    </div>
                }
            >
                <p>Are you sure you want to delete this expenditure?</p>
            </Modal>

            {/* Toast for notifications */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    )
}

export default ExpenditureList
