"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScraperProgress } from "./components/scraper-progress";
import { useJobScraper } from "./use-job-scraper";
import { ScrapeForm } from "./components/scrape-form";
import { ScrapeError } from "./components/scrape-error";
import { JobCard } from "./components/job-card";

export function ScraperInterface({ onSuccess }: { onSuccess?: () => void }) {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { jobs, steps, loading, error, startScrape } = useJobScraper();

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    const success = await startScrape(url);

    if (success) {
      router.refresh();
      // Only call onSuccess if we want to close immediately.
      // Maybe we want to wait a bit so they see the result?
      // For now, let's keep it as is.
      onSuccess?.();
    }
  }

  return (
    <div className="space-y-4">
      <ScrapeForm
        url={url}
        setUrl={setUrl}
        onScrape={handleScrape}
        loading={loading}
      />

      {(loading || steps.some((s) => s.status !== "pending")) && (
        <ScraperProgress steps={steps} />
      )}

      <ScrapeError error={error} />

      {jobs.length > 0 && (
        <div className="space-y-0">
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
        </div>
      )}
    </div>
  );
}
