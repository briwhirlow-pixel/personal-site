import Portfolio from "@/components/Portfolio";

export const metadata = {
  title: "Work",
  description: "Examples of websites built by byBrian — landing pages, e-commerce stores, portfolios, and more.",
};

export default function WorkPage() {
  return (
    <main className="pt-16">
      <Portfolio />
    </main>
  );
}
