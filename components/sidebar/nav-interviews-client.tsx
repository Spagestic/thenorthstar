"use client";

import { useState } from "react";
import { Download, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import { IconPin, IconArchive } from "@tabler/icons-react";
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
import { getCompanyLogoUrl } from "@/lib/utils";

type Interview = {
  id: string;
  conversationId: string;
  name: string;
  company: string;
  domain: string | null;
  companyLogoUrl: string | null;
  url: string;
  startedAt: string | null;
};

type NavInterviewsClientProps = {
  interviews: Interview[];
};

function InterviewNavAvatar({
  domain,
  companyLogoUrl,
  companyName,
}: {
  domain: string | null;
  companyLogoUrl: string | null;
  companyName: string;
}) {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getCompanyLogoUrl(domain, companyLogoUrl);
  const showLogo = Boolean(logoUrl && !logoError);

  return (
    <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
      {showLogo ? (
        <img
          src={logoUrl!}
          alt=""
          className="size-full object-cover"
          loading="lazy"
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="text-[10px] font-semibold text-muted-foreground select-none">
          {(companyName || "C").charAt(0)}
        </span>
      )}
    </span>
  );
}

export function NavInterviewsClient({ interviews }: NavInterviewsClientProps) {
  const { isMobile } = useSidebar();

  if (interviews.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Interviews</SidebarGroupLabel>
        <div className="px-2 py-4 text-sm text-muted-foreground">
          No interviews yet
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Interviews</SidebarGroupLabel>
      <SidebarMenu>
        {interviews.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <InterviewNavAvatar
                  domain={item.domain}
                  companyLogoUrl={item.companyLogoUrl}
                  companyName={item.company}
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
                  <IconPin className="text-muted-foreground" />
                  <span>Pin Interview</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconArchive className="text-muted-foreground" />
                  <span>Archive Interview</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Interview</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="text-muted-foreground" />
                  <span>Download Interview</span>
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
