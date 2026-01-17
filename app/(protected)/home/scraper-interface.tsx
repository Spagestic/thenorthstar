"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScraperProgress } from "./components/scraper-progress";
import { useJobScraper } from "./use-job-scraper";
import { ScraperHeader } from "./components/scraper-header";
import { ScrapeForm } from "./components/scrape-form";
import { ScrapeError } from "./components/scrape-error";
import { JobList as SessionJobList } from "./components/job-list";

export function ScraperInterface() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { jobs, steps, loading, error, startScrape } = useJobScraper();

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    const success = await startScrape(url);

    if (success) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-0">
      <ScraperHeader />

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
          <SessionJobList jobs={jobs} />
        </div>
      )}
    </div>
  );
}
