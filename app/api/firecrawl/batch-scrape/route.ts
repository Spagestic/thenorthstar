// app/api/batch-scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";

export async function POST(req: NextRequest) {
    try {
        const { urls, scrapeOptions, pollInterval, timeout } = await req.json();

        if (!Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: "urls must be a non-empty array" },
                { status: 400 },
            );
        }

        const result = await firecrawl.batchScrape(urls, {
            // formats etc. can be nested here, depending on SDK version
            ...(scrapeOptions ?? { formats: ["markdown"] }),
            pollInterval: pollInterval ?? 2,
            timeout: timeout ?? 120,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("batch-scrape error", error);
        return NextResponse.json(
            { error: "Batch scrape failed", detail: error?.message },
            { status: 500 },
        );
    }
}
