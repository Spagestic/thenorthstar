// app/api/firecrawl/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";
import { JobPostingSchema } from "./JobPostingSchema";
import { z } from "zod";
import type {
    ActionOption,
    FirecrawlScrapeRequestBody,
    FirecrawlScrapeResponseBody,
    FirecrawlScrapeResult,
    FormatOption,
} from "./types";

const JOB_POSTING_JSON_SCHEMA = z.toJSONSchema(JobPostingSchema);

const DEFAULT_ACTIONS: ActionOption[] = [
    { type: "wait", milliseconds: 2000 },
    { type: "scroll", direction: "down" },
    { type: "wait", milliseconds: 1000 },
    { type: "scroll", direction: "down" },
    { type: "wait", milliseconds: 1000 },
];

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as FirecrawlScrapeRequestBody;
        const { url, maxAge, storeInCache, actions } = body;

        if (!url) {
            return NextResponse.json<FirecrawlScrapeResponseBody>(
                { success: false, error: "URL is required" },
                { status: 400 },
            );
        }

        const formats: FormatOption[] = [
            "markdown",
            "links",
            {
                type: "json",
                schema: JOB_POSTING_JSON_SCHEMA,
                prompt: [
                    "Extract all job posting details from this page.",
                    "Focus on: job title, company name, locations, work mode (remote/hybrid/onsite),",
                    "employment type, full job description in markdown, responsibilities,",
                    "qualifications, salary/compensation, dates, and application URL.",
                    "If a field is not found on the page, leave it null.",
                    "For the description field, preserve the full content as markdown.",
                ].join(" "),
            },
        ];

        const scrapeResult = (await firecrawl.scrape(url, {
            formats,
            actions: actions ?? DEFAULT_ACTIONS,
            excludeTags: ["script", "style", "noscript", "iframe"],
            onlyMainContent: true,
            maxAge: maxAge ?? 172800000,
            storeInCache: storeInCache ?? true,
            timeout: 120000,
        })) as FirecrawlScrapeResult;

        // Validate the extracted JSON against our Zod schema
        let validatedJob = null;
        if (scrapeResult.json) {
            const parsed = JobPostingSchema.safeParse({
                ...scrapeResult.json,
                // Ensure the source URL is always set
                url: scrapeResult.json.url || url,
            });

            if (parsed.success) {
                validatedJob = parsed.data;
            } else {
                console.warn(
                    "Job posting validation warnings:",
                    parsed.error.flatten(),
                );
                // Still use the raw data but with the URL guaranteed
                validatedJob = {
                    ...scrapeResult.json,
                    url: scrapeResult.json.url || url,
                };
            }
        }

        const responseBody: FirecrawlScrapeResponseBody = {
            success: true,
            markdown: scrapeResult.markdown,
            metadata: scrapeResult.metadata,
            json: validatedJob,
            links: scrapeResult.links,
        };

        return NextResponse.json<FirecrawlScrapeResponseBody>(responseBody);
    } catch (error) {
        console.error("Firecrawl scrape error:", error);

        const message = error instanceof Error
            ? error.message
            : "Unknown scraping error";

        return NextResponse.json<FirecrawlScrapeResponseBody>(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
