// lib/supabase/anon.ts
import { createClient } from "@supabase/supabase-js";

export function createAnonClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
            global: {
                // Override fetch to remove the abort signal
                fetch: (url, options) => {
                    return fetch(url, {
                        ...options,
                        // 1. Prevent Next.js from passing a stale AbortSignal
                        signal: undefined,
                        // 2. Ensure cache tagging still works (optional but recommended)
                        cache: "no-store",
                    });
                },
            },
        },
    );
}
