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
            }
        },

    },
    plugins: [],
}
