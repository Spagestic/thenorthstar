import { useState } from "react";
import { ScraperStep } from "./components/scraper-progress";
import {
    JobPosting,
    JobPostingSchema,
} from "@/app/api/ai/extract/details/schema";
import { INITIAL_STEPS } from "./initial-steps";
import { normalizeUrl } from "@/lib/utils";
import { saveJobToSupabase } from "./components/save-jobs";

function normalizeLocation(job: JobPosting): JobPosting {
    if (!job.jobLocations) return job;

    const normalized = job.jobLocations.map((loc) => ({
        ...loc,
        city: loc.city?.trim() || null,
        state: loc.state?.length === 2 ? loc.state.toUpperCase() : loc.state,
        country: loc.country || "USA",
    }));

    return { ...job, jobLocations: normalized };
}

export function useJobScraper() {
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
        setSteps(INITIAL_STEPS);

        const normalizedUrl = normalizeUrl(rawUrl);

        try {
            // --- STEP 1: Scrape the single job page ---
            updateStep("1", { status: "in-progress" });

            const [scrapeRes, previewRes] = await Promise.all([
                fetch("/api/firecrawl/scrape", {
                    method: "POST",
                    body: JSON.stringify({
                        url: normalizedUrl,
                        scrapeOptions: {
                            formats: ["markdown"],
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
                    .then((r) => (r.ok ? r.json() : null))
                    .catch(() => null),
            ]);

            if (!scrapeRes.ok) throw new Error("Failed to scrape job page");

            const { markdown, metadata: firecrawlMetadata } = await scrapeRes
                .json();

            if (!markdown || markdown.trim().length < 50) {
                throw new Error(
                    "Page content too short — this may not be a valid job posting.",
                );
            }

            const companyMetadata = {
                name: previewRes?.title || firecrawlMetadata?.title ||
                    "Unknown Company",
                website: new URL(normalizedUrl).origin,
                logoUrl: previewRes?.logo || undefined,
            };

            updateStep("1", {
                status: "completed",
                details: [
                    companyMetadata.name,
                    `Extracted ${markdown.length.toLocaleString()} chars`,
                ],
            });

            // --- STEP 2: Extract job details via AI ---
            updateStep("2", { status: "in-progress" });

            const detailRes = await fetch("/api/ai/extract/details", {
                method: "POST",
                body: JSON.stringify({
                    markdown,
                    url: normalizedUrl,
                }),
            });

            if (!detailRes.ok) throw new Error("Failed to extract job details");

            let job: JobPosting = await detailRes.json();

            // Validate with schema
            const validated = JobPostingSchema.safeParse(job);

            if (!validated.success) {
                // One retry with validation errors
                const retryRes = await fetch("/api/ai/extract/details", {
                    method: "POST",
                    body: JSON.stringify({
                        markdown,
                        url: normalizedUrl,
                        validationErrors: validated.error.issues,
                        isRetry: true,
                    }),
                });

                if (retryRes.ok) {
                    job = await retryRes.json();
                }
            }

            // Normalize location
            job = normalizeLocation(job);

            // Ensure URL is set
            if (!job.url) {
                job.url = normalizedUrl;
            }

            updateStep("2", {
                status: "completed",
                details: [
                    job.title || "Unknown Title",
                    job.companyName || companyMetadata.name,
                    job.workMode || "Unknown work mode",
                    job.employmentType || "Unknown type",
                ].filter(Boolean) as string[],
            });

            // --- STEP 3: Save to database ---
            updateStep("3", { status: "in-progress" });

            const saveRes = await saveJobToSupabase(job, {
                companyInfo: companyMetadata,
            });

            if (saveRes.success) {
                updateStep("3", {
                    status: "completed",
                    details: [`Saved "${job.title}" successfully`],
                });
            } else {
                updateStep("3", {
                    status: "failed",
                    details: [saveRes.error || "Unknown error"],
                });
                return false;
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

    return { steps, loading, error, startScrape };
}
