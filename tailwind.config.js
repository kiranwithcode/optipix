/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        primary: '#38BDF8',
        secondary: '#22C55E',
        text: '#E5E7EB',
      },
    },
  },
  plugins: [],
}

