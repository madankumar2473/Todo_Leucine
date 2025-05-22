export const formatPrice = (price) => {
    if (price == null || price === '') {
        return 'Not valid Price' //
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2, // No decimal points
    }).format(price)
}

export const calculateDiscount = (basePrice, offerPrice) => {
    // Return null if either price is missing or they are the same
    if (!basePrice || !offerPrice || basePrice === offerPrice) return null

    // Calculate the discount percentage
    const discount = ((basePrice - offerPrice) / basePrice) * 100

    // If discount is less than or equal to 0, return null (for safety)
    if (discount <= 0) return null

    // Return the rounded discount percentage
    return Math.round(discount)
}
