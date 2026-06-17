"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";
import ScrollTraveler from "./ScrollTraveler";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FloatingCTA />
      <ScrollTraveler />
    </>
  );
}
