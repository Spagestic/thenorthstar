"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  userName?: string | null;
  userEmail?: string | null;
  userImageUrl?: string | null;
  className?: string;
};

export function UserAvatar({
  userName,
  userEmail,
  userImageUrl,
  className,
}: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="group h-auto rounded-full p-0 hover:bg-transparent"
          variant="ghost"
        >
          <Avatar className="ring-offset-background transition-all group-hover:ring-2 group-hover:ring-secondary">
            <AvatarImage
              alt="Profile image"
              src={userImageUrl || "./avatar.png"}
            />
            <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`max-w-64 ${className}`}>
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            {userName}
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            {userEmail}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
