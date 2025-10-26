import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "../ui/skeleton";
import { redirect } from "next/navigation";
import { NavUserClient } from "./nav-user-client";

export function LoadingUser() {
  return (
    <div className="flex items-center justify-center px-2 py-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex-1 px-2 py-2 space-y-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export async function NavUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    redirect("/auth/login");
  }

  if (!user) {
    redirect("/auth/login");
  }

  const userData = {
    name: user.user_metadata?.full_name,
    email: user.email,
    imageUrl: user.user_metadata?.avatar_url,
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NavUserClient user={userData} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
