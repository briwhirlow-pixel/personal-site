import type { Metadata } from "next";
import { Instrument_Serif, Outfit, JetBrains_Mono, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";
import PublicLayout from "@/components/PublicLayout";

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// Used exclusively inside the APEX sample-build mockup so the preview
// reads as visually distinct from the BuiltbyBrian wordmark/site.
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
      className={`${instrumentSerif.variable} ${outfit.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${geistMono.variable}`}
    >
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
