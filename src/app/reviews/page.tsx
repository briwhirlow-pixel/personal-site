import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ReviewCTA from "@/components/ReviewCTA";

export const metadata = {
  title: "Reviews",
  description: "What clients have said after working with BuiltbyBrian on their websites.",
};

export default function ReviewsPage() {
  return (
    <main className="pt-16">
      <Testimonials />
      <ReviewCTA />
      <FAQ />
    </main>
  );
}
