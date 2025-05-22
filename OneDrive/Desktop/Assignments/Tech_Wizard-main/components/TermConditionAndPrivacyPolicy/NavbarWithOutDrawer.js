import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Modal from '../modal'
import Banner from '../banner'

const NavbarWithOutDrawer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    return (
        <div className="fixed w-full bg-white z-10">
            <nav className="relative flex items-center justify-between md:px-8 lg:px-28 px-8 py-4">
                {/* Left: Logo */}
                <div className="lg:flex lg:justify-start lg:space-x-20 lg:items-center">
                    <div>
                        <Link href="/">
                            <Image
                                src="/img/BriskkbyCB44px.svg"
                                alt="Onboard on briskk platform by ChannelBlend Technologies"
                                width={141}
                                height={45}
                            />
                        </Link>
                    </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex items-center space-x-4 nav__item">
                    {/* Onboard Your Store Button */}
                    <button
                        className="border border-primary-800 text-primary-700 text-xs lg:text-base lg:px-8 px-4 py-2 font-bold rounded-lg hover:bg-primary-800 hover:text-white transition duration-300"
                        onClick={toggleModal}
                    >
                        Onboard Your Store
                    </button>
                    <Modal isOpen={isModalOpen} onClose={toggleModal} />

                    {/* Login Button */}
                    <a
                        href="/storeOS/login"
                        className="border border-primary-800 text-primary-800 text-xs lg:text-base lg:px-8 px-4 py-2 font-bold rounded-lg hover:bg-primary-800 hover:text-white transition duration-300"
                    >
                        Login
                    </a>
                </div>
            </nav>
            <Banner />
        </div>
    )
}

export default NavbarWithOutDrawer
