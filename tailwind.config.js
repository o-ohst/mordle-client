/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    fontFamily: {
      'jost': ['"Jost"'],
      'poppins': ['"Poppins"'],
      'secular': ['"Secular One"'],
    },
    extend: {
      fontFamily: {
        'sans': ['"Poppins"'],
      },
}
  },
  plugins: [],
}
