import { Github, Twitter } from "lucide-react";
import Image from "next/image";
import FAQ from "@/components/faq-section";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer-section";
import Header from "@/components/header";
import HeroContent from "@/components/hero-content";
import PricingSection from "@/components/pricing-section";
import { GradientBackground } from "@/components/gradient-background";

export default function Home() {
  return (
    <div>
      <GradientBackground>
        <div>
          <Header />
          <HeroContent />
        </div>
      </GradientBackground>
      {/* <LogoCloud /> */}
      <Features />
      <PricingSection />
      <FAQ />
      <Footer
        brandName="NorthStar"
        copyright={{
          text: "© 2025 NorthStar",
          license: "All rights reserved",
        }}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        logo={
          <Image
            alt="Logo"
            className="h-10 w-10"
            height={40}
            src={"/logo_light.svg"}
            width={40}
          />
        }
        mainLinks={[
          { href: "/products", label: "Products" },
          { href: "/about", label: "About" },
          { href: "/blog", label: "Blog" },
          { href: "/contact", label: "Contact" },
        ]}
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com",
            label: "GitHub",
          },
        ]}
      />
    </div>
  );
}
