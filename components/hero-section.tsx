import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-36">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Hero Content */}
          <div className="max-w-[937px] flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-6">
              <h1 className="max-w-[748px] text-center text-secondary-foreground text-5xl md:text-[80px] font-normal leading-tight md:leading-[96px] font-serif">
                Master your Interview Skills
              </h1>
              <p className="max-w-[506px] text-center text-secondary-foreground/80 text-lg font-medium leading-7">
                NorthStar simulates realistic voice interviews and delivers
                personalized, actionable feedback on content and delivery so you
                can get interview-ready faster.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              className="h-10 px-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium text-sm"
              asChild
            >
              <Link href={"/dashboard"}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
