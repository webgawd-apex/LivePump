/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ecfdf5",
          DEFAULT: "#10b981", // Vibrant Emerald Green
          dark: "#065f46",
        },
        secondary: "#f8fafc", // Ash White/Slate 50
        accent: "#34d399",
      },
    },
  },
  plugins: [],
};
