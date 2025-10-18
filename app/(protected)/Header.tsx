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

type HeaderProps = {
  nav?: string[];
};

export default function Header({ nav }: HeaderProps) {
  // Fallback to default nav if not provided
  const items = nav && nav.length > 0 ? nav : ["Dashboard"];

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
                <React.Fragment key={item}>
                  <BreadcrumbItem className={showHidden}>
                    {isLast ? (
                      <BreadcrumbPage>{item}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item}
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
