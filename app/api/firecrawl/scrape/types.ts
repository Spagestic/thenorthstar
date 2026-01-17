export interface FirecrawlScrapeRequestBody {
    url: string;
    maxAge?: number; // Time in milliseconds - use cached data if less than this age
    storeInCache?: boolean; // Whether to store results in cache (default: true)
}

export interface FirecrawlScrapeResult {
    markdown?: string;
    metadata?: {
        title?: string;
        description?: string;
        robots?: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        [key: string]: unknown;
    };
    branding?: {
        colorScheme?: "light" | "dark";
        logo?: string;
        colors?: {
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            surface?: string;
            text?: string;
            [key: string]: string | undefined;
        };
        fonts?: {
            heading?: string;
            body?: string;
            monospace?: string;
            [key: string]: string | undefined;
        };
        components?: Record<string, unknown>;
        spacingScale?: string[];
        [key: string]: unknown;
    };
}

export interface FirecrawlScrapeResponseBody {
    markdown?: string;
    metadata?: FirecrawlScrapeResult["metadata"];
    branding?: FirecrawlScrapeResult["branding"];
}
