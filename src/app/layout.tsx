import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";
import PublicLayout from "@/components/PublicLayout";
import SmoothScroll from "@/components/SmoothScroll";

const newsreader = Newsreader({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const jakarta = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
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
    <html lang="en" className={`${newsreader.variable} ${jakarta.variable}`}>
      <body>
        <SmoothScroll />
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
