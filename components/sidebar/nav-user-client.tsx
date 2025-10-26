"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";

type NavUserClientProps = {
  user: {
    name?: string;
    email?: string;
    imageUrl?: string;
  };
};

export function NavUserClient({ user }: NavUserClientProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.imageUrl || ""} alt={user.name || ""} />
            <AvatarFallback className="rounded-lg">
              {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <UserDropdown user={user} />
    </DropdownMenu>
  );
}
