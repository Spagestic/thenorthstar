import FAQ from "@/components/faq-section";
import { Features } from "@/components/features";
import Header from "@/components/header";
import PricingSection from "@/components/pricing-section";
import HeroSection from "@/components/hero-section";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <PricingSection />
      <FAQ />
    </div>
  );
}
