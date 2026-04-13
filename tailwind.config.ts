import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hive: {
          orange: "#F5A623",
          amber: "#E89611",
          dark: "#3D3D3D",
          grey: "#6B6B6B",
          cream: "#FFF8EC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(245, 166, 35, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
