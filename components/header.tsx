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
            className="h-10 w-10"
            height={40}
            src={"/logo_dark.svg"}
            width={40}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2">
        <Link
          className="rounded-full px-3 py-2 font-light text-white/80 text-xs transition-all duration-200 hover:bg-white/10 hover:text-white"
          href="#features"
        >
          Features
        </Link>
        <Link
          className="rounded-full px-3 py-2 font-light text-white/80 text-xs transition-all duration-200 hover:bg-white/10 hover:text-white"
          href="#pricing"
        >
          Pricing
        </Link>
        <Link
          className="rounded-full px-3 py-2 font-light text-white/80 text-xs transition-all duration-200 hover:bg-white/10 hover:text-white"
          href="#faqs"
        >
          FAQs
        </Link>
      </nav>

      <AuthButton />
    </header>
  );
}
