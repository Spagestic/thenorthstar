// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";

export async function POST(req: NextRequest) {
    try {
        const {
            query,
            limit,
            sources, // e.g. ["web", "news", "images"]
            tbs, // time filters, etc.
            location, // "Germany", "US" or more advanced location object
            scrapeOptions, // same options as scrape endpoint
        } = await req.json();

        if (!query) {
            return NextResponse.json(
                { error: "query is required" },
                { status: 400 },
            );
        }

        const result = await firecrawl.search(query, {
            limit: limit ?? 5,
            sources,
            tbs,
            location,
            scrapeOptions: scrapeOptions ?? {
                formats: ["markdown", "links"],
            },
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("search error", error);
        return NextResponse.json(
            { error: "Search failed", detail: error?.message },
            { status: 500 },
        );
    }
}
