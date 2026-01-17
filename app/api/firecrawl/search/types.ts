export type SearchSource = "web" | "images" | "news";
export type CategoryType = "github" | "research" | "pdf";

export interface SearchRequestBody {
    query: string;
    limit?: number;
    sources?: SearchSource[];
    categories?: Array<{ type: CategoryType }>;
    tbs?: string;
    location?: string;
    country?: string;
    timeout?: number;
    ignoreInvalidURLs?: boolean;
    scrapeOptions?: {
        formats?: Array<
            "markdown" | "html" | "rawHtml" | "links" | "screenshot"
        >;
        onlyMainContent?: boolean;
        maxAge?: number;
        waitFor?: number;
        mobile?: boolean;
        skipTlsVerification?: boolean;
        timeout?: number;
        removeBase64Images?: boolean;
        blockAds?: boolean;
        proxy?: string;
        storeInCache?: boolean;
    };
}
