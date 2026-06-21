/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bolt: {
          bg: "#0a0a0a",
          surface: "#141414",
          elevated: "#1e1e1e",
          border: "#2a2a2a",
          accent: "#f59e0b",
          accentHover: "#d97706",
          text: "#f5f5f4",
          muted: "#78716c",
          success: "#22c55e",
          danger: "#ef4444",
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        body: ['"DM Mono"', "monospace"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.5s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 158, 11, 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
