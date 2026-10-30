/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        ink: {
          950: '#0c1210',
          900: '#121a16',
          800: '#1a241f',
          700: '#24302a',
          500: '#4b5c53',
          400: '#6b7d73',
        },
        gold: {
          400: '#e2c258',
          500: '#d4af37',
          600: '#b8952e',
        },
      },
    },
  },
  plugins: [],
}
