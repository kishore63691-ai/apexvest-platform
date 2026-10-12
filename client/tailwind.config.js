/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0b0f19',
          card: '#111827',
          cardLight: '#1f2937',
          accent: '#10b981',
          gold: '#f59e0b',
          blue: '#3b82f6',
          border: '#374151'
        }
      }
    },
  },
  plugins: [],
}
