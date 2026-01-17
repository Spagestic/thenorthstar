import { useState } from "react";
import { ScraperStep } from "./components/scraper-progress";
import {
    JobPosting,
    JobPostingSchema,
} from "@/app/api/ai/extract/details/schema";
import { INITIAL_STEPS } from "./initial-steps";
import { normalizeUrl } from "@/lib/utils";
import { getExistingJobUrls, saveJobsToSupabase } from "./save-jobs";

async function fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 3,
) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.status === 429) {
                const backoff = Math.pow(2, i) * 1000;
                await new Promise((r) => setTimeout(r, backoff));
                continue;
            }
            return res;
        } catch (err) {
            if (i === maxRetries - 1) throw err;
            await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
        }
    }
    throw new Error("Failed after maximum retries");
}

function normalizeLocation(job: JobPosting): JobPosting {
    if (!job.jobLocations) return job;

    const normalized = job.jobLocations.map((loc) => ({
        ...loc,
        city: loc.city?.trim() || null,
        state: loc.state?.length === 2 ? loc.state.toUpperCase() : loc.state,
        country: loc.country || "USA", // Default heuristic if missing
    }));

    return { ...job, jobLocations: normalized };
}

function deduplicateJobs(jobs: JobPosting[]): JobPosting[] {
    const seen = new Set<string>();
    return jobs.filter((job) => {
        // Use URL as primary key, fallback to title + company
        const key = job.url || `${job.title}-${job.companyName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

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
                fetchWithRetry("/api/firecrawl/scrape", {
                    method: "POST",
                    body: JSON.stringify({
                        url: normalizedUrl,
                        scrapeOptions: {
                            formats: ["markdown", "branding"],
                            onlyMainContent: true,
                            excludeTags: ["nav", "footer", "header", "script"],
                            removeBase64Images: true,
                        },
                    }),
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

            const linksRes = await fetchWithRetry("/api/ai/extract/links", {
                method: "POST",
                body: JSON.stringify({ markdown, baseUrl: normalizedUrl }),
            });

            if (!linksRes.ok) throw new Error("Failed to extract links");
            const { jobLinks: extractedLinks } = await linksRes.json();
            let finalJobLinks = [...(extractedLinks || [])];

            // ---------------------------------------------------------
            // PAGINATION & DISCOVERY: Use Crawl for comprehensive discovery
            // ---------------------------------------------------------
            if (finalJobLinks.length > 0 || isRecoveryAttempt) {
                try {
                    updateStep("2", {
                        description:
                            `Found ${finalJobLinks.length} links. Deep crawling for more...`,
                    });

                    const crawlRes = await fetchWithRetry(
                        "/api/firecrawl/crawl",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                url: normalizedUrl,
                                crawlOptions: {
                                    prompt:
                                        "Only find individual job postings or career opening pages. Skip main listing pages or unrelated content.",
                                    limit: 30,
                                    maxDiscoveryDepth: 2,
                                    ignoreQueryParameters: true,
                                },
                            }),
                        },
                    );

                    if (crawlRes.ok) {
                        const crawlData = await crawlRes.json();
                        const crawledLinks = (crawlData.data || []).map((
                            d: any,
                        ) => d.url).filter(Boolean);

                        const linkSet = new Set(finalJobLinks);
                        let newLinksCount = 0;

                        // Heuristic pattern validation for job links
                        const jobPattern =
                            /job|career|opening|position|posting|vacanc/i;

                        crawledLinks.forEach((l: string) => {
                            if (
                                l !== normalizedUrl &&
                                !linkSet.has(l) &&
                                l.length > normalizedUrl.length &&
                                jobPattern.test(l)
                            ) {
                                linkSet.add(l);
                                newLinksCount++;
                            }
                        });

                        finalJobLinks = Array.from(linkSet);
                        if (newLinksCount > 0) {
                            console.log(
                                `Added ${newLinksCount} links from Crawl`,
                            );
                        }
                    }
                } catch (crawlErr) {
                    console.warn(
                        "Deep crawl failed, proceeding with extracted links only",
                        crawlErr,
                    );
                }
            }

            // --- Incremental Scraping / Duplicate Detection ---
            const existingUrls = await getExistingJobUrls(
                new URL(normalizedUrl).origin,
            );
            const initialCount = finalJobLinks.length;
            finalJobLinks = finalJobLinks.filter((url) =>
                !existingUrls.includes(url)
            );
            const skippedCount = initialCount - finalJobLinks.length;

            if (skippedCount > 0) {
                console.log(`Skipped ${skippedCount} already scraped jobs.`);
            }

            if (finalJobLinks.length === 0 && skippedCount === 0) {
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
                            const links = mapData.data || mapData.links || [];
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

                            // Try BFS for common career paths first
                            const pathCandidates = [
                                "/careers",
                                "/jobs",
                                "/work-with-us",
                                "/openings",
                                "/join",
                            ];
                            for (const path of pathCandidates) {
                                try {
                                    const testUrl = `${rootUrl}${path}`;
                                    const response = await fetch(testUrl, {
                                        method: "HEAD",
                                    });
                                    if (response.ok) {
                                        return startScrape(testUrl, true);
                                    }
                                } catch (e) { /* ignore */ }
                            }

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
                description: `Found ${finalJobLinks.length} unique job links.`,
                details: finalJobLinks.slice(0, 5).map((l: string) => {
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
                    `Fetching metadata & crawling ${finalJobLinks.length} pages...`,
            });

            // Prepare initial details with [Pending] status immediately
            const currentDetails = finalJobLinks.map((link: string) => {
                const name = link.split("/").pop() || "Job page";
                return `${name} - [Pending...]`;
            });
            updateStep("3", { details: currentDetails.slice(0, 8) });

            // Background: Fetch titles via link-preview to show real names while crawling
            finalJobLinks.forEach((link: string, index: number) => {
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

            // Parallelize batch processing
            // Instead of one big batch, chunk it
            const BATCH_SIZE = 10;
            const validJobs: JobPosting[] = [];

            for (let i = 0; i < finalJobLinks.length; i += BATCH_SIZE) {
                const batchUrls = finalJobLinks.slice(i, i + BATCH_SIZE);

                // Get content for this batch
                const batchRes = await fetchWithRetry(
                    "/api/firecrawl/batch-scrape",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            urls: batchUrls,
                            scrapeOptions: {
                                // Optimize token usage logic applied again
                                formats: ["markdown"],
                                onlyMainContent: true,
                                excludeTags: [
                                    "nav",
                                    "footer",
                                    "header",
                                    "script",
                                ],
                                removeBase64Images: true,
                            },
                        }),
                    },
                );

                if (!batchRes.ok) {
                    console.error("Batch scrape failed for chunk", i);
                    continue;
                }

                const batchData = await batchRes.json();
                const jobDocs = batchData.data || [];

                updateStep("3", {
                    description: `Analyzing ${
                        Math.min(i + BATCH_SIZE, finalJobLinks.length)
                    }/${finalJobLinks.length} job descriptions...`,
                });

                // Extract details in parallel for this batch
                const batchJobs = await Promise.all(
                    jobDocs.map(async (doc: any, idx: number) => {
                        const globalIndex = i + idx;
                        if (!doc.markdown) return null;

                        try {
                            // Enforce 30s timeout per extraction
                            const controller = new AbortController();
                            const timeoutId = setTimeout(
                                () => controller.abort(),
                                30000,
                            );

                            const detailRes = await fetch(
                                "/api/ai/extract/details",
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                        markdown: doc.markdown,
                                        url: doc.url || doc.metadata?.sourceURL,
                                    }),
                                    signal: controller.signal,
                                },
                            );
                            clearTimeout(timeoutId);

                            if (!detailRes.ok) return null;

                            const job = await detailRes.json();

                            // Schema Validation & Retry Loop
                            const validatedJob = JobPostingSchema.safeParse(
                                job,
                            );
                            let finalJob = job;

                            if (!validatedJob.success) {
                                // Retry once with error context
                                try {
                                    const retryRes = await fetch(
                                        "/api/ai/extract/details",
                                        {
                                            method: "POST",
                                            body: JSON.stringify({
                                                markdown: doc.markdown,
                                                url: doc.url ||
                                                    doc.metadata?.sourceURL,
                                                validationErrors:
                                                    validatedJob.error.issues,
                                                isRetry: true,
                                            }),
                                        },
                                    );
                                    if (retryRes.ok) {
                                        finalJob = await retryRes.json();
                                    }
                                } catch (e) { /* ignore retry fail */ }
                            }

                            // Normalize location
                            finalJob = normalizeLocation(finalJob);

                            // Update UI live
                            currentDetails[globalIndex] = `${
                                finalJob.title || "Job"
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

                            return finalJob;
                        } catch (err) {
                            console.error("Failed to extract single job:", err);
                            return null;
                        }
                    }),
                );

                validJobs.push(
                    ...batchJobs.filter((j): j is JobPosting => j !== null),
                );
            }

            setJobs(validJobs);

            // Deduplicate at extraction time
            const deduplicatedJobsList = deduplicateJobs(validJobs);

            updateStep("3", {
                status: "completed",
                description:
                    `Successfully extracted ${deduplicatedJobsList.length} jobs.`,
                details: [
                    ...currentDetails.slice(0, 8),
                    deduplicatedJobsList.length > 8
                        ? `...and ${deduplicatedJobsList.length - 8} others`
                        : null,
                ].filter(Boolean) as string[],
            });

            // --- STEP 4: Save to DB ---
            if (deduplicatedJobsList.length > 0) {
                updateStep("4", { status: "in-progress" });
                const saveRes = await saveJobsToSupabase(deduplicatedJobsList, {
                    replaceCompanyJobs: false, // Changed to false for incremental
                    companyInfo: companyMetadata || undefined,
                });
                if (saveRes.success) {
                    updateStep("4", {
                        status: "completed",
                        details: [
                            `Saved ${saveRes.count} jobs`,
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
