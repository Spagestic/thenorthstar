// app/api/firecrawl/crawl/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";
import {
    FirecrawlCrawlRequestBody,
    FirecrawlCrawlResponseBody,
    FirecrawlCrawlStatus,
} from "./types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as FirecrawlCrawlRequestBody;

        // Input validation
        if (!body.url) {
            return NextResponse.json(
                { success: false, error: "url is required" },
                { status: 400 },
            );
        }

        // URL validation
        try {
            new URL(body.url);
        } catch {
            return NextResponse.json(
                { success: false, error: "Invalid URL format" },
                { status: 400 },
            );
        }

        const { url, maxDepth, maxPages, crawlOptions, pollInterval, timeout } =
            body;

        const crawlJob = await firecrawl.crawl(url, {
            limit: crawlOptions?.limit ?? maxPages ?? 20,
            maxDiscoveryDepth: crawlOptions?.maxDiscoveryDepth ?? maxDepth ?? 1,
            includePaths: crawlOptions?.includePaths,
            excludePaths: crawlOptions?.excludePaths,
            prompt: crawlOptions?.prompt,
            sitemap: crawlOptions?.sitemap ?? "include",
            ignoreQueryParameters: crawlOptions?.ignoreQueryParameters ?? true,
            allowExternalLinks: false,
            pollInterval: pollInterval ?? 2,
            timeout: timeout ?? 600,
            scrapeOptions: {
                formats: crawlOptions?.formats ?? ["markdown"],
            },
        });

        // Transform CrawlJob to your response format
        const response: FirecrawlCrawlResponseBody = {
            success: true,
            status: crawlJob.status as FirecrawlCrawlStatus,
            completed: crawlJob.completed,
            total: crawlJob.total,
            creditsUsed: crawlJob.creditsUsed,
            expiresAt: crawlJob.expiresAt,
            next: crawlJob.next ?? undefined,
            data: crawlJob.data ?? undefined,
            id: crawlJob.id ?? undefined,
        };

        return NextResponse.json<FirecrawlCrawlResponseBody>(response);
    } catch (error: any) {
        console.error("Crawl error:", {
            message: error?.message,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
        });

        // Handle specific error types
        if (error?.message?.includes("rate limit")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Rate limit exceeded",
                    detail: error.message,
                },
                { status: 429 },
            );
        }

        if (error?.message?.includes("authentication")) {
            return NextResponse.json(
                { success: false, error: "Authentication failed" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Crawl failed", detail: error?.message },
            { status: 500 },
        );
    }
}
