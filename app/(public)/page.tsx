import FAQ from "@/components/faq-section";
import { Features } from "@/components/features";
import PricingSection from "@/components/pricing-section";
import Hero2 from "@/components/Hero2";

export default function Home() {
  return (
    <div>
      <Hero2 />
      <Features />
      <PricingSection />
      <FAQ />
    </div>
  );
}
