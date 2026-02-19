// page.tsx
import { Suspense } from "react";
import Header from "../Header";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "../jobs/components/job-card";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";
import { ScrapeInput } from "./components/scrape-input";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header nav={["Dashboard"]} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-6 py-8 space-y-8">
          {/* Hero Scrape Section */}
          <section className="text-center space-y-4 pt-36">
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
              <div className="space-y-4">
                <div className="h-7 w-40 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 w-full bg-muted animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              </div>
            }
          >
            <RecentScrapes />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function RecentScrapes() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (!jobs || jobs.length === 0) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Recent scrapes</h2>
        <p className="text-sm text-muted-foreground">
          No recent scrapes yet. Paste a job URL above to get started.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Recent scrapes</h2>
        <Button variant="ghost">
          <Link href="/jobs">View all</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {jobs.map((job: any) => (
          <JobCard
            key={job.id}
            job={{
              ...job,
              workMode: job.work_mode as any,
              companyName:
                job.company?.name || job.company_name || "Unknown Company",
              companyLogo: job.company?.logo_url || undefined,
              directApplyUrl: job.direct_apply_url,
              employmentType: job.employment_type as any,
              datePosted: job.posted_at,
              jobLocations: job.location as any,
              baseSalary:
                job.salary_min || job.salary_max
                  ? {
                      minValue: job.salary_min,
                      maxValue: job.salary_max,
                      currency: job.salary_currency,
                      unitText: job.salary_period,
                    }
                  : undefined,
              description: job.description,
            }}
          />
        ))}
      </div>
    </section>
  );
}
