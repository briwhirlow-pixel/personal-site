import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";
import PublicLayout from "@/components/PublicLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbybwhirl.com"),
  title: {
    default: `Brian Whirlow (bwhirl) — Web Designer & Developer`,
    template: `%s | byBrian`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `Brian Whirlow (bwhirl) — Web Designer & Developer`,
    description: siteConfig.description,
    url: "https://builtbybwhirl.com",
    siteName: "byBrian",
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
    <html lang="en">
      <body className={inter.className}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
