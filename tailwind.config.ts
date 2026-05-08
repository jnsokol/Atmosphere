import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atmosphere: {
          dawn: "#f5d7b8",
          day: "#7cb9e8",
          dusk: "#9b6b9e",
          night: "#1a1d2e",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
