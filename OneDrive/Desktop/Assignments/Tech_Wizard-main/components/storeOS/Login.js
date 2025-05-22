// Login.js
import React, { useState } from 'react'
import Modal from './Modal'
import Notification from './Notification'
import Button from './Button'
import { useStoreUser } from '@/contexts/StoreUserProvider'
import { useRouter } from 'next/router'

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState(1) // Step 1: Phone input, Step 2: OTP input
    const [notification, setNotification] = useState({ type: '', message: '' })

    const { sendOtp, verifyOtp, loading, error } = useStoreUser()
    const router = useRouter()

    const handleSendOtp = async () => {
        if (!phone || phone.length !== 10) {
            setNotification({
                type: 'error',
                message: 'Please enter a valid phone number.',
            })
            return
        }

        const response = await sendOtp(phone)

        if (response.success) {
            setNotification({
                type: 'success',
                message: 'OTP sent successfully.',
            })
            setStep(2) // Move to OTP input step
        } else {
            setNotification({ type: 'error', message: response.message })
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setNotification({
                type: 'error',
                message: 'Please enter a valid OTP.',
            })
            return
        }

        const response = await verifyOtp(phone, otp)

        if (response.success) {
            setNotification({ type: 'success', message: 'Login successful!' })
            onClose() // Close the modal after successful login
            onLoginSuccess()
        } else {
            setNotification({ type: 'error', message: response.message })
        }
    }

    // Function to handle Enter key press
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (step === 1) {
                handleSendOtp()
            } else if (step === 2) {
                handleVerifyOtp()
            }
        }
    }  

    const handleClose = () => {
        onClose();
        router.push('/');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            // handleClose={handleClose}
            header={
                <h2 className="text-lg font-bold">Login to Briskk StoreOS</h2>
            }
        >
            <div className="p-4">
                {/* Notification */}
                {notification.message && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() =>
                            setNotification({ type: '', message: '' })
                        }
                    />
                )}

                {error && (
                    <Notification
                        message={error}
                        type="error"
                        onClose={() =>
                            setNotification({ type: '', message: '' })
                        }
                    />
                )}

                {step === 1 && (
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mobile Number{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={handleKeyDown} // Add key down event
                            className="w-full px-4 py-2 mb-8 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Enter your mobile number"
                        />
                        <Button
                            onClick={handleSendOtp}
                            label={loading ? 'Sending...' : 'Get OTP'}
                            variant="primary"
                            width="w-full"
                            size="medium"
                            disabled={loading}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            OTP <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            onKeyDown={handleKeyDown} // Add key down event
                            className="w-full px-4 py-2 mb-8 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Enter the OTP"
                        />
                        <Button
                            onClick={handleVerifyOtp}
                            label={loading ? 'Verifying...' : 'Verify OTP'}
                            variant="primary"
                            width="w-full"
                            size="medium"
                            disabled={loading}
                        />
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default Login
