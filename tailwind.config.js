/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors can be added here
        // brand: {
        //   red: '#dc2626',
        // },
      },
    },
  },
  plugins: [],
}
