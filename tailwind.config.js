/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        atmosphere: {
          dawn:  "#f5d7b8",
          day:   "#7cb9e8",
          dusk:  "#9b6b9e",
          night: "#0b0d18",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)",  "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 185, 232, 0.15)",
        "glow-sm": "0 0 20px rgba(124, 185, 232, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(6px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
