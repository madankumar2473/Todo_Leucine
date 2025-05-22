import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import Modal from './modal'
import Banner from './banner'
import { Link as ScrollLink } from 'react-scroll'

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open)
    }

    const drawerList = () => (
        <div
            className="w-full"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {['Consumer Trend', 'Benefits', 'Why Briskk', 'FAQ'].map(
                    (text) => (
                        <ListItem
                            key={text}
                            className="hover:bg-neutral-300 w-full"
                        >
                            <ScrollLink
                                to={text.toLowerCase().replace(/ /g, '-')}
                                offset={-100}
                                smooth={true}
                                duration={500}
                                className="w-full"
                            >
                                <div className="px-2">
                                    <ListItemText
                                        primary={text}
                                        onClick={toggleDrawer(false)}
                                    />
                                </div>
                            </ScrollLink>
                        </ListItem>
                    )
                )}
            </List>
        </div>
    )

    return (
        <div className="fixed w-full bg-white z-10">
            <nav className="container relative flex items-center justify-between md:px-8 lg:px-0 px-8 py-4 mx-auto">
                {/* Left: Logo */}
                <div className="lg:flex lg:justify-start lg:space-x-20 lg:items-center">
                    <div>
                        <Link href="/">
                            <Image
                                src="/img/BriskkbyCB44px.svg"
                                alt="Onboard on briskk platform by channelBlend Technologies"
                                width={141}
                                height={45}
                            />
                        </Link>
                    </div>
                </div>

                {/* Center: Desktop Navigation */}
                <div className="hidden lg:flex lg:text-lg space-x-6">
                    <ScrollLink
                        to="consumer-trend"
                        smooth={true}
                        duration={500}
                        offset={-110}
                        className="hover:text-primary-800 cursor-pointer"
                    >
                        Consumer Trend
                    </ScrollLink>
                    <ScrollLink
                        to="benefits"
                        smooth={true}
                        duration={500}
                        offset={-110}
                        className="text-gray-900 hover:text-blue-700 cursor-pointer"
                    >
                        Benefits
                    </ScrollLink>
                    <ScrollLink
                        to="why-briskk"
                        smooth={true}
                        duration={500}
                        offset={-110}
                        className="text-gray-900 hover:text-blue-700 cursor-pointer"
                    >
                        Why Briskk
                    </ScrollLink>
                    <ScrollLink
                        to="faq"
                        smooth={true}
                        duration={500}
                        offset={-110}
                        className="text-gray-900 hover:text-blue-700 cursor-pointer"
                    >
                        FAQ
                    </ScrollLink>
                </div>

                {/* Right: Desktop Buttons */}
                <div className="hidden lg:flex items-center space-x-4 nav__item">
                    {/* Onboard Your Store Button */}
                    <button
                        className="border border-primary-800 text-primary-700 font-bold py-2 px-8 rounded-lg hover:bg-primary-800 hover:text-white transition duration-300"
                        onClick={toggleModal}
                    >
                        Onboard Your Store
                    </button>
                    <Modal isOpen={isModalOpen} onClose={toggleModal} />

                    {/* Login Button */}
                    <a
                        href="/storeOS/login"
                        className="border border-primary-800 text-primary-800 font-bold py-2 px-8 rounded-lg hover:bg-primary-800 hover:text-white transition duration-300"
                    >
                        Login
                    </a>
                </div>

                {/* Mobile: Hamburger Menu and Login Button */}
                <div className="lg:hidden flex items-center space-x-4">
                    {/* Login Button */}
                    <a
                        href="/storeOS/login"
                        className="border border-primary-800 text-primary-800 text-xs py-1 px-4 font-bold rounded-lg hover:bg-primary-800 hover:text-white transition duration-300"
                    >
                        Login
                    </a>

                    {/* Hamburger Menu */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor="top"
                        open={isDrawerOpen}
                        onClose={toggleDrawer(false)}
                    >
                        {drawerList()}
                    </Drawer>
                </div>
            </nav>
            <Banner />
        </div>
    )
}

export default Navbar
