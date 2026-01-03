// app/api/firecrawl/map/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";

export async function POST(req: NextRequest) {
    try {
        const {
            url,
            limit,
            sitemap, // "include" | "exclude" | "only"
            search, // optional keyword to prioritize URLs
            location, // same shape as scrape location
        } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: "url is required" },
                { status: 400 },
            );
        }

        const result = await firecrawl.map(url, {
            limit: limit ?? 100,
            sitemap: sitemap ?? "include",
            search,
            location,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("map error", error);
        return NextResponse.json(
            { error: "Map failed", detail: error?.message },
            { status: 500 },
        );
    }
}
