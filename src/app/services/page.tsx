import Services from "@/components/Services";

export const metadata = {
  title: "Services",
  description: "Web design and development packages starting at $500. Simple, transparent pricing with no hidden fees. 50% deposit, 50% on delivery.",
};

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <Services />
    </main>
  );
}
