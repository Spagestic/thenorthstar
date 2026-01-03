// app/api/firecrawl/crawl/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";

export async function POST(req: NextRequest) {
    try {
        const {
            url,
            maxDepth,
            maxPages,
            crawlOptions, // formats, includePaths, excludePaths, prompt, etc.
            pollInterval,
            timeout,
        } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: "url is required" },
                { status: 400 },
            );
        }

        const result = await firecrawl.crawl(url, {
            ...(crawlOptions ?? { formats: ["markdown"] }),
            maxDepth: maxDepth ?? 1,
            maxPages: maxPages ?? 20,
            pollInterval: pollInterval ?? 2,
            timeout: timeout ?? 600,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("crawl error", error);
        return NextResponse.json(
            { error: "Crawl failed", detail: error?.message },
            { status: 500 },
        );
    }
}
