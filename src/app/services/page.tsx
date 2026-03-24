import Services from "@/components/Services";
import Process from "@/components/Process";

export const metadata = { title: "Services — Brian Whirlow" };

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <Services />
      <Process />
    </main>
  );
}
