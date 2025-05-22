import React from 'react'

const Loader = ({
    message = 'Great things take time...',
    spinnerSize = '10',
    color = 'text-primary-800',
    showOverlay = true, // Add overlay as optional
}) => {
    return (
        <>
            {showOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center justify-center min-h-[100px] space-y-4">
                        {/* Spinner */}
                        <div className="relative flex items-center justify-center">
                            <svg
                                className={`animate-spin h-${spinnerSize} w-${spinnerSize} ${color}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            {/* Inner pulse effect */}
                            <div
                                className="absolute h-full w-full animate-ping rounded-full border-4 border-dashed opacity-20"
                                style={{
                                    borderColor: 'currentColor',
                                }}
                            ></div>
                        </div>
                        {/* Message */}

                        <div className="relative">
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md"></div>
                            <p className="relative text-sm font-medium text-white">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Loader
