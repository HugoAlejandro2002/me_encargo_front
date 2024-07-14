/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                customPurple: '#8c30f5',
                customPurpleLight: '#a050f7',
            },
        },
    },
    plugins: [],
}
