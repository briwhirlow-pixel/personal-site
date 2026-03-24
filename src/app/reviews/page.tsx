import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export const metadata = { title: "Reviews — Brian Whirlow" };

export default function ReviewsPage() {
  return (
    <main className="pt-16">
      <Testimonials />
      <FAQ />
    </main>
  );
}
