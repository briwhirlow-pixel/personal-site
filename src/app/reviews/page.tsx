import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export const metadata = {
  title: "Reviews",
  description: "See what clients say about working with byBrian — real results, fast delivery, and no surprises.",
};

export default function ReviewsPage() {
  return (
    <main className="pt-16">
      <Testimonials />
      <FAQ />
    </main>
  );
}
