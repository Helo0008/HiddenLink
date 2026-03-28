import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          slate: "#1e293b",
          indigo: "#4f46e5",
          electric: "#6366f1",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;