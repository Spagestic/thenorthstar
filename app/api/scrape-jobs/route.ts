import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function POST(request: NextRequest) {
    const { url } = await request.json();

    // Scrape with actions to handle dynamic content
    const scrapeResult = await app.scrape(url, {
        formats: ["markdown"],
        actions: [
            { type: "wait", milliseconds: 2000 },
            { type: "scroll", direction: "down" },
            { type: "wait", milliseconds: 1000 },
        ],
        excludeTags: ["nav", "footer", "header"],
    });

    return NextResponse.json({
        markdown: scrapeResult.markdown,
    });
}
