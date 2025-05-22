import React from 'react'
import PropTypes from 'prop-types'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const KPIWidget = ({ title, value, icon: Icon, link }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md border border-primary-200 relative flex flex-col hover:shadow-lg hover:border-primary-300 transition-shadow">
            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 text-primary-500 hover:text-primary-600"
                >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </a>
            )}
            <h3 className="text-sm font-medium text-primary-700 mb-2">
                {title}
            </h3>
            <div className="flex items-center">
                {Icon && (
                    <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-2">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    )
}

KPIWidget.propTypes = {
    title: PropTypes.string.isRequired, // KPI Title
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // KPI Value
    icon: PropTypes.elementType, // Optional Icon for KPI
    link: PropTypes.string, // Optional URL for the top-right icon
}

KPIWidget.defaultProps = {
    icon: null, // No icon by default
    link: null, // No link by default
}

export default KPIWidget
