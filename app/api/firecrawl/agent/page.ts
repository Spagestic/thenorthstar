// app/api/firecrawl/agent/route.ts
import { NextRequest, NextResponse } from "next/server";

const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v2";

function getApiKey() {
    const key = process.env.FIRECRAWL_API_KEY;
    if (!key) throw new Error("Missing FIRECRAWL_API_KEY");
    return key;
}

// POST: start an agent job
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const prompt: string | undefined = body?.prompt;
        const urls: string[] | undefined = body?.urls;
        const schema: Record<string, any> | undefined = body?.schema;
        const maxCredits: number | undefined = body?.maxCredits;
        const strictConstrainToURLs: boolean | undefined = body
            ?.strictConstrainToURLs;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid `prompt`" },
                { status: 400 },
            );
        }

        const res = await fetch(`${FIRECRAWL_BASE_URL}/agent`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getApiKey()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                urls,
                schema,
                maxCredits,
                strictConstrainToURLs,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: "Firecrawl agent start failed", detail: data },
                { status: res.status },
            );
        }

        // expected: { success: true, id: "..." }
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            {
                error: "Agent route failed",
                detail: err?.message ?? String(err),
            },
            { status: 500 },
        );
    }
}

// GET: poll agent job status/results by jobId query param
// Example: /api/firecrawl/agent?jobId=xxxxx
export async function GET(request: NextRequest) {
    try {
        const jobId = request.nextUrl.searchParams.get("jobId");
        if (!jobId) {
            return NextResponse.json(
                { error: "Missing `jobId` query param" },
                { status: 400 },
            );
        }

        const res = await fetch(`${FIRECRAWL_BASE_URL}/agent/${jobId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getApiKey()}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: "Firecrawl get agent status failed", detail: data },
                { status: res.status },
            );
        }

        // expected: { success: true, status: "processing"|"completed"|"failed", data: {...}, expiresAt, creditsUsed, error? }
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            {
                error: "Agent status route failed",
                detail: err?.message ?? String(err),
            },
            { status: 500 },
        );
    }
}
