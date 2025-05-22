import { Store, Search, ShoppingBasket, AdsClick } from '@mui/icons-material'

const solutions = [
    {
        title: 'Marketplace Model',
        icon: <Store fontSize="large" className="text-indigo-600" />, // Example icon, replace with actual
        description: (
            <>
                <p> Multiple brands on one platform means more visibilty.</p>
            </>
        ),
    },
    {
        title: 'Discovery',
        icon: <Search fontSize="large" className="text-indigo-600" />, // Example icon, replace with actual
        description: (
            <>
                <p>
                    Enhanced product discovery before visiting store and
                    in-store
                </p>
            </>
        ),
    },
    {
        title: 'Saves time and money',
        icon: <ShoppingBasket fontSize="large" className="text-indigo-600" />, // Example icon, replace with actual
        description: (
            <>
                <p>Quick checkouts with dynamic pricing and payment offers.</p>
            </>
        ),
    },
    {
        title: 'Reach',
        icon: <AdsClick fontSize="large" className="text-indigo-600" />, // Example icon, replace with actual
        description: (
            <>
                <p> Targeted reach based on consumer purchase cycle.</p>
            </>
        ),
    },
]

const SolutionsSection = () => {
    return (
        <div className="bg-gray-50 py-12 ">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                    {solutions.map((solution, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 text-center shadow-md"
                        >
                            <div className="mb-4 flex justify-center">
                                {solution.icon}
                            </div>
                            <h3 className="text-xl font-bold text-black">
                                {solution.title}
                            </h3>
                            <div className="text-black text-centre">
                                {solution.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SolutionsSection
