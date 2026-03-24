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
  title: `${siteConfig.name} — Web Designer & Developer`,
  description: siteConfig.description,
  // metadataBase: new URL("https://brianwhirlow.com"),
  openGraph: {
    title: `${siteConfig.name} — Web Designer & Developer`,
    description: siteConfig.description,
    type: "website",
  },
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
