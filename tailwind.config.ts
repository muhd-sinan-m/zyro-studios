import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#05080f",
        navy: "#080d1a",
        surface: "#0b1120",
        "surface-2": "#0f1628",
        blue: {
          DEFAULT: "#1e90ff",
          bright: "#3da8ff",
          dim: "rgba(30, 144, 255, 0.6)",
          glow: "rgba(30, 144, 255, 0.15)",
        },
        silver: {
          DEFAULT: "#c0c8d8",
          dim: "#8892a4",
        },
        zyro: {
          white: "#e8eeff",
          muted: "#6b7896",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Grotesk", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "1.05" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.1" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.15" }],
        "display-sm": ["clamp(1.375rem, 2.5vw, 2rem)", { lineHeight: "1.2" }],
      },
      spacing: {
        "section": "clamp(4rem, 8vw, 8rem)",
        "container": "clamp(1.25rem, 4vw, 2.5rem)",
      },
      maxWidth: {
        "container": "1280px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-zyro":
          "linear-gradient(135deg, #05080f 0%, #080d1a 50%, #0b1120 100%)",
        "gradient-blue-glow":
          "radial-gradient(ellipse at center, rgba(30, 144, 255, 0.15) 0%, transparent 70%)",
        "gradient-metallic":
          "linear-gradient(135deg, #c0c8d8 0%, #8892a4 50%, #c0c8d8 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(30, 144, 255, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(30, 144, 255, 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
