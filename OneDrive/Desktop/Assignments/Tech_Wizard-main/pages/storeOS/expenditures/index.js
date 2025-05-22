import React from 'react'
import Layout from '@/layouts/Layout'
import { ExpenditureProvider } from '@/contexts/ExpenditureProvider'
import ExpenditureList from '@/components/storeOS/composites/ExpenditureList' // Placeholder for the main component

const Expenditures = () => {
    return (
        <ExpenditureProvider>
            <Layout title="Manage Expenditures">
                <div className="space-y-8">
                    {/* Expenditure List Section */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        {/* <h2 className="text-lg font-bold text-primary-700 mb-4 sm:mb-6">
                            Manage Expenditures
                        </h2> */}

                        {/* Expenditure List Component */}
                        <ExpenditureList />
                    </div>
                </div>
            </Layout>
        </ExpenditureProvider>
    )
}

export default Expenditures
