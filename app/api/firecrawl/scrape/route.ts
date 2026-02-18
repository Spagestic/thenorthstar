// app/api/firecrawl/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";
import type {
    ActionOption,
    FirecrawlScrapeRequestBody,
    FirecrawlScrapeResponseBody,
    FirecrawlScrapeResult,
    FormatOption,
} from "./types";

const DEFAULT_WEBSITE_SCHEMA = {
    type: "object",
    properties: {
        company_name: { type: "string" },
        company_description: { type: "string" },
        main_products_or_services: {
            type: "array",
            items: { type: "string" },
        },
        target_audience: { type: "string" },
        unique_value_proposition: { type: "string" },
        call_to_action: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    text: { type: "string" },
                    url: { type: "string" },
                },
            },
        },
        key_features: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                },
            },
        },
        social_proof: {
            type: "object",
            properties: {
                testimonials_count: { type: "number" },
                notable_clients: {
                    type: "array",
                    items: { type: "string" },
                },
                metrics: {
                    type: "array",
                    items: { type: "string" },
                },
            },
        },
        pricing_available: { type: "boolean" },
        contact_info: {
            type: "object",
            properties: {
                email: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
            },
        },
        social_links: {
            type: "object",
            properties: {
                twitter: { type: "string" },
                linkedin: { type: "string" },
                github: { type: "string" },
            },
        },
    },
    required: [
        "company_name",
        "company_description",
        "main_products_or_services",
    ],
} as const;

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
        const {
            url,
            maxAge,
            storeInCache,
            jsonPrompt,
            jsonSchema,
            actions,
        } = body;

        if (!url) {
            return NextResponse.json<FirecrawlScrapeResponseBody>(
                { success: false, error: "URL is required" },
                { status: 400 },
            );
        }

        // Build formats array with proper SDK types
        const formats: FormatOption[] = ["markdown", "branding", "links"];

        // Add JSON extraction - construct the full object inline to keep the narrow type
        if (jsonSchema && jsonPrompt) {
            formats.push({
                type: "json",
                schema: jsonSchema,
                prompt: jsonPrompt,
            });
        } else if (jsonSchema) {
            formats.push({
                type: "json",
                schema: jsonSchema,
            });
        } else if (jsonPrompt) {
            formats.push({
                type: "json",
                prompt: jsonPrompt,
            });
        } else {
            formats.push({
                type: "json",
                schema: DEFAULT_WEBSITE_SCHEMA,
                prompt:
                    "Extract comprehensive information about this company/website. Focus on understanding what the business does, who it serves, and its key offerings.",
            });
        }

        const scrapeResult = (await firecrawl.scrape(url, {
            formats,
            actions: actions ?? DEFAULT_ACTIONS,
            excludeTags: ["nav", "footer", "header", "script", "style"],
            onlyMainContent: true,
            maxAge: maxAge ?? 172800000,
            storeInCache: storeInCache ?? true,
            timeout: 120000,
        })) as FirecrawlScrapeResult;

        const responseBody: FirecrawlScrapeResponseBody = {
            success: true,
            markdown: scrapeResult.markdown,
            metadata: scrapeResult.metadata,
            branding: scrapeResult.branding,
            json: scrapeResult.json,
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
