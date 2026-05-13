import type { Metadata } from "next";
import {
  Inter,
  Instrument_Serif,
  Outfit,
  Bricolage_Grotesque,
  EB_Garamond,
  Archivo_Black,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";
import PublicLayout from "@/components/PublicLayout";

// Default body font (still used by existing pages — Hero/Services/etc — until
// a direction is picked in /design-lab and we trim).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Direction 01 — Indie Studio
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

// Direction 02 — Swiss Modernist
const archivoBlack = Archivo_Black({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
});

// Direction 03 — Friendly Maximalist
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

// Direction 04 — Editorial Noir
const ebGaramond = EB_Garamond({
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

// Mono — used across editorial labels in every direction
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbybwhirl.com"),
  title: {
    default: `Brian Whirlow (bwhirl) — Web Designer & Developer`,
    template: `%s | BuiltByBrian`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `Brian Whirlow (bwhirl) — Web Designer & Developer`,
    description: siteConfig.description,
    url: "https://builtbybwhirl.com",
    siteName: "BuiltByBrian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Brian Whirlow (bwhirl) — Web Designer & Developer`,
    description: siteConfig.description,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${outfit.variable} ${bricolage.variable} ${ebGaramond.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
