/** biome-ignore-all lint/style/noMagicNumbers: minor */
"use client";

import { useState } from "react";

const pricing = {
  starter: {
    monthly: 0,
    annually: 0,
  },
  professional: {
    monthly: 15,
    annually: 12, // 20% discount for annual
  },
  enterprise: {
    monthly: 30,
    annually: 24, // 20% discount for annual
  },
};

const starterFeatures = [
  "3 practice sessions per month",
  "Basic feedback on delivery",
  "General interview questions",
  "Community support",
  "Progress tracking",
];

const professionalFeatures = [
  "Unlimited practice sessions",
  "Advanced speech analysis",
  "Company-specific questions",
  "Role-specific question banks",
  "Detailed performance analytics",
  "Filler word detection",
  "Pace & clarity feedback",
  "Priority email support",
];

const enterpriseFeatures = [
  "Everything in Professional",
  "Dedicated account manager",
  "24/7 phone support",
  "Custom onboarding",
  "Advanced security features",
  "SSO integration",
  "Custom contracts",
  "White-label options",
];

function BillingToggle({
  billingPeriod,
  onToggle,
}: {
  billingPeriod: "monthly" | "annually";
  onToggle: (period: "monthly" | "annually") => void;
}) {
  return (
    <div className="relative flex items-center justify-center gap-4 self-stretch px-6 py-4 md:px-16">
      <div className="before:-z-10 relative z-20 flex items-center justify-center rounded-lg border border-[rgba(55,50,47,0.02)] bg-[rgba(55,50,47,0.03)] p-3 backdrop-blur-[44px] backdrop-brightness-110 backdrop-saturate-150 before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-60">
        <div className="relative flex items-center justify-center gap-[2px] rounded-[99px] border-[0.5px] border-[rgba(55,50,47,0.08)] bg-[rgba(55,50,47,0.10)] p-[2px] shadow-[0px_1px_0px_white]">
          <div
            className={`absolute top-[2px] h-[calc(100%-4px)] w-[calc(50%-1px)] rounded-[99px] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${
              billingPeriod === "annually" ? "left-[2px]" : "right-[2px]"
            }`}
          />

          <button
            className="relative z-10 flex flex-1 items-center justify-center gap-2 rounded-[99px] px-4 py-1 transition-colors duration-300"
            onClick={() => onToggle("annually")}
            type="button"
          >
            <div
              className={`font-medium font-sans text-[13px] leading-5 transition-colors duration-300 ${
                billingPeriod === "annually"
                  ? "text-[#37322F]"
                  : "text-[#6B7280]"
              }`}
            >
              Annually
            </div>
          </button>

          <button
            className="relative z-10 flex flex-1 items-center justify-center gap-2 rounded-[99px] px-4 py-1 transition-colors duration-300"
            onClick={() => onToggle("monthly")}
            type="button"
          >
            <div
              className={`font-medium font-sans text-[13px] leading-5 transition-colors duration-300 ${
                billingPeriod === "monthly"
                  ? "text-[#37322F]"
                  : "text-[#6B7280]"
              }`}
            >
              Monthly
            </div>
          </button>
        </div>

        <div className="absolute top-[5.25px] left-[5px] h-[3px] w-[3px] rounded-[99px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
        <div className="absolute top-[5.25px] right-[5px] h-[3px] w-[3px] rounded-[99px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
        <div className="absolute bottom-[5.25px] left-[5px] h-[3px] w-[3px] rounded-[99px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
        <div className="absolute right-[5px] bottom-[5.25px] h-[3px] w-[3px] rounded-[99px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
      </div>
    </div>
  );
}

function AnimatedPrice({
  price,
  billingPeriod,
  // currentPeriod,
}: {
  price: { monthly: number; annually: number };
  billingPeriod: "monthly" | "annually";
  currentPeriod: "monthly" | "annually";
}) {
  return (
    <div className="relative flex h-[60px] items-center font-medium font-serif text-5xl leading-[60px]">
      <span className="invisible">${price[billingPeriod]}</span>
      <span
        aria-hidden={billingPeriod !== "annually"}
        className="absolute inset-0 flex items-center transition-all duration-500"
        style={{
          opacity: billingPeriod === "annually" ? 1 : 0,
          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
        }}
      >
        ${price.annually}
      </span>
      <span
        aria-hidden={billingPeriod !== "monthly"}
        className="absolute inset-0 flex items-center transition-all duration-500"
        style={{
          opacity: billingPeriod === "monthly" ? 1 : 0,
          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
        }}
      >
        ${price.monthly}
      </span>
    </div>
  );
}

function FeatureList({
  features,
  checkColor = "#9CA3AF",
  textColor = "text-[rgba(55,50,47,0.80)]",
}: {
  features: string[];
  checkColor?: string;
  textColor?: string;
}) {
  return (
    <div className="flex flex-col items-start justify-start gap-2 self-stretch">
      {features.map((feature, index) => (
        <div
          className="flex items-center justify-start gap-[13px] self-stretch"
          key={index as number}
        >
          <div className="relative flex h-4 w-4 items-center justify-center">
            <svg
              aria-label="Included feature"
              fill="none"
              height="12"
              viewBox="0 0 12 12"
              width="12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Included feature checkmark</title>
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke={checkColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div
            className={`flex-1 font-normal font-sans text-[12.5px] leading-5 ${textColor}`}
          >
            {feature}
          </div>
        </div>
      ))}
    </div>
  );
}

function DecorativePattern() {
  return (
    <div className="relative hidden w-12 self-stretch overflow-hidden md:block">
      <div className="absolute top-[-120px] left-[-58px] flex w-[162px] flex-col items-start justify-start">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            className="h-4 origin-top-left rotate-[-45deg] self-stretch outline outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
            key={i as number}
          />
        ))}
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "annually"
  );

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-2"
      id="pricing"
    >
      {/* Header Section */}
      <div className="flex items-center justify-center gap-6 self-stretch px-6 md:px-24">
        <div className="flex w-full max-w-[586px] flex-col items-center justify-start gap-4 overflow-hidden rounded-lg px-6 pt-12">
          {/* Pricing Badge */}
          {/* <div className="flex items-center justify-start gap-[8px] overflow-hidden rounded-[90px] border border-[rgba(2,6,23,0.08)] bg-white px-[14px] py-[6px]">
            <div className="relative flex h-[14px] w-[14px] items-center justify-center overflow-hidden">
              <svg
                aria-label="Pricing icon"
                fill="none"
                height="12"
                viewBox="0 0 12 12"
                width="12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Pricing icon</title>
                <path
                  d="M6 1V11M8.5 3H4.75C4.28587 3 3.84075 3.18437 3.51256 3.51256C3.18437 3.84075 3 4.28587 3 4.75C3 5.21413 3.18437 5.65925 3.51256 5.98744C3.84075 6.31563 4.28587 6.5 4.75 6.5H7.25C7.71413 6.5 8.15925 6.68437 8.48744 7.01256C8.81563 7.34075 9 7.78587 9 8.25C9 8.71413 8.81563 9.15925 8.48744 9.48744C8.15925 9.81563 7.71413 10 7.25 10H3.5"
                  stroke="#37322F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="flex flex-col justify-center text-center font-medium font-sans text-[#37322F] text-xs leading-3">
              Plans & Pricing
            </div>
          </div> */}

          {/* Title */}
          <div className="flex flex-col justify-center self-stretch text-center font-sans font-semibold text-2xl text-[#49423D] leading-tight tracking-tight md:text-3xl md:leading-tight lg:text-4xl lg:leading-tight">
            Choose the perfect plan for your interview prep
          </div>

          {/* Description */}
          <div className="self-stretch text-center font-normal font-sans text-[#605A57] text-sm leading-7 md:text-base">
            Affordable pricing designed for students preparing for their dream
            jobs.
            <br />
            Start free, upgrade when you need more practice.
          </div>
        </div>
      </div>

      {/* Billing Toggle Section */}
      <BillingToggle
        billingPeriod={billingPeriod}
        onToggle={setBillingPeriod}
      />

      {/* Pricing Cards Section */}
      <div className="flex items-center justify-center self-stretch border-[rgba(55,50,47,0.12)] border-t border-b">
        <div className="flex w-full items-start justify-center">
          <DecorativePattern />

          {/* Pricing Cards Container */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12 md:flex-row md:items-stretch md:py-0">
            {/* Starter Plan */}
            <div className="flex w-full max-w-[400px] flex-1 flex-col items-start justify-start gap-12 overflow-hidden border bg-[rgba(255,255,255,0)] px-6 py-12 md:max-w-none">
              {/* Plan Header */}
              <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="font-medium font-sans text-[rgba(55,50,47,0.90)] text-lg leading-7 md:text-xl">
                    Free
                  </div>
                  <div className="w-full max-w-[242px] font-normal font-sans text-[rgba(41,37,35,0.70)] text-sm leading-5 md:text-base">
                    Perfect for trying out the platform and getting started.
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-1">
                    <AnimatedPrice
                      billingPeriod={billingPeriod}
                      currentPeriod={billingPeriod}
                      price={pricing.starter}
                    />
                    <div className="font-medium font-sans text-[#847971] text-sm">
                      forever
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-center self-stretch overflow-hidden rounded-[99px] bg-[#37322F] px-4 py-[10px] shadow-[0px_2px_4px_rgba(55,50,47,0.12)]">
                  <div className="absolute top-[-0.5px] left-0 h-[41px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.20)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />
                  <div className="flex max-w-[108px] flex-col justify-center font-medium font-sans text-[#FBFAF9] text-[13px] leading-5">
                    Start for free
                  </div>
                </div>
              </div>

              <FeatureList features={starterFeatures} />
            </div>

            {/* Professional Plan (Featured) */}
            <div className="flex w-full max-w-[400px] flex-1 flex-col items-start justify-start gap-12 overflow-hidden border border-[rgba(55,50,47,0.12)] bg-[#37322F] px-6 py-12 md:max-w-none">
              {/* Plan Header */}
              <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="font-medium font-sans text-[#FBFAF9] text-lg leading-7 md:text-xl">
                    Pro
                  </div>
                  <div className="w-full max-w-[242px] font-normal font-sans text-[#B2AEA9] text-sm leading-5 md:text-base">
                    Unlimited practice with advanced AI feedback for serious
                    prep.
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-1">
                    <div className="text-[#F0EFEE]">
                      <AnimatedPrice
                        billingPeriod={billingPeriod}
                        currentPeriod={billingPeriod}
                        price={pricing.professional}
                      />
                    </div>
                    <div className="font-medium font-sans text-[#D2C6BF] text-sm">
                      per {billingPeriod === "monthly" ? "month" : "year"}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="relative flex items-center justify-center self-stretch overflow-hidden rounded-[99px] bg-[#FBFAF9] px-4 py-[10px] shadow-[0px_2px_4px_rgba(55,50,47,0.12)]">
                  <div className="absolute top-[-0.5px] left-0 h-[41px] w-full bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />
                  <div className="flex max-w-[108px] flex-col justify-center font-medium font-sans text-[#37322F] text-[13px] leading-5">
                    Get started
                  </div>
                </div>
              </div>

              <FeatureList
                checkColor="#FF8000"
                features={professionalFeatures}
                textColor="text-[#F0EFEE]"
              />
            </div>

            {/* Enterprise Plan */}
            <div className="flex w-full max-w-[400px] flex-1 flex-col items-start justify-start gap-12 overflow-hidden border border-[#E0DEDB] bg-white px-6 py-12 md:max-w-none">
              {/* Plan Header */}
              <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="font-medium font-sans text-[rgba(55,50,47,0.90)] text-lg leading-7 md:text-xl">
                    Enterprise
                  </div>
                  <div className="w-full max-w-[242px] font-normal font-sans text-[rgba(41,37,35,0.70)] text-sm leading-5 md:text-base">
                    Complete solution for large organizations and enterprises.
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-1">
                    <AnimatedPrice
                      billingPeriod={billingPeriod}
                      currentPeriod={billingPeriod}
                      price={pricing.enterprise}
                    />
                    <div className="font-medium font-sans text-[#847971] text-sm">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per
                      user.
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-center self-stretch overflow-hidden rounded-[99px] bg-[#37322F] px-4 py-[10px] shadow-[0px_2px_4px_rgba(55,50,47,0.12)]">
                  <div className="absolute top-[-0.5px] left-0 h-[41px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.20)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />
                  <div className="flex max-w-[108px] flex-col justify-center font-medium font-sans text-[#FBFAF9] text-[13px] leading-5">
                    Contact sales
                  </div>
                </div>
              </div>

              <FeatureList features={enterpriseFeatures} />
            </div>
          </div>
        </div>

        {/* Right Decorative Pattern */}
        <div className="relative hidden w-12 self-stretch overflow-hidden md:block">
          <div className="absolute top-[-120px] left-[-58px] flex w-[162px] flex-col items-start justify-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                className="h-4 origin-top-left rotate-[-45deg] self-stretch outline outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                key={i as number}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
