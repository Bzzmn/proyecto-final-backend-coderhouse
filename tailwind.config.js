/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.handlebars',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}

