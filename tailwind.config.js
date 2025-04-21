const path = require("path"); // Use require for CJS config file
const tailwindcss = require("@tailwindcss/vite"); // Use require
// const { defineConfig } = require("vite"); // Assuming vite config might not be needed here, just tailwind
// const react = require("@vitejs/plugin-react"); // Assuming vite config might not be needed here
// const { nodePolyfills } = require('vite-plugin-node-polyfills'); // Assuming vite config might not be needed here

/** @type {import('tailwindcss').Config} */
export default { // Use export default for ESM
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ... existing theme extensions ...
    },
  },
  plugins: [
    import('tailwindcss-animate'), // Use import() for ESM plugins
    import('@tailwindcss/typography'),
  ],
}

// The rest seems like vite.config.js content, which should be separate
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(), 
//     tailwindcss(),
//     nodePolyfills(), // Add the plugin here
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//       // buffer: 'buffer/', // Remove manual alias, plugin handles it
//     },
//   },
//   // define: {
//   //   global: 'globalThis', // Remove manual define, plugin handles it
//   // },
// }); 