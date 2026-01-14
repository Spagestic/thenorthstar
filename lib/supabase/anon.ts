// lib/supabase/anon.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

export function createAnonClient() {
    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        },
    );
}
