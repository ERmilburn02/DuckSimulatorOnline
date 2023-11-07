/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "level-leaderboard": "1fr 2fr 4fr 4fr",
        "level-leaderboard-mobile": "1fr 3fr 4fr 4fr",
      },
    },
  },
  plugins: [],
};
