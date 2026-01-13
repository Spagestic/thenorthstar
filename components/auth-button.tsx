import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserAvatar } from "./user-avatar";
import { Suspense } from "react";

export async function AuthButton() {
  return (
    <Suspense fallback={<ArrowButton title="Login" href="/auth/login" />}>
      <AuthButtonContent />
    </Suspense>
  );
}

async function AuthButtonContent() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-2">
      <ArrowButton title="App" href="/dashboard" />
      <UserAvatar
        className="w-48"
        userEmail={user.email}
        userImageUrl={user.picture}
        userName={
          user.user_metadata?.full_name || user.user_metadata?.email || "User"
        }
      />
    </div>
  ) : (
    <div className="flex gap-2">
      <ArrowButton title="Login" href="/auth/login" />
    </div>
  );
}

function ArrowButton({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href}>
      <div
        id="gooey-btn"
        className="relative flex items-center group"
        style={{ filter: "url(#gooey-filter)" }}
      >
        <button className="absolute right-0 px-2.5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-normal text-xs transition-all duration-300 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </button>
        <button className="px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-normal text-xs transition-all duration-300 cursor-pointer h-8 flex items-center z-10">
          {title}
        </button>
      </div>
    </Link>
  );
}
