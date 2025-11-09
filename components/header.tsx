import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./auth-button";

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            alt="Logo"
            className="h-8 w-8"
            height={40}
            src={"/logo_light.png"}
            width={40}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-2">
        <Link
          className="rounded-full px-3 py-2 font-light text-secondary-foreground text-xs transition-all duration-200 hover:bg-secondary"
          href="#features"
        >
          Features
        </Link>
        <Link
          className="rounded-full px-3 py-2 font-light text-secondary-foreground text-xs transition-all duration-200 hover:bg-secondary"
          href="#pricing"
        >
          Pricing
        </Link>
        <Link
          className="rounded-full px-3 py-2 font-light text-secondary-foreground text-xs transition-all duration-200 hover:bg-secondary"
          href="#faqs"
        >
          FAQs
        </Link>
      </nav>

      <AuthButton />
    </header>
  );
}
