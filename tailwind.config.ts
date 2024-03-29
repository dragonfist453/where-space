import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "medium-champagne": "#F6EEAB",
        "spring-bud": "#C9DD94",
        "eton-blue": "#9DCF94",
        "dark-sea-green": "#7EC796",
        "ocean-green": "#5EBD96",
        "persian-green": "#11A797",
      },
    },
  },
  plugins: [],
};
export default config;
