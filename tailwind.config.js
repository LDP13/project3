/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  safelist: [
    'to-purple-100',
    'to-blue-100',
    'to-green-100',
    'to-rose-100',
    'to-amber-100',
    'to-purple-950',
    'to-blue-950',
    'to-green-950',
    'to-rose-950',
    'to-amber-950',
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-rose-500',
    'bg-amber-500',
  ],
  plugins: [],
};