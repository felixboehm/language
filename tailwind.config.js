/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#667eea',
          600: '#5568d3',
        },
        secondary: {
          500: '#764ba2',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
