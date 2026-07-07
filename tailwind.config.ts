import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0F1216",
          900: "#14171C",
          800: "#1C2129",
          700: "#262C36",
        },
        line: "#2E3540",
        ink: {
          primary: "#E8EAED",
          muted: "#8B92A0",
          dim: "#5C6472",
        },
        phosphor: "#7FDBAE",
        amber: "#D4A24C",
        signal: "#C1666B",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        pulse_dot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "pulse-dot": "pulse_dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
