import { Github, Twitter } from "lucide-react";
import Image from "next/image";
import FAQ from "@/components/faq-section";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer-section";
import Header from "@/components/header";
import HeroContent from "@/components/hero-content";
import PricingSection from "@/components/pricing-section";
import { GradientBackground } from "@/components/gradient-background";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      {/* <LogoCloud /> */}
      <Features />
      <PricingSection />
      <FAQ />
    </div>
  );
}
