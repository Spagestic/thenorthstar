// app/api/firecrawl/scrape/types.ts
import type Firecrawl from "@mendable/firecrawl-js";
import type { JobPosting } from "./JobPostingSchema";

type ScrapeOptions = NonNullable<Parameters<Firecrawl["scrape"]>[1]>;
export type FormatOption = NonNullable<ScrapeOptions["formats"]>[number];
export type ActionOption = NonNullable<ScrapeOptions["actions"]>[number];

export interface FirecrawlScrapeRequestBody {
    url: string;
    maxAge?: number;
    storeInCache?: boolean;
    actions?: ActionOption[];
}

export interface ScrapeMetadata {
    title?: string;
    description?: string;
    language?: string;
    keywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    ogImage?: string;
    ogSiteName?: string;
    sourceURL?: string;
    statusCode?: number;
    [key: string]: unknown;
}

export interface FirecrawlScrapeResult {
    markdown?: string;
    html?: string;
    rawHtml?: string;
    links?: string[];
    screenshot?: string;
    json?: Record<string, unknown>;
    metadata?: ScrapeMetadata;
    actions?: {
        screenshots?: string[];
        scrapes?: Array<{ url: string; html: string }>;
    };
}

export interface FirecrawlScrapeResponseBody {
    success: boolean;
    markdown?: string;
    html?: string;
    json?: JobPosting | Record<string, unknown> | null;
    metadata?: ScrapeMetadata;
    screenshot?: string;
    links?: string[];
    error?: string;
}
