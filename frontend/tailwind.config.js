/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 25px rgba(37, 99, 235, 0.35)'
      }
    }
  },
  plugins: []
};
