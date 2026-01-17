// app/api/firecrawl/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firecrawl } from "../firecrawlClient";
import { SearchRequestBody, SearchSource } from "./types";

export async function POST(req: NextRequest) {
    try {
        const body: SearchRequestBody = await req.json();
        const {
            query,
            limit = 5,
            sources = ["web"],
            categories,
            tbs,
            location,
            country = "US",
            timeout = 60000,
            ignoreInvalidURLs = false,
            scrapeOptions = {
                formats: ["markdown", "links"],
                onlyMainContent: true,
                removeBase64Images: true,
                blockAds: true,
            },
        } = body;

        // Validation
        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return NextResponse.json(
                { error: "Valid query string is required" },
                { status: 400 },
            );
        }

        // Validate limit range (1-100 per API docs)
        if (limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: "limit must be between 1 and 100" },
                { status: 400 },
            );
        }

        // Validate sources
        const validSources: SearchSource[] = ["web", "images", "news"];
        if (sources.some((source) => !validSources.includes(source))) {
            return NextResponse.json(
                {
                    error: `Invalid sources. Must be one of: ${
                        validSources.join(", ")
                    }`,
                },
                { status: 400 },
            );
        }

        // Build search options
        const searchOptions: any = {
            limit,
            sources,
            country,
            timeout,
            ignoreInvalidURLs,
            scrapeOptions,
        };

        // Only include optional parameters if provided
        if (categories && categories.length > 0) {
            searchOptions.categories = categories;
        }
        if (tbs) {
            searchOptions.tbs = tbs;
        }
        if (location) {
            searchOptions.location = location;
        }

        // Execute search
        const result = (await firecrawl.search(query, searchOptions)) as any;

        // Return successful result with metadata
        return NextResponse.json({
            success: true,
            data: result.data,
            warning: result.warning,
            id: result.id,
            creditsUsed: result.creditsUsed,
        });
    } catch (error: any) {
        console.error("Search endpoint error:", {
            message: error?.message,
            stack: error?.stack,
            response: error?.response?.data,
        });

        // Distinguish between different error types
        if (error?.response?.status === 401) {
            return NextResponse.json(
                { error: "Unauthorized - check API key" },
                { status: 401 },
            );
        }

        if (error?.response?.status === 429) {
            return NextResponse.json(
                { error: "Rate limit exceeded" },
                { status: 429 },
            );
        }

        return NextResponse.json(
            {
                error: "Search failed",
                detail: error?.message || "Unknown error occurred",
            },
            { status: 500 },
        );
    }
}
