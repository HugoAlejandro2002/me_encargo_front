/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                customPurple: '#8c30f5',
                customPurpleLight: '#a050f7',
                'blue': '#2C3048',
                'neutral-blue': '#3F4A8F',
                'light-neutral-blue': '#5E67A4',
                'light-blue': '#C3C6D9',
                'light-gray': '#EBEDF7',
                'dark-blue': '#171A26',
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif']
            },
            screens: {
                mobile: '375px',
                tablet: '768px',
                desktop: '1024px',
            },
            fontSize:{
                'mobile-sm': ['12px', '16px'],
                'mobile-base': ['14px', '20px'],
                'mobile-lg': ['16px', '24px'],
                'mobile-xl': ['18px', '28px'],
                'mobile-2xl': ['20px', '32px'],
                'mobile-3xl': ['22px', '36px'],
                'desktop-sm': ['14px', '18px'],
                'desktop-base': ['16px', '24px'],
                'desktop-lg': ['18px', '28px'],
                'desktop-xl': ['20px', '32px'],
                'desktop-2xl': ['22px', '34px'],
                'desktop-3xl': ['24px', '36px'],
            }
        },

    },
    plugins: [],
}
