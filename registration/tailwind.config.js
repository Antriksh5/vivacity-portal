/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                'nav': '1400px',
            },
            animation: {
                'form-fade-in': 'formFadeIn 1.2s ease-out forwards',
                'form-appear': 'formFadeIn 1.5s ease-out 0.8s backwards',
                'shake': 'shake 0.4s ease-in-out',
                'logo-spin': 'logo-spin infinite 20s linear',
                'fade-in': 'fadeIn 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
            keyframes: {
                formFadeIn: {
                    '0%': { opacity: '0', transform: 'translate(-50%, -45%)' },
                    '100%': { opacity: '1', transform: 'translate(-50%, -50%)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-5px)' },
                    '75%': { transform: 'translateX(5px)' },
                },
                'logo-spin': {
                    'from': { transform: 'rotate(0deg)' },
                    'to': { transform: 'rotate(360deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '50%': { opacity: '0.5' },
                    '75%': { opacity: '0.75' },
                    '100%': { opacity: '1' },
                }
            },
            fontFamily: {
                'gill': ['"Gill Sans"', '"Gill Sans MT"', 'Calibri', '"Trebuchet MS"', 'sans-serif'],
                'grobold': ['GROBOLD', 'sans-serif'],
                'rfabb': ['RF_ABB', 'sans-serif'],
                'lemon-milk': ['"LEMON MILK"', 'sans-serif'],
                'vito-sans': ['"Vito Sans"', 'sans-serif'],
            },
            spacing: {
                '77.5': '310px',
                '95': '380px',
                '105': '420px',
                '300': '750px',
                '320': '800px',
                '350': '875px',
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.backface-visible': {
                    'backface-visibility': 'visible',
                },
                '.backface-hidden': {
                    'backface-visibility': 'hidden',
                },
            })
        }
    ],
}
