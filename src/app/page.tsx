import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";

export const metadata: Metadata = {
  title: "byBrian — Web Designer & Developer",
  description: "I design and build fast, beautiful websites that help businesses grow. From simple brochure sites to full e-commerce stores — delivered in 72 hours.",
  openGraph: {
    title: "byBrian — Web Designer & Developer",
    description: "Fast, beautiful websites that convert visitors into customers. First draft in 72 hours.",
    url: "https://builtbybwhirl.com",
    siteName: "byBrian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "byBrian — Web Designer & Developer",
    description: "Fast, beautiful websites that convert visitors into customers. First draft in 72 hours.",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoMarquee />
    </main>
  );
}
