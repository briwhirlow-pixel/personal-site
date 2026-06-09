import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import SocialProof from "@/components/SocialProof";

export const metadata: Metadata = {
  title: "BuiltbyBrian — Web Designer & Developer",
  description: "Hand-built websites for restaurants, shops, and studios in Philadelphia and South Jersey. First draft in 5 days.",
  openGraph: {
    title: "BuiltbyBrian — Web Designer & Developer",
    description: "Hand-built websites for restaurants, shops, and studios. First draft in 5 days.",
    url: "https://builtbybwhirl.com",
    siteName: "BuiltbyBrian",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuiltbyBrian — Web Designer & Developer",
    description: "Hand-built websites for restaurants, shops, and studios. First draft in 5 days.",
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
