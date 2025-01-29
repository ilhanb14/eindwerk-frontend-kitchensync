/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ffffff', // white
        'secondary': '#000000', // black
        'tertiary': '', // 
        'link': '#2563eb', // blue
        'logo': '#6ab414', // green
        'logo-pastel': '#c5f38f', // pastel green
        'border': '#e5e7eb', // light grey

        'primary-dark': '#333333', // dark grey
        'secondary-dark': '#ffffff', // white
        'tertiary-dark': '', // 
        'link-dark': '#296eff', // blue
        'logo-dark': '#6ab414', // green
        'logo-pastel-dark': '#c5f38f', //pastel green
        'border-dark': '#4b5563', // dark grey
      }
    },
  },
  plugins: [],
}

