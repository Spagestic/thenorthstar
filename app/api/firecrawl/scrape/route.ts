// app/api/firecrawl/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";

export async function POST(request: NextRequest) {
    const { url } = await request.json();

    const scrapeResult = await firecrawl.scrape(url, {
        formats: ["markdown", "branding"],
        actions: [
            { type: "wait", milliseconds: 2000 },
            { type: "scroll", direction: "down" },
            { type: "wait", milliseconds: 1000 },
        ],
        excludeTags: ["nav", "footer", "header"],
    });

    return NextResponse.json({
        markdown: scrapeResult.markdown,
        metadata: scrapeResult.metadata, // Contains title, description, ogImage
        branding: scrapeResult.branding, // Contains strict logo, colors, fonts
    });
}
