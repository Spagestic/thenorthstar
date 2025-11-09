import FAQ from "@/components/faq-section";
import { Features } from "@/components/features";
import PricingSection from "@/components/pricing-section";
import Hero2 from "@/components/Hero2";
import LogoCloud from "@/components/logo-cloud";

export default function Home() {
  return (
    <div className="">
      <Hero2 />
      <LogoCloud />
      <Features />
      <PricingSection />
      <FAQ />
    </div>
  );
}
