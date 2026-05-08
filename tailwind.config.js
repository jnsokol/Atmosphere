/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
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
};
