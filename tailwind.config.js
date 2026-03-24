/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          green: '#0E6B3E',
          'light-green': '#16A05A',
          'pale-green': '#F0FAF4',
        },
        navy: '#0B2B40',
        gold: {
          DEFAULT: '#C68B00',
          pale: '#FFFBEB',
        },
        soft: {
          white: '#FAFAFA',
          red: '#C0392B',
          'pale-red': '#FEF2F0',
        },
        border: '#E5EDE8',
        muted: '#5A7060',
      },
    },
  },
  plugins: [],
};
