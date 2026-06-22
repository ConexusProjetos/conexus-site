import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ─── Conexus Brand Colors (extracted from repo B) ─────────────────
      colors: {
        conexus: {
          cyan: "#00A5B7",
          "cyan-light": "#00C4D9",
          "cyan-dark": "#007E8C",
          "cyan-muted": "rgba(0, 165, 183, 0.15)",
          dark: "#0A0F1E",
          "dark-2": "#0F1629",
          "dark-3": "#111827",
          "dark-card": "#161D30",
          "dark-border": "rgba(255,255,255,0.08)",
          "text-muted": "#8892A4",
          "text-secondary": "#B0BAC9",
        },
      },

      // ─── Typography (from repo B: Outfit + Inter) ─────────────────────
      fontFamily: {
        outfit: ["var(--font-outfit)", "Outfit", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },

      // ─── Spacing & Sizing ─────────────────────────────────────────────
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      // ─── Animations (circuit glow from repo B) ────────────────────────
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-cyan": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 165, 183, 0)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(0, 165, 183, 0.3)" },
        },
        "circuit-flow": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-left": "fade-in-left 0.5s ease-out forwards",
        "pulse-cyan": "pulse-cyan 2s ease-in-out infinite",
        "circuit-flow": "circuit-flow 3s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },

      // ─── Background patterns ──────────────────────────────────────────
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "conexus-hero":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,165,183,0.15), transparent)",
        "card-glow":
          "radial-gradient(circle at top right, rgba(0,165,183,0.08), transparent 60%)",
      },

      // ─── Border radius ────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },

      // ─── Box shadows ──────────────────────────────────────────────────
      boxShadow: {
        "cyan-sm": "0 0 10px rgba(0, 165, 183, 0.2)",
        "cyan-md": "0 0 20px rgba(0, 165, 183, 0.3)",
        "cyan-lg": "0 0 40px rgba(0, 165, 183, 0.4)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
