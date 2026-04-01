import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8f2",
          100: "#d7eddf",
          200: "#b0dac0",
          300: "#83c39c",
          400: "#57ab79",
          500: "#378f5d",
          600: "#286f49",
          700: "#1f583b",
          800: "#1b4631",
          900: "#163a29"
        },
        ink: "#101a15",
        mist: "#f3f5f2",
        sand: "#ebe4d8",
        danger: "#ce4f4f"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(16, 26, 21, 0.08)"
      },
      borderRadius: {
        xl2: "1.5rem"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(16,26,21,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,26,21,0.04) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;

