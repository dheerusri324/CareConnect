/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // ADD THIS NEW SPARKLE KEYFRAME
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'scale(1.5)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(180deg)', opacity: '0' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // ADD THIS NEW SPARKLE ANIMATION
        sparkle: "sparkle 0.8s ease-out forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
