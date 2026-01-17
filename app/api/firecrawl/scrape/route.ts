// app/api/firecrawl/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";
import {
    FirecrawlScrapeRequestBody,
    FirecrawlScrapeResponseBody,
    FirecrawlScrapeResult,
} from "./types";

export async function POST(request: NextRequest) {
    const { url, maxAge, storeInCache } =
        (await request.json()) as FirecrawlScrapeRequestBody;

    const scrapeResult = (await firecrawl.scrape(url, {
        formats: ["markdown", "branding"],
        actions: [
            { type: "wait", milliseconds: 2000 },
            { type: "scroll", direction: "down" },
            { type: "wait", milliseconds: 1000 },
        ],
        excludeTags: ["nav", "footer", "header"],
        maxAge, // Add faster scraping parameter
        storeInCache, // Control caching behavior
    })) as FirecrawlScrapeResult;

    const responseBody: FirecrawlScrapeResponseBody = {
        markdown: scrapeResult.markdown,
        metadata: scrapeResult.metadata,
        branding: scrapeResult.branding,
    };

    return NextResponse.json<FirecrawlScrapeResponseBody>(responseBody);
}
