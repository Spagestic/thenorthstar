// app/api/firecrawl/map/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";

type SitemapMode = "include" | "skip" | "only";

interface MapRequestBody {
    url?: string;
    limit?: number;
    sitemap?: SitemapMode;
    search?: string;
    location?: {
        country?: string; // ISO 3166-1 alpha-2, e.g. 'US'
        languages?: string[]; // e.g. ['en', 'zh-HK']
    };
}

export async function POST(req: NextRequest) {
    let body: MapRequestBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { url, limit, sitemap, search, location } = body;

    if (!url || typeof url !== "string") {
        return NextResponse.json(
            { error: "url is required and must be a string" },
            { status: 400 },
        );
    }

    const parsedLimit =
        typeof limit === "number" && Number.isFinite(limit) && limit > 0
            ? Math.min(limit, 1000) // optional upper bound
            : 100;

    const sitemapMode: SitemapMode =
        sitemap === "include" || sitemap === "skip" || sitemap === "only"
            ? sitemap
            : "include";

    try {
        const result = await firecrawl.map(url, {
            limit: parsedLimit,
            sitemap: sitemapMode,
            search,
            location,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("map error", error);

        // Try to surface provider error details if they exist
        const detail = error?.response?.data ??
            error?.message ??
            "Unknown error from Firecrawl";

        return NextResponse.json(
            {
                error: "Map failed",
                detail,
            },
            { status: 502 }, // upstream dependency failed
        );
    }
}
