// app/api/firecrawl/scrape/types.ts

// Import the SDK types directly
import type Firecrawl from "@mendable/firecrawl-js";

// Extract the SDK's own types
type ScrapeOptions = NonNullable<Parameters<Firecrawl["scrape"]>[1]>;
export type FormatOption = NonNullable<ScrapeOptions["formats"]>[number];
export type ActionOption = NonNullable<ScrapeOptions["actions"]>[number];

export interface FirecrawlScrapeRequestBody {
    url: string;
    maxAge?: number;
    storeInCache?: boolean;
    jsonPrompt?: string;
    jsonSchema?: Record<string, unknown>;
    actions?: ActionOption[];
}

export interface BrandingProfile {
    colorScheme?: "light" | "dark";
    logo?: string;
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
        background?: string;
        textPrimary?: string;
        textSecondary?: string;
        link?: string;
        success?: string;
        warning?: string;
        error?: string;
        [key: string]: string | undefined;
    };
    fonts?: Array<{
        family: string;
    }>;
    typography?: {
        fontFamilies?: {
            primary?: string;
            heading?: string;
            code?: string;
        };
        fontSizes?: {
            h1?: string;
            h2?: string;
            h3?: string;
            body?: string;
        };
        fontWeights?: {
            light?: number;
            regular?: number;
            medium?: number;
            bold?: number;
        };
        lineHeights?: Record<string, string>;
    };
    spacing?: {
        baseUnit?: number;
        borderRadius?: string;
        padding?: Record<string, string>;
        margins?: Record<string, string>;
    };
    components?: {
        buttonPrimary?: {
            background?: string;
            textColor?: string;
            borderRadius?: string;
        };
        buttonSecondary?: {
            background?: string;
            textColor?: string;
            borderColor?: string;
            borderRadius?: string;
        };
        input?: Record<string, string>;
    };
    icons?: Record<string, unknown>;
    images?: {
        logo?: string;
        favicon?: string;
        ogImage?: string;
    };
    animations?: Record<string, unknown>;
    layout?: Record<string, unknown>;
    personality?: {
        tone?: string;
        energy?: string;
        targetAudience?: string;
    };
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
    branding?: BrandingProfile;
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
    json?: Record<string, unknown>;
    metadata?: ScrapeMetadata;
    branding?: BrandingProfile;
    screenshot?: string;
    links?: string[];
    error?: string;
}
