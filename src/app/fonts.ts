import {
  Fraunces,
  Inter,
  Noto_Serif_Bengali,
  Hind_Siliguri,
} from "next/font/google";

// Display serif (EN) → --font-display
export const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body sans (EN) → --font-body
export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Display serif (BN) → --font-bn-display
export const bnDisplay = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-bn-display",
  display: "swap",
});

// Body sans (BN) → --font-bn-body
export const bnBody = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bn-body",
  display: "swap",
});

// Convenience: every font variable to spread onto <html>
export const fontVariables = [
  display.variable,
  body.variable,
  bnDisplay.variable,
  bnBody.variable,
].join(" ");
