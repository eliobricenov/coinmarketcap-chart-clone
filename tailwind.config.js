/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          300: "#a6b0c3",
          500: "#7e899d",
          700: "#616e85",
        },
      },
    },
  },
  plugins: [],
};
