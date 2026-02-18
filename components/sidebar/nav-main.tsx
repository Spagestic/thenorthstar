import { ChartColumnBig, Home, LayoutGrid } from "lucide-react";

import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenuButton asChild tooltip={"Dashboard"}>
        <a href="/dashboard">
          <Home />
          <span>Dashboard</span>
        </a>
      </SidebarMenuButton>
      <SidebarMenuButton asChild tooltip={"Analytics"}>
        <a href="/jobs">
          <LayoutGrid />
          <span>Explore Jobs</span>
        </a>
      </SidebarMenuButton>
      <SidebarMenuButton asChild tooltip={"Analytics"}>
        <a href="/analytics">
          <ChartColumnBig />
          <span>Analytics</span>
        </a>
      </SidebarMenuButton>
    </SidebarGroup>
  );
}
