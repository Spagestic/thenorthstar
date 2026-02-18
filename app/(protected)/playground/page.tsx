import { Suspense } from "react";
import Header from "../Header";
import { Skeleton } from "@/components/ui/skeleton";

import type { SearchParams } from "nuqs/server";
import { ScrapeInput } from "./components/scrape-input";
import { RecentScrapes } from "./components/recent-scrapes";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header nav={["Dashboard"]} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
          {/* Hero Scrape Section */}
          <section className="text-center space-y-4 pt-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Practice for your next interview
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Paste a job posting URL and start a mock interview in minutes
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Suspense
                fallback={<Skeleton className="h-14 w-full rounded-xl" />}
              >
                <ScrapeInput />
              </Suspense>
            </div>
          </section>

          {/* Recent Scrapes */}
          <Suspense
            fallback={
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-64 shrink-0 rounded-lg" />
                ))}
              </div>
            }
          ></Suspense>
        </div>
      </div>
    </div>
  );
}
