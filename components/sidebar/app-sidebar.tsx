import Image from "next/image";
import type * as React from "react";
import { Suspense } from "react";
import { NavInterviews } from "@/components/sidebar/nav-interviews";
import { NavMain } from "@/components/sidebar/nav-main";
import { LoadingUser, NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavInterviewsSkeleton } from "./nav-interviews-skeleton";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              {/** biome-ignore lint/a11y/useValidAnchor: minor*/}
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-sm text-sidebar-primary-foreground">
                  <Image
                    alt="Logo"
                    className="rounded-lg"
                    height={24}
                    src="/logo_light.png"
                    width={24}
                  />
                </div>
                <div className="grid flex-1 text-left text-md leading-tight">
                  <span className="truncate font-semibold">Ovoxa</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <Suspense fallback={<NavInterviewsSkeleton />}>
          <NavInterviews />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<LoadingUser />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
