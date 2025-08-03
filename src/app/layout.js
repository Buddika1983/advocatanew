import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Manrope } from "next/font/google";
import Script from "next/script"; // Correctly import next/script
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-family-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-family-manrope",
  display: "swap",
});

export const metadata = {
  title: "My Faust App",
  description: "Headless WordPress + Faust + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${manrope.variable}`}
    >
      <body className="bg-gray-950 text-white">
        {/* Load external script properly */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/min/tiny-slider.js"
          strategy="beforeInteractive"
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
