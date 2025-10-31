import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization:
                        `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        },
    );
}
