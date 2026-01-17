"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  PhoneIcon,
  BookmarkIcon,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCompanyLogo } from "@/lib/company-logos";
import type { JobCardData } from "./job-card";

interface JobDialogProps {
  job: JobCardData;
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function JobDialog({ job, isOpen, onClose }: JobDialogProps) {
  // @ts-ignore
  const company = job.companies;
  // @ts-ignore
  const industryName =
    job.industry?.name ||
    (Array.isArray(job.industry) ? job.industry[0]?.name : null);

  const companyName = company?.name;
  const companyLogo =
    company?.logo_url || (companyName ? getCompanyLogo(companyName) : null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] p-0 flex flex-col gap-0 overflow-hidden outline-none sm:rounded-xl">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-8 space-y-6">
              <div className="space-y-4">
                <DialogTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                  {job.title}
                </DialogTitle>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{companyName}</span>
                  </div>
                  <span className="hidden sm:inline-block w-1 h-1 bg-border rounded-full" />
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{industryName}</span>
                  </div>
                  <span className="hidden sm:inline-block w-1 h-1 bg-border rounded-full" />
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    {job.seniority_level}
                  </span>
                </div>
              </div>
            </DialogHeader>

            <div className="flex items-center gap-3 mb-10">
              <Link href={`/call/${job.id}`} className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full font-medium shadow-sm transition-all"
                  variant="default"
                >
                  <PhoneIcon className="mr-0 h-4 w-4" />
                  Start Interview
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-4 text-muted-foreground hover:text-foreground"
              >
                <BookmarkIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6 py-8 border-y bg-accent/5 -mx-6 md:-mx-8 px-6 md:px-8">
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-2">
                  Category
                </p>
                <p className="text-foreground">{job.category || "—"}</p>
              </div>
              {/* You can add Location or Salary here if available in your data */}
            </div>

            <div className="space-y-10">
              <SectionList
                title="Requirements"
                items={job.typical_requirements}
              />
              <SectionList
                title="Responsibilities"
                items={job.typical_responsibilities}
              />
            </div>

            {company && (
              <section className="pt-10 border-t mt-12">
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border shadow-sm p-2">
                    {companyLogo ? (
                      <Image
                        alt={`${companyName || "Company"} logo`}
                        className="h-full w-full object-contain"
                        fill
                        src={companyLogo}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-lg font-semibold mb-1">
                      {companyName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Est. {company.founded_year || "—"}</span>
                      {company.website && (
                        <>
                          <span className="w-1 h-1 bg-border rounded-full" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
                          >
                            Visit Website
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {company.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground/90 mb-8 max-w-2xl">
                    {company.description}
                  </p>
                )}

                {company.values && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Values
                      </p>
                      <ValuesList values={company.values} />
                    </div>
                    {company.culture && (
                      <div>
                        <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                          Culture
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground/90">
                          {company.culture}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
            <div className="h-8" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionList({ title, items }: { title: string; items: unknown }) {
  const list: string[] = normalizeList(items);
  if (list.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-4 flex items-center gap-2">
        {title}
      </h2>
      <ul className="space-y-3">
        {list.map((item, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
            <span className="text-sm leading-relaxed text-foreground/90">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ValuesList({ values }: { values: unknown }) {
  const list = normalizeList(values);
  if (list.length === 0)
    return <p className="text-sm text-muted-foreground">—</p>;

  return (
    <ul className="space-y-2">
      {list.map((value, i) => (
        <li
          key={i}
          className="text-sm text-muted-foreground/90 flex items-start gap-2"
        >
          <span className="text-primary/60">•</span>
          <span>{value}</span>
        </li>
      ))}
    </ul>
  );
}

const normalizeList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === "string"
        );
      }
    } catch {
      return [value];
    }
    return [value];
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).filter(
      (item): item is string => typeof item === "string"
    );
  }
  return [];
};
