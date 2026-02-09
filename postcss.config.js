// PostCSS Configuration File
// This file tells the build tool (Vite) how to process our CSS files.
export default {
  plugins: {
    // Tailwind CSS: Scans your files for class names (like 'text-center') and generates the corresponding CSS.
    "@tailwindcss/postcss": {},
    
    // Autoprefixer: Automatically adds vendor prefixes (like -webkit-, -moz-) to CSS rules 
    // so that your styles work correctly across different browsers.
    autoprefixer: {},
  },
}
