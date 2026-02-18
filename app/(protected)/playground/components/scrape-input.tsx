// scrape-input.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Link, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { JobPosting } from "@/app/api/ai/extract/details/schema";

type ScrapeAndSaveResponse = {
  success: boolean;
  job?: JobPosting;
  error?: string;
};

export function ScrapeInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedJob, setExtractedJob] = useState<JobPosting | null>(null);

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    // Basic URL validation
    try {
      new URL(trimmed);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setExtractedJob(null);

    try {
      const scrapeRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmed,
          maxAge: 600000, // 10 min cache for job postings
        }),
      });

      if (!scrapeRes.ok) {
        const err = await scrapeRes.json();
        throw new Error(err.error || "Failed to scrape and save job");
      }

      const scrapeData: ScrapeAndSaveResponse = await scrapeRes.json();

      if (!scrapeData.success) {
        throw new Error(scrapeData.error || "Scrape returned failure");
      }

      const job = scrapeData.job ?? null;

      if (!job || !job.title) {
        toast.error(
          "Could not extract job details from this page. Is this a job posting?",
        );
        return;
      }

      setExtractedJob({
        ...job,
        url: job.url || trimmed,
      });

      toast.success(
        `Extracted & saved "${job.title}" at ${job.companyName || "Unknown Company"}`,
      );
      setUrl("");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleScrape} className="relative">
        <div className="flex items-center gap-0 border-2 border-border rounded-xl bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="pl-4 text-muted-foreground">
            <Link className="h-5 w-5" />
          </div>
          <Input
            type="url"
            placeholder="https://company.com/careers/software-engineer"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-base h-14 bg-transparent"
            disabled={loading}
          />
          <div className="pr-2">
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              size="lg"
              className="rounded-lg h-10 px-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Scrape
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground text-center mt-3 animate-pulse">
            Scraping and extracting job details…
          </p>
        )}
      </form>
    </div>
  );
}
