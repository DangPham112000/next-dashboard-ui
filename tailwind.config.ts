import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        stSky: "#C3EBFA",
        stSkyLight: "#EDF9FD",
        stPurple: "#CFCEFF",
        stPurpleLight: "#F1F0FF",
        stYellow: "#FAE27C",
        stYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
export default config;
