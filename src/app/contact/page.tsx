import Contact from "@/components/Contact";

export const metadata = {
  title: "Contact",
  description: "Get a free quote for your website. I respond within 24 hours and deliver a first draft within 5 days of kickoff.",
};

export default function ContactPage() {
  return (
    <main className="pt-16">
      <Contact />
    </main>
  );
}
