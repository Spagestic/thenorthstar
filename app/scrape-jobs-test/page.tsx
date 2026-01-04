// app/scrape-jobs-test/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define the shape of our extracted job data
type Job = {
  title: string;
  location: string;
  salary?: string;
  description: string;
  applyLink?: string;
};

export default function ScrapeJobsTestPage() {
  const [url, setUrl] = useState("");
  // We store the structured jobs here, not raw markdown
  const [jobs, setJobs] = useState<Job[]>([]);
  // 'status' helps the user know what's happening during the multi-step process
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault(); // CRITICAL: Prevents page reload on form submit

    setLoading(true);
    setError("");
    setJobs([]);
    setStatus("Starting scrape...");

    try {
      // 1. Scrape Overview
      setStatus("Step 1/4: Scraping main career page...");
      const scrapeRes = await fetch("/api/firecrawl/scrape", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      if (!scrapeRes.ok) throw new Error("Failed to fetch overview page");
      const { markdown } = await scrapeRes.json();

      // 2. Extract Links with Mistral
      setStatus("Step 2/4: AI is identifying job links...");
      const linksRes = await fetch("/api/ai/extract/links", {
        method: "POST",
        body: JSON.stringify({ markdown, baseUrl: url }),
      });

      if (!linksRes.ok) throw new Error("Failed to extract links");
      const { jobLinks } = await linksRes.json();

      if (!jobLinks || jobLinks.length === 0) {
        throw new Error(
          "No job links found. The page might be empty or require different selectors."
        );
      }

      setStatus(
        `Step 3/4: Found ${jobLinks.length} links. Batch scraping details...`
      );

      // 3. Batch Scrape Details
      const batchRes = await fetch("/api/firecrawl/batch-scrape", {
        method: "POST",
        body: JSON.stringify({ urls: jobLinks }),
      });

      if (!batchRes.ok) throw new Error("Batch scrape failed");
      const batchData = await batchRes.json();
      const jobDocs = batchData.data || []; // Firecrawl usually returns { success: true, data: [...] }

      // 4. Extract Details (in parallel)
      setStatus(
        `Step 4/4: Extracting structured data from ${jobDocs.length} pages...`
      );

      const jobsData = await Promise.all(
        jobDocs.map(async (doc: any) => {
          if (!doc.markdown) return null; // Skip if a specific page failed
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

      // Filter out any failed extractions (nulls)
      const validJobs = jobsData.filter((j): j is Job => j !== null);

      setJobs(validJobs);
      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during the scrape.");
      setStatus("");
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Progress Status */}
      {status && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-6 text-sm font-medium flex items-center">
          {loading && <span className="animate-spin mr-2">⏳</span>}
          {status}
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

      {!loading && jobs.length === 0 && !error && !status && (
        <div className="text-center text-gray-400 py-12 border-2 border-dashed rounded-lg">
          No jobs found yet. Enter a URL above to begin.
        </div>
      )}
    </div>
  );
}
