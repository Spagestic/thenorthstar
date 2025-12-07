import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh">
      {/* Main container */}
      <div className="p-4 md:p-0 relative z-10 flex flex-col lg:grid lg:grid-cols-2 min-h-svh">
        {/* Left sidebar - Hidden on mobile/tablet, visible on desktop */}
        <div className="text-secondary-foreground relative hidden h-full flex-col p-8 lg:flex xl:p-12 dark:border-r bg-muted">
          <div className="bg-primary/5 absolute inset-0" />

          {/* Logo section with responsive sizing */}
          <Link
            href="/"
            className="relative z-20 flex items-center text-base lg:text-lg font-bold"
          >
            <div className="flex items-center justify-center rounded-md aspect-square mr-2">
              <Image
                alt="Logo"
                className="size-6 lg:size-7 aspect-square"
                height={64}
                src={"/logo_light.png"}
                width={64}
              />
            </div>
            Ovoxa
          </Link>

          {/* Testimonial with responsive text sizing */}
          <div className="relative z-20 mt-auto">
            <blockquote className="text-sm lg:text-base leading-relaxed text-balance space-y-2">
              <p>
                &ldquo;This platform has transformed how I prepare for
                interviews and helped me land my dream job.&rdquo;
              </p>
              <p>— John Due</p>
            </blockquote>
          </div>
        </div>

        {/* Right side - Sign up form with responsive padding and spacing */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[420px] space-y-6">
            {/* Logo for mobile/tablet - Responsive sizing */}
            <div className="flex justify-center gap-2 mb-8 sm:mb-10 lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-base sm:text-lg"
              >
                <div className="flex items-center justify-center rounded-md aspect-square">
                  <Image
                    alt="Logo"
                    className="size-8 sm:size-9 aspect-square"
                    height={64}
                    src={"/logo_light.png"}
                    width={64}
                  />
                </div>
                <span className="sr-only">Ovoxa</span>
                Ovoxa
              </Link>
            </div>

            {/* Form content */}
            <div className="flex flex-col gap-6">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
