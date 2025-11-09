import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./auth-button";

export default function Hero() {
  const rgbDataURL = (r: number, g: number, b: number): string =>
    `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="rgb(3, 6, 12)"/></svg>`
    )}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-1.png"
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

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full sm:p-8 pt-6 pr-6 pb-6 pl-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl lg:text-7xl text-white font-geist tracking-tighter drop-shadow-lg">
                Master your Interview Skills
              </h2>
              <p className="sm:text-lg leading-relaxed text-lg font-normal text-white/90 font-geist mt-3 drop-shadow-sm">
                NorthStar simulates realistic voice interviews and delivers
                personalized, actionable feedback on content and delivery so you
                can get interview-ready faster.
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white tracking-tight bg-white/8 backdrop-blur-sm rounded-full pt-2 pr-4 pb-2 pl-4 border border-white/15 shadow-sm transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-lucide="arrow-right"
                    className="lucide lucide-arrow-right w-4 h-4 stroke-1.5"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                  <span className="font-geist">Get Started</span>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/6 backdrop-blur-sm border border-white/10 p-3 shadow-sm hover:bg-white/10 transition-all duration-300">
                <div className="text-xl font-semibold tracking-tight text-white font-geist drop-shadow-sm">
                  5,000+
                </div>
                <p className="text-[11px] text-white/80 mt-0.5 font-geist">
                  Practice Sessions
                </p>
              </div>
              <div className="rounded-xl bg-white/6 backdrop-blur-sm border border-white/10 p-3 shadow-sm hover:bg-white/10 transition-all duration-300">
                <div className="text-xl font-semibold tracking-tight text-white font-geist drop-shadow-sm">
                  85%
                </div>
                <p className="text-[11px] text-white/80 mt-0.5 font-geist">
                  Score Improvement
                </p>
              </div>
              <div className="rounded-xl bg-white/6 backdrop-blur-sm border border-white/10 p-3 shadow-sm hover:bg-white/10 transition-all duration-300">
                <div className="text-xl font-semibold tracking-tight text-white font-geist drop-shadow-sm">
                  50+
                </div>
                <p className="text-[11px] text-white/80 mt-0.5 font-geist">
                  Industries Covered
                </p>
              </div>
              <div className="rounded-xl bg-white/6 backdrop-blur-sm border border-white/10 p-3 shadow-sm hover:bg-white/10 transition-all duration-300">
                <div className="text-xl font-semibold tracking-tight text-white font-geist drop-shadow-sm">
                  4.8/5
                </div>
                <p className="text-[11px] text-white/80 mt-0.5 font-geist">
                  User Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
