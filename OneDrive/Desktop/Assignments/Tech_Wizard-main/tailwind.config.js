const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
    mode: 'jit',
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                teal: colors.teal,
                trueGray: colors.neutral,
                primary: {
                    900: '#0000d2',
                    800: '#063ad9',
                    700: '#2257e0',
                    600: '#3c6fe6',
                    500: '#5785ec',
                    400: '#729af1',
                    300: '#8daff5',
                    200: '#a9c3f9',
                    100: '#c5d7fc',
                },
                secondary_green: {
                    900: '#01fd82',
                    800: '#4dfe90',
                    700: '#6dff9d',
                    600: '#86ffaa',
                    500: '#9bffb7',
                    400: '#aeffc3',
                    300: '#c0ffcf',
                    200: '#d1ffdb',
                    100: '#e1ffe7',
                },
                secondary_violet: {
                    900: '#a563ff',
                    800: '#ad75ff',
                    700: '#b586ff',
                    600: '#be96ff',
                    500: '#c7a6ff',
                    400: '#d0b5ff',
                    300: '#d9c4ff',
                    200: '#e2d3ff',
                    100: '#ece2ff',
                },
                neutral: {
                    900: '#303030',
                    800: '#424242',
                    700: '#727272',
                    600: '#7d7d7d',
                    500: '#a8a8a8',
                    400: '#e4e4e4',
                    300: '#f0f0f0',
                    200: '#f7f7f7',
                },
                black: '#010101',
                white: '#FFFFFF',
            },
        },
        fontFamily: {
            sans: ['Inter', ...defaultTheme.fontFamily.sans],
            stock: [defaultTheme.fontFamily.sans],
        },
    },
    plugins: [],
}