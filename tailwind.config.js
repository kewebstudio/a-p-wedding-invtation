/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FFF9F0",
        champagne: "#D6B477",
        gold: "#C49A48",
        pearl: "#F6EEE4",
        brown: "#65452D",
      },
      fontFamily: {
        elegant: ["Cormorant Garamond", "serif"],
        script: ["Great Vibes", "cursive"],
      },
    },
  },
  plugins: [],
};