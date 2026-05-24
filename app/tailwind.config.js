/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
        "colors": {
            // Core Premium Dark Palette
            "background": "#0b0e14",
            "surface": "#151a23",
            "surface-container-low": "#11151c",
            "surface-container": "#151a23",
            "surface-container-high": "#1e2532",
            "surface-container-highest": "#283243",
            "surface-container-lowest": "#07090d",
            "outline": "#334155",
            "outline-variant": "rgba(255, 255, 255, 0.08)",
            
            // Text Colors
            "on-background": "#f8fafc",
            "on-surface": "#f8fafc",
            "on-surface-variant": "#94a3b8",
            
            // Accents
            "primary": "#00f0ff",
            "on-primary": "#000000",
            "primary-container": "rgba(0, 240, 255, 0.15)",
            "on-primary-container": "#8affff",
            
            "secondary": "#8b5cf6",
            "on-secondary": "#ffffff",
            "secondary-container": "rgba(139, 92, 246, 0.15)",
            "on-secondary-container": "#d8b4fe",
            
            "tertiary": "#ec4899",
            "on-tertiary": "#ffffff",
            "tertiary-container": "rgba(236, 72, 153, 0.15)",
            "on-tertiary-container": "#fbcfe8",

            "error": "#ef4444",
            "on-error": "#ffffff",
            "error-container": "rgba(239, 68, 68, 0.15)",
            "on-error-container": "#fca5a5",
        },
        "borderRadius": {
            "DEFAULT": "0.5rem",
            "lg": "0.75rem",
            "xl": "1rem",
            "2xl": "1.5rem",
            "full": "9999px"
        },
        "spacing": {
            "gutter": "16px",
            "margin-mobile": "20px",
            "margin-desktop": "48px",
            "xs": "6px",
            "sm": "12px",
            "md": "20px",
            "lg": "32px",
            "xl": "48px",
        },
        "fontFamily": {
            "headline-xl": ["Plus Jakarta Sans", "sans-serif"],
            "body-lg": ["Plus Jakarta Sans", "sans-serif"],
            "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
            "label-md": ["Plus Jakarta Sans", "sans-serif"],
            "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
            "label-sm": ["Plus Jakarta Sans", "sans-serif"],
            "headline-md": ["Plus Jakarta Sans", "sans-serif"],
            "body-md": ["Plus Jakarta Sans", "sans-serif"]
        },
        "boxShadow": {
            "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
            "glow": "0 0 20px rgba(0, 240, 255, 0.4)",
            "glow-sm": "0 0 10px rgba(0, 240, 255, 0.2)",
        }
    },
  },
  plugins: [],
}
