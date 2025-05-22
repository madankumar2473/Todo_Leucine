import InstagramIcon from '@mui/icons-material/Instagram'
import XIcon from '@mui/icons-material/X'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import popularLocations from '../data/popularLocation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Modal from './modal'

const StoreFooter = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const compressedAddress = (address) => {
        const parts = address.split(',')
        console.log(parts)

        return parts[0]
    }

    return (
        <>
            <div className="md:py-16 md:px-28 bg-[#ECE2FF] text-black py-16 px-8">
                <div className="bg-white rounded-3xl lg:py-20 py-12 px-8 inline-block w-full">
                    <div className="md:flex md:flex-col md:items-center flex flex-col items-center">
                        <h2 className="md:text-5xl text-3xl font-bold text-center">
                            Unlock New Customers
                        </h2>

                        <div className="md:text-xl flex text-sm py-6">
                            <div className="flex items-center space-x-1 mr-4">
                                <span>📈</span>
                                <span>Footfall</span>
                            </div>
                            <div className="flex items-center space-x-1 mr-4">
                                <span>💰</span>
                                <span>Sales</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🌟</span>
                                <span className="whitespace-nowrap">
                                    Happy Customers
                                </span>
                            </div>
                        </div>
                        <div className="">
                            <button
                                onClick={toggleModal}
                                className="border-2 border-primary-800 text-primary-700 text-sm md:font-bold font-semibold px-8 py-1.5 md:py-2 md:px-8 md:text-base rounded-md hover:bg-primary-800 hover:text-white transition duration-300"
                            >
                                Onboard Your Store
                            </button>
                            <Modal isOpen={isModalOpen} onClose={toggleModal} />
                        </div>
                    </div>
                </div>
            </div>

            {/* bottom footer */}

            <div
                className={` bg-white text-black flex flex-col space-y-2 justify-between py-12 md:px-28 px-6`}
            >
                <div className="md:flex md:justify-start flex justify-center mb-2">
                    <img
                        src="/img/BriskkbyCB44px.svg"
                        alt="Onboard on briskk platform by channelBlend Technologies"
                        className="md:h-16 h-12 "
                    />
                </div>
                <div className="md:flex-row md:flex md:justify-between md:space-y-0 flex flex-col justify-between space-y-6 items-center">
                    <div className="md:flex md:flex-row md:space-x-4 md:space-y-0 flex flex-col justify-between space-y-2 items-center">
                        <div className="md:flex md:flex-row md:justify-center md:items-center">
                            <h3 className="md:text-2xl text-xl font-semibold text-black">
                                Stores in
                            </h3>
                        </div>
                        <div className="md:flex md:flex-row md:justify-start md:items-start md:text-xl flex flex-wrap justify-center items-center space-x-2 text-primary-900 font-semibold">
                            {popularLocations.map((location, index) => (
                                <a href={location.link} key={index}>
                                    {compressedAddress(location.storeName)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row justify-between space-x-4">
                        <a
                            href="https://www.instagram.com/briskk_shop"
                            target="_blank"
                            className="bg-gray-200 p-2 rounded-full"
                        >
                            <InstagramIcon className="cursor-pointer text-black hover:text-primary-900 w-6 h-6" />
                        </a>
                        <a
                            href="https://x.com/Briskk_shop"
                            target="_blank"
                            className="bg-gray-200 p-2 rounded-full"
                        >
                            <XIcon className="cursor-pointer text-black hover:text-primary-900 w-6 h-6" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/briskk"
                            target="_blank"
                            className="bg-gray-200 p-2 rounded-full"
                        >
                            <LinkedInIcon className="cursor-pointer text-black hover:text-primary-900 w-6 h-6" />
                        </a>
                    </div>
                </div>
                <div className="md:flex md:flex-row md:justify-between md:space-y-0 md:text-xl flex flex-col justify-between space-y-1 items-center text-xs">
                    <div className="flex flex-row justify-start">
                        <Link href="/terms-condition" className="">
                            Terms & Conditions |
                        </Link>
                        <Link href="/privacy-policy" className="ml-2">
                            Privacy Policy
                        </Link>
                    </div>
                    <div className="">
                        <p>
                            Copyright © 2024 Channelblend Technologies Pvt.
                            Ltd.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StoreFooter
