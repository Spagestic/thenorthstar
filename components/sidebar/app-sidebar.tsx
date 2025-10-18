import { Frame, Map, PieChart } from "lucide-react";
import Image from "next/image";
import type * as React from "react";
import { NavInterviews } from "@/components/sidebar/nav-interviews";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              {/** biome-ignore lint/a11y/useValidAnchor: minor*/}
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-sm text-sidebar-primary-foreground">
                  <Image
                    alt="Logo"
                    className="rounded-lg"
                    height={24}
                    src="/logo_light.svg"
                    width={24}
                  />
                </div>
                <div className="grid flex-1 text-left text-md leading-tight">
                  <span className="truncate font-semibold">NorthStar</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavInterviews />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
