"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  IconLock,
  IconLogout,
  IconScript,
  IconUserCircle,
} from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
export function UserDropdown({
  user,
}: {
  user: { name?: string; email?: string; imageUrl?: string } | null;
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg z-100"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.imageUrl || ""} alt={user?.name || ""} />
            <AvatarFallback className="rounded-lg">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.email}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <IconUserCircle />
            Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/terms">
            <IconScript />
            Terms
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/privacy">
            <IconLock />
            Privacy Policy
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>
        <IconLogout />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
