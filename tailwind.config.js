/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Poppins"'],
        'jost': ['"Jost"'],
        'poppins': ['"Poppins"'],
        'mono': ['"Source Code Pro"'],
      },
      colors: {
        'tblue': '#050824',
        'tpurple': '#A882DD',
        'tpink': '#e67ac5',
        'tteal': '#4fc9af',
        'torange': '#F87060'
      },
      animation: {
        'spin': 'spin 4s forwards infinite',
      },
      keyframes: {
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(180deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(360deg)' }
        }
      }
    }
  },
  plugins: [],
}
