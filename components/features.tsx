import { Settings2, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function Features() {
  return (
    <section className="py-16 md:py-32" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-balance font-semibold text-2xl md:text-3xl lg:text-4xl">
            Practice smarter, not harder
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base">
            AI-powered feedback that helps you improve faster and land your
            dream job.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 md:max-w-full md:grid-cols-3">
          <Card className="group border-0 bg-muted py-8 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles aria-hidden className="size-6" />
              </CardDecorator>

              <h3 className="mt-6 font-medium text-lg md:text-xl">
                AI-Powered Feedback
              </h3>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-sm md:text-base">
                Get instant, detailed feedback on your speech delivery including
                filler words, pace, pauses, and clarity to sound more confident.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-muted py-8 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2 aria-hidden className="size-6" />
              </CardDecorator>

              <h3 className="mt-6 font-medium text-lg md:text-xl">
                Company-Specific Practice
              </h3>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-sm md:text-base">
                Practice with curated question banks tailored to specific
                companies and roles, so you&apos;re prepared for exactly what
                you&apos;ll face.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-muted py-8 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap aria-hidden className="size-6" />
              </CardDecorator>

              <h3 className="mt-6 font-medium text-lg md:text-xl">
                Voice-Based Simulation
              </h3>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-sm md:text-base">
                Realistic voice-based interview simulations that analyze both
                your content and delivery to help you improve faster.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 [--border:black] dark:[--border:white]" />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-background">
      {children}
    </div>
  </div>
);
