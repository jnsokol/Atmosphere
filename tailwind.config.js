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
        "nav-pop": "navPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(6px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        navPop: {
          "0%":   { transform: "scale(1)"    },
          "40%":  { transform: "scale(1.35)" },
          "70%":  { transform: "scale(0.9)"  },
          "100%": { transform: "scale(1)"    },
        },
      },
    },
  },
  plugins: [],
};
