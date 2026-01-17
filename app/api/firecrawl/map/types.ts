export type SitemapMode = "include" | "skip" | "only";

export interface MapRequestBody {
    url?: string;
    limit?: number;
    sitemap?: SitemapMode;
    search?: string;
    location?: {
        country?: string; // ISO 3166-1 alpha-2, e.g. 'US'
        languages?: string[]; // e.g. ['en', 'zh-HK']
    };
}
