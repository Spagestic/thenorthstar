// app/scrape-jobs-test/page.tsx
"use client";

import { useState } from "react";
import { ScraperProgress } from "@/app/scrape/components/scraper-progress";
import { useJobScraper } from "./use-job-scraper";
import { ScraperHeader } from "./components/scraper-header";
import { ScrapeForm } from "./components/scrape-form";
import { ScrapeError } from "./components/scrape-error";
import { JobList } from "./components/job-list";

export default function ScrapeJobsTestPage() {
  const [url, setUrl] = useState("");
  const { jobs, steps, loading, error, startScrape } = useJobScraper();

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    await startScrape(url);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
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

      <JobList jobs={jobs} />
    </div>
  );
}
