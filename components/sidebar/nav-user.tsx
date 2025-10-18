import { IconDotsVertical } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "../ui/skeleton";
import React from "react";
import { UserDropdown } from "@/components/user-dropdown";
import { redirect } from "next/navigation";

function LoadingUser() {
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

async function DynamicUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    redirect("/auth/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage
              src={user?.user_metadata?.avatar_url || ""}
              alt={user?.user_metadata?.full_name || ""}
            />
            <AvatarFallback className="rounded-lg">
              {user?.user_metadata?.full_name?.charAt(0) ||
                user?.email?.charAt(0) ||
                "?"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.user_metadata?.full_name}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.email}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <UserDropdown
        user={{
          name: user?.user_metadata?.full_name,
          email: user?.email,
          imageUrl: user?.user_metadata?.avatar_url,
        }}
      />
    </DropdownMenu>
  );
}

export async function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <React.Suspense fallback={<LoadingUser />}>
          <DynamicUser />
        </React.Suspense>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
