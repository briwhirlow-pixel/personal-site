import type { Metadata } from "next";
import { Newsreader, Inter_Tight, JetBrains_Mono, Fraunces, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";
import PublicLayout from "@/components/PublicLayout";

// Display serif — Newsreader. Replaces Instrument Serif (which had become
// the default "AI portfolio template" face). Newsreader has more editorial
// personality without reading as precious.
const newsreader = Newsreader({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

// Body sans — Inter Tight. Replaces Outfit. Inter Tight at 500/600 reads as
// Stripe Press / Financial Times — confident editorial, not template default.
const interTight = Inter_Tight({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// APEX-only fonts — keep the mockup visually separate from BuiltbyBrian.
const fraunces = Fraunces({
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const geistMono = Geist_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

// Handwritten signature — used for the Footer "— Brian" sign-off and any
// real human touches that should not look typeset.
const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbybwhirl.com"),
  title: {
    default: "BuiltbyBrian — Web Designer & Developer",
    template: "%s · BuiltbyBrian",
  },
  description: siteConfig.description,
  openGraph: {
    title: "BuiltbyBrian — Web Designer & Developer",
    description: siteConfig.description,
    url: "https://builtbybwhirl.com",
    siteName: "BuiltbyBrian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuiltbyBrian — Web Designer & Developer",
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
      className={`${newsreader.variable} ${interTight.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
