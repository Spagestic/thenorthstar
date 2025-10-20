"use client";
import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { jobPositions } from "@/components/sidebar/job-positions";
import { getCompanyLogo } from "@/lib/company-logos";

const interviews = jobPositions.map((job) => ({
  name: job.title,
  company: job.company,
  logo: getCompanyLogo(job.company),
  url: "#",
}));

export function NavInterviews() {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Interviews</SidebarGroupLabel>
      <SidebarMenu>
        {interviews.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <Image
                  src={item.logo?.src || ""}
                  alt={item.company}
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? "end" : "start"}
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Interview</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Interview</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Interview</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
