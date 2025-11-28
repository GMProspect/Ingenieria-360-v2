/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#22d3ee', // Custom cyan if needed, but default is usually fine
        },
        slate: {
          900: '#0f172a', // Custom slate if needed
        }
      }
    },
  },
  plugins: [],
}
