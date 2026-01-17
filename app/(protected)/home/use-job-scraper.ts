import { useState } from "react";
import { ScraperStep } from "./components/scraper-progress";
import { JobPosting } from "@/app/api/ai/extract/details/schema";
import { INITIAL_STEPS } from "./initial-steps";
import { normalizeUrl } from "@/lib/utils";
import { saveJobsToSupabase } from "./save-jobs";

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

    const startScrape = async (rawUrl: string, isRecoveryAttempt = false) => {
        setLoading(true);
        setError("");
        if (!isRecoveryAttempt) {
            setJobs([]);
            setSteps(INITIAL_STEPS);
        }
        const normalizedUrl = normalizeUrl(rawUrl);
        let companyMetadata:
            | { name: string; website: string; logoUrl?: string }
            | null = null;

        try {
            updateStep("1", { status: "in-progress" });

            // Fetch company metadata in parallel with the main scrape
            const [scrapeRes, previewRes] = await Promise.all([
                fetch("/api/firecrawl/scrape", {
                    method: "POST",
                    body: JSON.stringify({ url: normalizedUrl }),
                }),
                fetch(
                    `/api/link-preview?url=${
                        encodeURIComponent(new URL(normalizedUrl).origin)
                    }`,
                )
                    .then((r) => r.ok ? r.json() : null)
                    .catch(() => null),
            ]);

            if (!scrapeRes.ok) throw new Error("Failed to fetch overview page");

            const { markdown, branding, metadata: firecrawlMetadata } =
                await scrapeRes.json();

            // Prefer metadata from link-preview, fallback to firecrawl
            companyMetadata = {
                name: previewRes?.title || firecrawlMetadata?.title ||
                    "Unknown Company",
                website: new URL(normalizedUrl).origin,
                logoUrl: previewRes?.logo || branding?.logos?.[0],
            };

            updateStep("1", {
                status: "completed",
                details: [
                    companyMetadata.name,
                    firecrawlMetadata?.description
                        ? `${firecrawlMetadata.description.substring(0, 80)}...`
                        : null,
                    `Extracted ${markdown.length.toLocaleString()} chars`,
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
                if (!isRecoveryAttempt) {
                    updateStep("2", {
                        description:
                            "No jobs found. Searching for main careers page...",
                        status: "in-progress",
                    });

                    try {
                        const rootUrl = new URL(normalizedUrl).origin;
                        const mapRes = await fetch("/api/firecrawl/map", {
                            method: "POST",
                            body: JSON.stringify({
                                url: rootUrl,
                                search: "careers jobs openings",
                                limit: 5,
                            }),
                        });

                        if (mapRes.ok) {
                            const mapData = await mapRes.json();
                            const links = mapData.data || mapData.links || []; // Check both fields just in case
                            // Filter for likely candidates, excluding the current one
                            const candidates = links.filter((l: string) => {
                                try {
                                    return l !== normalizedUrl &&
                                        new URL(l).pathname !==
                                            new URL(normalizedUrl).pathname;
                                } catch {
                                    return false;
                                }
                            });

                            // Heuristic: prefer /careers or /jobs
                            const bestCandidate = candidates.find((l: string) =>
                                l.includes("/careers") || l.includes("/jobs")
                            ) || candidates[0];

                            if (bestCandidate) {
                                updateStep("2", {
                                    description:
                                        `Redirecting to: ${bestCandidate}`,
                                    status: "completed",
                                    details: [
                                        `Original: ${normalizedUrl}`,
                                        `New Target: ${bestCandidate}`,
                                    ],
                                });

                                return startScrape(bestCandidate, true);
                            }
                        }
                    } catch (mapErr) {
                        console.error("Map search failed", mapErr);
                    }
                }
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
                    companyInfo: companyMetadata || undefined,
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
            return true;
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
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { jobs, steps, loading, error, startScrape };
}
