// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        
        sans: ['Poppins', 'sans-serif'], 
        serif: ['Playfair Display', 'serif'], 
        brand: ['Dancing Script', 'cursive'],
      },
      colors: {
        'glam-pink': '#EC4899',
        'glam-light-pink': '#FCE7F3', 
        'glam-dark-pink': '#831843', 
        'glam-purple': '#A78BFA', 
        'glam-light-purple': '#EDE9FE',
      },
    },
  },
  plugins: [],
}