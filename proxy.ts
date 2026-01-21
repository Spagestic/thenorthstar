// proxy.ts
import { type NextRequest } from "next/server";
import updateSession from "@/lib/supabase/session"; // Your existing Supabase logic

export async function proxy(request: NextRequest) {
    // This calls your supabase logic
    return await updateSession(request);
}

export const config = {
    // The matcher ensures the proxy ONLY runs on application routes,
    // excluding static assets, images, and Next.js internals.
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
