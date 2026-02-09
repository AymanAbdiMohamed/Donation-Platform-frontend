// PostCSS Configuration File
// This file tells the build tool (Vite) how to process our CSS files.
export default {
  plugins: {
<<<<<<< HEAD
    // Tailwind CSS v4: Uses the @tailwindcss/postcss plugin
    '@tailwindcss/postcss': {},
=======
    // Tailwind CSS: Scans your files for class names (like 'text-center') and generates the corresponding CSS.
    "@tailwindcss/postcss": {},
>>>>>>> 57ae4e226f439ef1f822eb6c358f2d10aea5887f
    
    // Autoprefixer: Automatically adds vendor prefixes (like -webkit-, -moz-) to CSS rules 
    // so that your styles work correctly across different browsers.
    autoprefixer: {},
  },
}
