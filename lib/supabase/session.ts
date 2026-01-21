import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // 1. Define your public paths based on your folder structure
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/" || // Landing page (app/(public)/page.tsx)
    path.startsWith("/privacy") || // Privacy page
    path.startsWith("/terms") || // Terms page
    path.startsWith("/auth"); // All auth routes (login, signup, etc.)
  // path.startsWith("/api"); // Exclude API routes from redirecting to HTML login pages

  // 2. Only redirect if no user AND the path is NOT public
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
