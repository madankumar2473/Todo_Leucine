import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Hero from '../components/hero'
import Navbar from '../components/navbar'
import SectionTitle from '../components/sectionTitle'
import Loader from '@/components/storeOS/Loader'

import { benefitOne, benefitTwo } from '../components/data'
import Video from '../components/video'
import Benefits from '../components/benefits'

import Faq from '../components/faq'
import PopupWidget from '../components/popupWidget'
import StatsSection from '../components/stats'
import SolutionsSection from '../components/cb_solution'
//import StoreFooter from '../components/StoreFooter'

import Footer from '../components/landingPage/Footer'
import Subscription from '../components/landingPage/Subscription'
import FAQ from '../components/landingPage/FAQ'
import Testimonials from '../components/landingPage/Testimonials'
import Blogs from '../components/landingPage/Blogs'
import Onboarding from '../components/landingPage/Onboarding'
import Features from '../components/landingPage/Features'
import BusinessImpact from '../components/landingPage/BusinessImpact'
import ConsumerTrends from '../components/landingPage/ConsumerTrends'
import NavBar from '../components/landingPage/Navbar'
import HeroSection from '../components/landingPage/HeroSection'
import { useStoreUser } from '@/contexts/StoreUserProvider'

const Home = () => {
    const [isChecking, setIsChecking] = useState(true) // To prevent flash of the homepage
    const router = useRouter()

    useEffect(() => {
        const storeStaff = localStorage.getItem('storeStaff')
        const authToken = Cookies.get('authToken') // Keep this if not managed

        const onDomContentLoaded = () => {
            const imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const img = entry.target
                            if (img.dataset.src) {
                                const tempImage = new Image()
                                tempImage.onload = () => {
                                    img.src = img.dataset.src
                                    img.classList.remove('opacity-0')
                                    img.classList.add('opacity-100')
                                }
                                tempImage.src = img.dataset.src
                                img.removeAttribute('data-src')
                                observer.unobserve(img)
                            }
                        }
                    })
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01,
                }
            )

            const loadImage = (img) => {
                if ('loading' in HTMLImageElement.prototype) {
                    img.loading = 'lazy'
                }

                img.classList.add(
                    'transition-opacity',
                    'duration-300',
                    'opacity-0'
                )

                img.onerror = () => {
                    const width =
                        img.getAttribute('width') || img.clientWidth || 300
                    const height =
                        img.getAttribute('height') || img.clientHeight || 200
                    img.src = `https://placehold.co/${width}x${height}/DEDEDE/555555?text=Image+Unavailable`
                    img.alt = 'Image unavailable'
                    img.classList.remove('opacity-0')
                    img.classList.add('opacity-100', 'error-image')
                }

                if (img.dataset.src) {
                    imageObserver.observe(img)
                } else {
                    img.classList.remove('opacity-0')
                    img.classList.add('opacity-100')
                }
            }

            document
                .querySelectorAll('img[data-src], img:not([data-src])')
                .forEach(loadImage)

            // Watch for dynamically added images
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IMG') {
                                loadImage(node)
                            }
                            node.querySelectorAll('img').forEach(loadImage)
                        }
                    })
                })
            }).observe(document.body, {
                childList: true,
                subtree: true,
            })

            // Performance monitoring
            if ('performance' in window && 'PerformanceObserver' in window) {
                // Create performance observer
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    entries.forEach((entry) => {
                        if (entry.entryType === 'largest-contentful-paint') {
                            // console.log(`LCP: ${entry.startTime}ms`);
                        }
                        if (entry.entryType === 'first-input') {
                            // console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
                        }
                        if (entry.entryType === 'layout-shift') {
                            // console.log(`CLS: ${entry.value}`);
                        }
                    })
                })

                // Observe performance metrics
                observer.observe({
                    entryTypes: [
                        'largest-contentful-paint',
                        'first-input',
                        'layout-shift',
                    ],
                })

                // Log basic performance metrics
                window.addEventListener('load', () => {
                    const timing = performance.getEntriesByType('navigation')[0]
                    console.log({
                        'DNS Lookup':
                            timing.domainLookupEnd - timing.domainLookupStart,
                        'TCP Connection':
                            timing.connectEnd - timing.connectStart,
                        'DOM Content Loaded':
                            timing.domContentLoadedEventEnd -
                            timing.navigationStart,
                        'Page Load':
                            timing.loadEventEnd - timing.navigationStart,
                    })
                })
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDomContentLoaded)
        } else {
            // DOM is already loaded
            onDomContentLoaded()
        }
        //TODO  call staff api ..get user and validate authToken before redirecting (validateAuth)
        if (storeStaff && authToken) {
            // Redirect to /storeOS/Dashboard if user is logged in
            router.replace('/storeOS/dashboard')
        } else {
            // Complete the check and allow the homepage to render
            setIsChecking(false)
        }
    }, [router])

    return (
        <>
            {isChecking && <Loader />}
            <Head>
                <title>
                    Briskk for stores : Onboard your store on briskk to
                    seamlessly connect to shopper
                </title>
                <meta
                    name="title"
                    content="Briskk for Stores - Expand Your Retail Reach"
                ></meta>
                <meta
                    name="description"
                    content="Join Briskk and transform your store into a digital powerhouse with seamless integration, advanced analytics, and personalized recommendations. Our AI-driven marketplace connects you to millions of shoppers, streamlining operations, enhancing visibility, and driving growth."
                ></meta>
                <meta
                    name="keywords"
                    content="Briskk, AI-driven marketplace, retail solutions, store integration, advanced analytics, retail management, increase sales, streamline operations, shop owners, digital transformation"
                ></meta>
                <meta name="author" content="Briskk"></meta>
                <meta name="robots" content="index, follow"></meta>
                <meta
                    property="og:title"
                    content="Briskk for Stores - Expand Your Retail Reach"
                ></meta>
                <meta
                    property="og:description"
                    content="Join Briskk and transform your store into a digital powerhouse with seamless integration, advanced analytics, and personalized recommendations. Our AI-driven marketplace connects you to millions of shoppers, streamlining operations, enhancing visibility, and driving growth."
                ></meta>
                <meta
                    property="og:image"
                    content="img/BriskkbyCB-store.png"
                ></meta>
                <meta
                    property="og:url"
                    content="https://store.briskk.one"
                ></meta>
                <meta property="og:type" content="website"></meta>
                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta
                    name="twitter:title"
                    content="Briskk for Stores - Expand Your Retail Reach"
                ></meta>
                <meta
                    name="twitter:description"
                    content="Join Briskk and transform your store into a digital powerhouse with seamless integration, advanced analytics, and personalized recommendations. Our AI-driven marketplace connects you to millions of shoppers, streamlining operations, enhancing visibility, and driving growth."
                ></meta>
                <meta
                    name="twitter:image"
                    content="img/BriskkbyCB-store.png"
                ></meta>

                <link rel="canonical" href="https://store.briskk.one" />
                <link rel="icon" href="img/briskk_favicon.png" />

                <script
                    defer
                    src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.13.3/cdn.min.js"
                ></script>
                <script
                    defer
                    src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.45.1/apexcharts.min.js"
                ></script>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                    crossorigin="anonymous"
                    referrerpolicy="no-referrer"
                />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <NavBar />
            <HeroSection />
            <Features />
            <BusinessImpact />
            <ConsumerTrends />
            <Onboarding />
            <Blogs />
            {/* <Testimonials/> */}
            <FAQ />
            <Subscription />
            <Footer />
            {/* <PopupWidget /> */}
        </>
    )
}

export default Home
