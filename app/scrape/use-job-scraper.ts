import { useState } from "react";
import { ScraperStep } from "@/app/scrape/components/scraper-progress";
import { JobPosting } from "@/app/api/ai/extract/details/schema";
import { INITIAL_STEPS } from "./initial-steps";
import { normalizeUrl } from "@/lib/utils";
import { saveJobsToSupabase } from "../actions/save-jobs";

export function useJobScraper() {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [steps, setSteps] = useState<ScraperStep[]>(INITIAL_STEPS);

    const updateStep = (id: string, updates: Partial<ScraperStep>) => {
        setSteps((prev) =>
            prev.map((
                step,
            ) => (step.id === id ? { ...step, ...updates } : step))
        );
    };

    const startScrape = async (rawUrl: string) => {
        setLoading(true);
        setError("");
        setJobs([]);
        setSteps(INITIAL_STEPS);
        const normalizedUrl = normalizeUrl(rawUrl);

        try {
            updateStep("1", { status: "in-progress" });

            const scrapeRes = await fetch("/api/firecrawl/scrape", {
                method: "POST",
                body: JSON.stringify({ url: normalizedUrl }),
            });

            if (!scrapeRes.ok) throw new Error("Failed to fetch overview page");

            const { markdown, branding, metadata } = await scrapeRes.json();
            const companyLogo = branding?.logos?.[0] || null;

            updateStep("1", {
                status: "completed",
                details: [
                    metadata?.title ? `${metadata.title}` : null,
                    metadata?.description
                        ? `${metadata.description.substring(0, 80)}...`
                        : null,
                    `Extracted ${markdown.length.toLocaleString()} chars`,
                    // companyLogo ? `IMG:${companyLogo}` : "No logo found",
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
                        const segments = urlObj.pathname.split("/").filter(
                            Boolean,
                        );
                        const lastTwo = segments.slice(-2).join("/");
                        return `${urlObj.hostname}/${lastTwo}`;
                    } catch {
                        return l;
                    }
                }),
            });

            updateStep("3", {
                status: "in-progress",
                description:
                    `Fetching metadata & crawling ${jobLinks.length} pages...`,
            });

            // Prepare initial details with [Pending] status immediately
            const currentDetails = jobLinks.map((link: string) => {
                const name = link.split("/").pop() || "Job page";
                return `${name} - [Pending...]`;
            });
            updateStep("3", { details: currentDetails.slice(0, 8) });

            // Background: Fetch titles via link-preview to show real names while crawling
            jobLinks.forEach((link: string, index: number) => {
                fetch(`/api/link-preview?url=${encodeURIComponent(link)}`)
                    .then((r) => r.json())
                    .then((meta) => {
                        if (
                            meta.title &&
                            currentDetails[index].includes("[Pending...]")
                        ) {
                            currentDetails[index] =
                                `${meta.title} - [Pending...]`;
                            setSteps((prev) =>
                                prev.map((s) =>
                                    s.id === "3"
                                        ? {
                                            ...s,
                                            details: [
                                                ...currentDetails.slice(0, 8),
                                            ],
                                        }
                                        : s
                                )
                            );
                        }
                    })
                    .catch(() => {});
            });

            const batchRes = await fetch("/api/firecrawl/batch-scrape", {
                method: "POST",
                body: JSON.stringify({ urls: jobLinks }),
            });

            if (!batchRes.ok) throw new Error("Batch scrape failed");
            const batchData = await batchRes.json();
            const jobDocs = batchData.data || [];

            updateStep("3", {
                description: `Analyzing ${jobDocs.length} job descriptions...`,
            });

            const jobsData = await Promise.all(
                jobDocs.map(async (doc: any, index: number) => {
                    if (!doc.markdown) return null;
                    try {
                        const detailRes = await fetch(
                            "/api/ai/extract/details",
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    markdown: doc.markdown,
                                    url: doc.url || doc.metadata?.sourceURL,
                                }),
                            },
                        );

                        if (!detailRes.ok) return null;

                        const job = await detailRes.json();

                        // Update UI live as each job finishes - use extracted title
                        currentDetails[index] = `${
                            job.title || "Job"
                        } - [Extracted]`;
                        setSteps((prev) =>
                            prev.map((s) =>
                                s.id === "3"
                                    ? {
                                        ...s,
                                        details: [
                                            ...currentDetails.slice(0, 8),
                                        ],
                                    }
                                    : s
                            )
                        );

                        return job;
                    } catch (err) {
                        console.error("Failed to extract single job:", err);
                        return null;
                    }
                }),
            );

            const validJobs = jobsData.filter((j): j is JobPosting =>
                j !== null
            );
            setJobs(validJobs);

            updateStep("3", {
                status: "completed",
                description: `Successfully extracted ${validJobs.length} jobs.`,
                details: [
                    ...currentDetails.slice(0, 8),
                    validJobs.length > 8
                        ? `...and ${validJobs.length - 8} others`
                        : null,
                ].filter(Boolean) as string[],
            });

            // --- STEP 4: Save to DB ---
            if (validJobs.length > 0) {
                updateStep("4", { status: "in-progress" });
                const saveRes = await saveJobsToSupabase(validJobs, {
                    replaceCompanyJobs: true, // Delete old jobs for this company first
                });
                if (saveRes.success) {
                    updateStep("4", {
                        status: "completed",
                        details: [
                            `Saved ${saveRes.count} jobs (Refreshed company listing)`,
                        ],
                    });
                } else {
                    updateStep("4", {
                        status: "failed",
                        details: [saveRes.error || "Unknown error"],
                    });
                }
            } else {
                updateStep("4", {
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
    };

    return { jobs, steps, loading, error, startScrape };
}
