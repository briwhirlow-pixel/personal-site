import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import SocialProof from "@/components/SocialProof";

export const metadata: Metadata = {
  title: "byBrian — Web Designer & Developer",
  description: "I design and build fast, beautiful websites that help businesses grow. From simple brochure sites to full e-commerce stores — delivered in 5 days.",
  openGraph: {
    title: "byBrian — Web Designer & Developer",
    description: "Fast, beautiful websites that convert visitors into customers. First draft in 5 days.",
    url: "https://builtbybwhirl.com",
    siteName: "byBrian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "byBrian — Web Designer & Developer",
    description: "Fast, beautiful websites that convert visitors into customers. First draft in 5 days.",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoMarquee />
      <SocialProof />
    </main>
  );
}
