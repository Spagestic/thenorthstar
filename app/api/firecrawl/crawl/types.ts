export interface FirecrawlCrawlOptions {
    formats?:
        ("markdown" | "html" | "rawHtml" | "links" | "images" | "screenshot")[];
    includePaths?: string[];
    excludePaths?: string[];
    prompt?: string;
    maxDiscoveryDepth?: number | null;
    sitemap?: "skip" | "include";
    ignoreQueryParameters?: boolean;
    limit?: number | null;
    allowExternalLinks?: boolean;
    allowSubdomains?: boolean;
    deduplicateSimilarURLs?: boolean;
    [key: string]: unknown;
}

export interface FirecrawlCrawlRequestBody {
    url: string;
    maxDepth?: number;
    maxPages?: number;
    crawlOptions?: FirecrawlCrawlOptions;
    pollInterval?: number; // seconds for waiter
    timeout?: number; // seconds for waiter
}

export interface FirecrawlCrawlDocument {
    id?: string;
    url?: string;
    markdown?: string;
    html?: string;
    text?: string;
    // [key: string]: unknown;
}

export type FirecrawlCrawlStatus =
    | "scraping"
    | "completed"
    | "failed"
    | "cancelled";

export interface FirecrawlCrawlResponseBody {
    success: boolean;
    status?: FirecrawlCrawlStatus;
    completed?: number;
    total?: number;
    creditsUsed?: number;
    expiresAt?: string | Date;
    next?: string;
    data?: FirecrawlCrawlDocument[];
    id?: string;
    url?: string;
    error?: string;
    detail?: string;
}
