import { Suspense } from "react";
import { ScraperInterface } from "./scraper-interface";
import Header from "../Header";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "./components/job-card";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Header nav={["Manage Jobs"]} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto py-10 px-6 space-y-2">
          <section className="bg-card p-8 rounded-xl border shadow-sm mb-8">
            <ScraperInterface />
          </section>

          <section>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-75 w-full bg-muted animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              }
            >
              <JobList />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}

export async function JobList() {
  const supabase = await createClient();

  // This blocking fetch now happens inside the Suspense boundary
  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*, company:companies(name, website, logo_url)")
    .limit(10);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs?.map((job: any) => (
        <JobCard
          key={job.id}
          job={{
            ...job,
            workMode: job.work_mode as any,
            companyName: job.company?.name || "Unknown Company",
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
  );
}
