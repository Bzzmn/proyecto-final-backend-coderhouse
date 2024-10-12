/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.handlebars',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      }
    },
  },
  safelist: [
    'bg-black/50',
    'backdrop-blur-sm',
    'opacity-100',
    'hidden'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
  ],
}
