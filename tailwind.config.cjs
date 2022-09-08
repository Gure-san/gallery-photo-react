/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors : {
        'primary' : '#F4EEFF',
        'secondary' : '#DCD6F7',
        'tertiary' : '#A6B1E1',
        'extra' : '#424874',
        'dark' : '#494453'
      }
    },
  },
  plugins: [],
}
