import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          10: "#f5f6f7",
          20: "#f0f2f5",
          50: "#EFF2F5",
          100: "#f8fafdd9",
          200: "#a6b0c3",
          300: "#a6b0c3",
          500: "#7e899d",
          600: "#7d879a",
          700: "#616e85",
        },
        green: {
          50: "#c2ecd8",
          500: "#19c785",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
