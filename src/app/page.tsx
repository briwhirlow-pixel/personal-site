import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ValueProp from "@/components/ValueProp";
import Capabilities from "@/components/Capabilities";
import FeaturedProject from "@/components/FeaturedProject";
import Portfolio from "@/components/Portfolio";
import TestimonialPull from "@/components/TestimonialPull";
import PhoneShowcase from "@/components/PhoneShowcase";
import Platforms from "@/components/Platforms";
import FinalCTA from "@/components/FinalCTA";

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
      <ValueProp />
      <Capabilities />
      <FeaturedProject />
      <Portfolio />
      <TestimonialPull />
      <PhoneShowcase />
      <Platforms />
      <FinalCTA />
    </main>
  );
}
