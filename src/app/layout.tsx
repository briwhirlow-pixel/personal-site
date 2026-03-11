import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Web Designer & Developer`,
  description: siteConfig.description,
  // TODO: uncomment and set your domain before launch
  // metadataBase: new URL("https://brianwhirlow.com"),
  openGraph: {
    title: `${siteConfig.name} — Web Designer & Developer`,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
