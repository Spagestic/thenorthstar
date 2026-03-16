// app/api/jobs/batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const careersUrl = typeof body?.url === "string" ? body.url.trim() : "";
        const limit = typeof body?.limit === "number" ? body.limit : 10;

        if (!careersUrl) {
            return NextResponse.json(
                {
                    error: "URL is required",
                },
                { status: 400 },
            );
        }

        try {
            new URL(careersUrl);
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        const supabase = await createClient();

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json(
                { error: "Supabase environment variables are not configured" },
                { status: 500 },
            );
        }

        const edgeFnRes = await fetch(
            `${supabaseUrl}/functions/v1/batch-scrape-careers`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: supabaseAnonKey,
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ url: careersUrl, limit }),
                cache: "no-store",
            },
        );

        const rawBody = await edgeFnRes.text();
        let payload: Record<string, unknown> | null = null;

        try {
            payload = rawBody ? JSON.parse(rawBody) : null;
        } catch {
            payload = null;
        }

        if (!edgeFnRes.ok) {
            return NextResponse.json(
                {
                    error:
                        payload?.error ||
                        "Failed to batch scrape and save jobs",
                    details: payload ?? { rawBody },
                    upstreamStatus: edgeFnRes.status,
                },
                { status: edgeFnRes.status || 500 },
            );
        }

        return NextResponse.json(payload ?? { rawBody });
    } catch (error) {
        console.error("POST /api/jobs/batch failed:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to save job";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
