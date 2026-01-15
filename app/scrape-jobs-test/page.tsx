// app/scrape-jobs-test/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScraperProgress, ScraperStep } from "@/components/scraper-progress";
import { CircleX, DollarSign, MapPin } from "lucide-react";
import { UrlInput } from "./url-input";
import { JobPosting } from "../api/ai/extract/details/schema";
import { saveJobsToSupabase } from "../actions/save-jobs";

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
  {
    id: "5",
    title: "Save to Database",
    description: "Upserting extracted jobs into Supabase.",
    status: "pending",
  },
];

export default function ScrapeJobsTestPage() {
  const [url, setUrl] = useState("");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
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

  // Normalize the input so the backend always receives a valid full URL
  function normalizeUrl(input: string): string {
    if (!input) return "";
    // If input starts with protocol, return as is
    if (/^https?:\/\//i.test(input)) return input;
    // If input looks like a domain, prepend protocol
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(input)) return `https://${input}`;
    // Otherwise, treat as path (not recommended, but fallback)
    return `https://${input}`;
  }

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setJobs([]);
    setSteps(INITIAL_STEPS);

    const normalizedUrl = normalizeUrl(url);

    try {
      updateStep("1", { status: "in-progress" });

      const scrapeRes = await fetch("/api/firecrawl/scrape", {
        method: "POST",
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!scrapeRes.ok) throw new Error("Failed to fetch overview page");

      const { markdown, branding, metadata } = await scrapeRes.json();
      const companyLogo = branding?.logo || metadata?.ogImage;

      updateStep("1", {
        status: "completed",
        details: [
          metadata?.title ? `Page Title: ${metadata.title}` : null,
          metadata?.description
            ? `Description: ${metadata.description.substring(0, 80)}...`
            : null,
          `Extracted ${markdown.length.toLocaleString()} chars`,
          companyLogo ? `IMG:${companyLogo}` : "No logo found",
        ].filter(Boolean) as string[],
      });

      updateStep("2", { status: "in-progress" });

      const linksRes = await fetch("/api/ai/extract/links", {
        method: "POST",
        body: JSON.stringify({ markdown, baseUrl: normalizedUrl }),
      });

      if (!linksRes.ok) throw new Error("Failed to extract links");
      const { jobLinks } = await linksRes.json();

      if (!jobLinks || jobLinks.length === 0) {
        throw new Error("No job links found.");
      }

      updateStep("2", {
        status: "completed",
        description: `Found ${jobLinks.length} job links.`,
        details: jobLinks.slice(0, 5).map((l: string) => {
          try {
            const urlObj = new URL(l);
            const segments = urlObj.pathname.split("/").filter(Boolean);
            const lastTwo = segments.slice(-2).join("/");
            return `${urlObj.hostname}/${lastTwo}`;
          } catch {
            return l;
          }
        }),
      });

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
        details: [
          `Crawled ${jobDocs.length} URLs`,
          ...jobDocs
            .slice(0, 3)
            .map((doc: any) => `✓ ${doc.url?.split("/").pop() || "Job page"}`),
        ],
      });

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
              body: JSON.stringify({
                markdown: doc.markdown,
                url: doc.url || doc.metadata?.sourceURL, // pass original URL
              }),
            });

            if (!detailRes.ok) {
              const errorText = await detailRes.text();
              console.error(`API Error (${detailRes.status}):`, errorText);
              return null;
            }

            return await detailRes.json();
          } catch (err) {
            console.error("Failed to extract single job:", err);
            return null;
          }
        })
      );

      const validJobs = jobsData.filter((j): j is JobPosting => j !== null);
      setJobs(validJobs);

      updateStep("4", {
        status: "completed",
        description: `Extracted ${validJobs.length} valid jobs.`,
        details: [
          ...validJobs
            .slice(0, 5)
            .map(
              (j) =>
                `Job found: ${j.title} (${
                  j.jobLocation?.rawAddress || j.workMode
                })`
            ),
          validJobs.length > 5 ? `...and ${validJobs.length - 5} more` : null,
        ].filter(Boolean) as string[],
      });

      // --- STEP 5: Save to DB ---
      if (validJobs.length > 0) {
        updateStep("5", { status: "in-progress" });
        const saveRes = await saveJobsToSupabase(validJobs, {
          replaceCompanyJobs: true, // Delete old jobs for this company first
        });
        if (saveRes.success) {
          updateStep("5", {
            status: "completed",
            details: [
              `Saved ${saveRes.count} jobs (Refreshed company listing)`,
            ],
          });
        } else {
          updateStep("5", {
            status: "failed",
            details: [saveRes.error || "Unknown error"],
          });
        }
      } else {
        updateStep("5", {
          status: "completed",
          details: ["No jobs to save"],
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Something went wrong.";
      setError(errorMessage);

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
        <div className="grid w-full items-center gap-1.5 flex-1">
          <UrlInput value={url} onChange={setUrl} />
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
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardHeader className="">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg font-semibold flex-1">
                    {job.title}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1 justify-start">
                  {/* Location rendering */}
                  {job.jobLocation?.rawAddress && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.jobLocation.rawAddress}
                    </Badge>
                  )}
                  {/* Work mode */}
                  <Badge variant="outline" className="text-xs">
                    {job.workMode}
                  </Badge>
                </div>

                {/* Salary rendering */}
                {job.baseSalary && (
                  <div className="text-sm font-semibold text-green-600 flex items-center ">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.baseSalary.currency}{" "}
                    {job.baseSalary.minValue?.toLocaleString()} -{" "}
                    {job.baseSalary.maxValue?.toLocaleString()} /{" "}
                    {job.baseSalary.unitText}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 line-clamp-3">
                {/* Remove HTML tags for preview */}
                {job.rawDescription
                  ?.replace(/<[^>]*>?/gm, "") // strip tags
                  .substring(0, 200)}
                ...
              </div>

              {/* Combined requirements/qualifications */}
              {(job.responsibilities?.length || 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">
                    Responsibilities:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {job.responsibilities?.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span className="line-clamp-1">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {job.directApplyUrl && (
                <Button className="w-full" size="sm" asChild>
                  <a
                    href={job.directApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
