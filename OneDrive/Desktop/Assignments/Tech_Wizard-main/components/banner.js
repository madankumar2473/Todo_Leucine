import Link from 'next/link'
import { useState, useEffect } from 'react'

const Banner = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
    }

    return (
        <>
            {isVisible && (
                <div
                    className={`relative bg-neutral-200 text-black py-4 px-4 text-center flex justify-center items-center slide-down`}
                >
                    <p className="text-xs md:text-base font-bold">
                        Announcing the launch of Briskk App!!
                        <a
                            href="https://Briskk.one"
                            target="_blank"
                            className="cursor-pointer text-primary-800 font-bold mx-1"
                        >
                            Check App
                        </a>
                    </p>
                    <button
                        onClick={handleClose}
                        className="cursor-pointer absolute right-2 md:right-6 text-black hover:text-gray-300"
                    >
                        &times;
                    </button>
                </div>
            )}
        </>
    )
}

export default Banner
