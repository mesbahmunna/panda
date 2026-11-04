/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#6044f0', // HT Bazar primary purple/violet
          600: '#4f32dc',
          700: '#4329b8',
          800: '#352194',
          900: '#0b0952', // HT Bazar secondary dark navy
        },
        babyCoral: {
          DEFAULT: '#ff5757', // HT Bazar discount badge red/coral
          dark: '#e03e3e',
          light: '#ffebeb',
        },
        babyPink: '#FFF0F5',
        babyBlue: '#F0F8FF',
        babyMint: '#E6F9F3',
        babyAmber: '#FFF8E7',
        heading: '#222831',
        bodyText: '#252a34',
        borderLight: '#e5e7eb',
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(96, 68, 240, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'floating': '0 20px 40px -15px rgba(11, 9, 82, 0.15)',
      }
    },
  },
  plugins: [],
}
