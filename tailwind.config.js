/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        rem: ["var(--font-rem)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 4px -2px rgba(24,39,75,.08), 0 2px 4px -2px rgba(24,39,75,.12)",
        modal:
          "0 8px 28px -6px rgba(24,39,75,.12), 0 18px 88px -4px rgba(24,39,75,.14)",
      },
      colors: {
        brand: "rgb(var(--brand) / <alpha-value>)",
        "brand-ink": "rgb(var(--brand-ink) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "wasis-pr00": "rgb(var(--Primary-pr00) / <alpha-value>)",
        "wasis-pr40": "rgb(var(--Primary-pr40) / <alpha-value>)",
        "wasis-pr60": "rgb(var(--Primary-pr60) / <alpha-value>)",
        "wasis-pr80": "rgb(var(--Primary-pr80) / <alpha-value>)",
        "wasis-nt80": "rgb(var(--Neutral-nt80) / <alpha-value>)",
      },
      borderRadius: {
        massive: "6.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
