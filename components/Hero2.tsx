import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./auth-button";
import { FlowButton } from "./ui/flow-button";
import { rgbDataURL } from "@/lib/utils";

export default function Hero2() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-2.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
          placeholder="blur"
          blurDataURL={rgbDataURL(25, 25, 112)}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                alt="Logo"
                className="h-8 w-8"
                height={40}
                src={"/logo_dark.png"}
                width={40}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-2">
            <Link
              className="rounded-full px-3 py-2 font-light text-primary-foreground text-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="rounded-full px-3 py-2 font-light text-primary-foreground text-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="rounded-full px-3 py-2 font-light text-primary-foreground text-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              href="#faqs"
            >
              FAQs
            </Link>
          </nav>

          <AuthButton />
        </header>
        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-white font-bold mb-6 leading-tight max-w-6xl text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
            Master your
            <br />
            Interview Skills
          </h1>

          <p className="text-secondary text-base md:text-lg lg:text-xl max-w-3xl mb-8 opacity-90">
            NorthStar simulates realistic voice interviews and delivers
            personalized, actionable feedback on content and delivery so you can
            get interview-ready faster.
          </p>

          <Link href="/dashboard">
            <FlowButton text="Get Started" />
          </Link>
        </div>

        {/* Bottom Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 pb-12 text-white">
          <div className="text-center">
            <h3 className="font-semibold text-sm md:text-md">
              Voice-Based Interviews
            </h3>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm md:text-md">
              Personalized Feedback
            </h3>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm md:text-md">Job Matching</h3>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm md:text-md">
              Progress Tracking
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
