"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScraperProgress } from "./components/scraper-progress";
import { useJobScraper } from "./use-job-scraper";
import { ScrapeForm } from "./components/scrape-form";
import { ScrapeError } from "./components/scrape-error";

export function ScraperInterface({ onSuccess }: { onSuccess?: () => void }) {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { steps, loading, error, startScrape } = useJobScraper();

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    const success = await startScrape(url);

    if (success) {
      router.refresh();
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
    </div>
  );
}
