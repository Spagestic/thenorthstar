import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const targetUrl = typeof body?.url === "string" ? body.url.trim() : "";
        const maxAge = typeof body?.maxAge === "number" ? body.maxAge : 600000;

        if (!targetUrl) {
            return NextResponse.json(
                {
                    error: "URL is required",
                },
                { status: 400 },
            );
        }

        try {
            new URL(targetUrl);
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
            `${supabaseUrl}/functions/v1/scrape-job`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: supabaseAnonKey,
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    url: targetUrl,
                    maxAge,
                }),
                cache: "no-store",
            },
        );

        const payload = await edgeFnRes.json().catch(() => ({}));

        if (!edgeFnRes.ok) {
            return NextResponse.json(
                {
                    error: payload?.error || "Failed to scrape and save job",
                    details: payload,
                },
                { status: edgeFnRes.status || 500 },
            );
        }

        return NextResponse.json(payload);
    } catch (error) {
        console.error("POST /api/jobs failed:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to save job";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
