import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type NavItem = {
  label: string;
  href?: string;
};

type HeaderProps = {
  nav?: (string | NavItem)[];
};

export default function Header({ nav }: HeaderProps) {
  // Fallback to default nav if not provided
  const rawItems = nav && nav.length > 0 ? nav : ["Dashboard"];

  // Normalize items to NavItem format
  const items: NavItem[] = rawItems.map((item) => {
    if (typeof item === "string") {
      return {
        label: item,
        href: `/${item.toLowerCase().replace(/\s+/g, "-")}`,
      };
    }
    return item;
  });

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              const showHidden =
                items.length > 1 && idx === 0 ? "hidden md:block" : undefined;
              return (
                <React.Fragment key={item.label}>
                  <BreadcrumbItem className={showHidden}>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className={showHidden} />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
