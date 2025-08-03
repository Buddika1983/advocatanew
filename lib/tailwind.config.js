// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";
import { Inter, Playfair_Display, Manrope } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-family-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-family-playfair' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-family-manrope' });

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-family-inter)', ...defaultTheme.fontFamily.sans],
        playfair: ['var(--font-family-playfair)', ...defaultTheme.fontFamily.serif],
        manrope: ['var(--font-family-manrope)', ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              textDecoration: "none",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
