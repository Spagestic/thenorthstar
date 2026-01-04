// app/scrape-jobs-test/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Import the new component
import { ScraperProgress, ScraperStep } from "@/components/scraper-progress";
import { CircleX } from "lucide-react";

// Define the shape of our extracted job data
type Job = {
  title: string;
  location: string;
  salary?: string;
  description: string;
  applyLink?: string;
};

// Initial state for the UI steps
const INITIAL_STEPS: ScraperStep[] = [
  {
    id: "1",
    title: "Scrape Career Page",
    description: "Fetching raw HTML and markdown from the main careers page.",
    status: "pending",
  },
  {
    id: "2",
    title: "Identify Job Links",
    description:
      "Using AI to analyze the page and extract valid job posting URLs.",
    status: "pending",
  },
  {
    id: "3",
    title: "Batch Scrape Details",
    description: "Crawling individual job pages in parallel.",
    status: "pending",
  },
  {
    id: "4",
    title: "Extract Structured Data",
    description: "Converting raw job descriptions into structured JSON.",
    status: "pending",
  },
];

export default function ScrapeJobsTestPage() {
  const [url, setUrl] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replaces the simple 'status' string with a structured array
  const [steps, setSteps] = useState<ScraperStep[]>(INITIAL_STEPS);

  // Helper to update a specific step's status and optional details
  const updateStep = (id: string, updates: Partial<ScraperStep>) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...updates } : step))
    );
  };

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setJobs([]);
    // Reset steps to initial state
    setSteps(INITIAL_STEPS);

    try {
      // --- STEP 1: Scrape Overview ---
      updateStep("1", { status: "in-progress" });

      const scrapeRes = await fetch("/api/firecrawl/scrape", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      if (!scrapeRes.ok) throw new Error("Failed to fetch overview page");
      const { markdown } = await scrapeRes.json();

      updateStep("1", {
        status: "completed",
        details: [`Extracted ${markdown.length} chars of markdown`],
      });

      // --- STEP 2: Extract Links ---
      updateStep("2", { status: "in-progress" });

      const linksRes = await fetch("/api/ai/extract/links", {
        method: "POST",
        body: JSON.stringify({ markdown, baseUrl: url }),
      });

      if (!linksRes.ok) throw new Error("Failed to extract links");
      const { jobLinks } = await linksRes.json();

      if (!jobLinks || jobLinks.length === 0) {
        throw new Error("No job links found.");
      }

      updateStep("2", {
        status: "completed",
        description: `Found ${jobLinks.length} potential job links.`,
        details: jobLinks.slice(0, 3).map((l: string) => `Found: ${l}...`),
      });

      // --- STEP 3: Batch Scrape ---
      updateStep("3", {
        status: "in-progress",
        description: `Crawling ${jobLinks.length} pages...`,
      });

      const batchRes = await fetch("/api/firecrawl/batch-scrape", {
        method: "POST",
        body: JSON.stringify({ urls: jobLinks }),
      });

      if (!batchRes.ok) throw new Error("Batch scrape failed");
      const batchData = await batchRes.json();
      const jobDocs = batchData.data || [];

      updateStep("3", {
        status: "completed",
        details: [`Successfully crawled ${jobDocs.length} pages`],
      });

      // --- STEP 4: Extract Details ---
      updateStep("4", {
        status: "in-progress",
        description: `Processing ${jobDocs.length} documents...`,
      });

      const jobsData = await Promise.all(
        jobDocs.map(async (doc: any) => {
          if (!doc.markdown) return null;
          try {
            const detailRes = await fetch("/api/ai/extract/details", {
              method: "POST",
              body: JSON.stringify({ markdown: doc.markdown }),
            });
            return await detailRes.json();
          } catch (err) {
            console.error("Failed to extract single job:", err);
            return null;
          }
        })
      );

      const validJobs = jobsData.filter((j): j is Job => j !== null);
      setJobs(validJobs);

      updateStep("4", {
        status: "completed",
        description: `Extracted ${validJobs.length} valid jobs.`,
        details: [`Final count: ${validJobs.length} jobs`],
      });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Something went wrong.";
      setError(errorMessage);

      // Mark the currently running step as failed
      setSteps((prev) =>
        prev.map((s) =>
          s.status === "in-progress"
            ? { ...s, status: "failed", details: [errorMessage] }
            : s
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Universal Job Scraper</h1>
        <p className="text-gray-500">
          Paste a careers page URL to extract structured job data.
        </p>
      </div>

      <form onSubmit={handleScrape} className="flex gap-4 mb-8">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="url-input" className="sr-only">
            URL
          </Label>
          <Input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://x.ai/careers/open-roles"
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Scraping..." : "Start Scrape"}
        </Button>
      </form>

      {/* NEW: Replaces the simple status div */}
      {(loading || steps.some((s) => s.status !== "pending")) && (
        <ScraperProgress steps={steps} />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200 flex items-center">
          <CircleX className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-4">
        {jobs.map((job, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {job.title}
                </CardTitle>
                {job.location && (
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {job.location}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-green-700">
                  {job.salary ? `💰 ${job.salary}` : ""}
                </span>

                {job.applyLink && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now ↗
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
