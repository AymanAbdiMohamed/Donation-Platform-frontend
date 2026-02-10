// PostCSS Configuration File
// This file tells the build tool (Vite) how to process our CSS files.
export default {
  plugins: {
    // Tailwind CSS v4: Uses the @tailwindcss/postcss plugin
    '@tailwindcss/postcss': {},
    
    // Autoprefixer: Automatically adds vendor prefixes (like -webkit-, -moz-) to CSS rules 
    // so that your styles work correctly across different browsers.
    autoprefixer: {},
  },
}
