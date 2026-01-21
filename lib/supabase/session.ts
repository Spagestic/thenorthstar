// lib/supabase/session.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function updateSession(request: NextRequest) {
  // 1. Initialize the response
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

  // 2. Get the current user
  // Note: Standard Supabase SSR usually uses .getUser(), but we'll use your existing pattern
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const path = request.nextUrl.pathname;

  // If user is logged in and tries to access login or sign-up, send them to dashboard
  if (
    user && (path.startsWith("/auth/login") || path.startsWith("/auth/sign-up"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const isPublicPath = path === "/" ||
    path.startsWith("/privacy") ||
    path.startsWith("/terms") ||
    path.startsWith("/auth");

  // If no user and trying to access a private route, redirect to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
