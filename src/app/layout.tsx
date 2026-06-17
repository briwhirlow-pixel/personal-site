import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";
import PublicLayout from "@/components/PublicLayout";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbybwhirl.com"),
  title: {
    default: "BuiltbyBrian — Web Designer & Developer | Philly + South Jersey",
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
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
