"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, ExternalLink, PhoneCall } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useMemo } from "react";
import {
  formatEmploymentType,
  formatWorkMode,
  formatSalary,
  formatLocation,
  getCompanyLogoUrl,
} from "@/lib/utils";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographyList,
  TypographyInlineCode,
  TypographyTable,
} from "@/components/ui/typography";

type JobRow = Database["public"]["Tables"]["job_postings"]["Row"];
interface JobDialogProps {
  job: JobRow;
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function JobDialog({ job, isOpen, onClose }: JobDialogProps) {
  const salary = useMemo(
    () =>
      formatSalary({
        minValue: job.salary_min,
        maxValue: job.salary_max,
        currency: job.salary_currency,
        unitText: job.salary_period,
      }),
    [job.salary_min, job.salary_max, job.salary_currency, job.salary_period],
  );
  const location = useMemo(() => formatLocation(job.location), [job.location]);
  const employmentType = formatEmploymentType(job.employment_type);
  const workMode = formatWorkMode(job.work_mode);
  const logoUrl = getCompanyLogoUrl(job.company_domain);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden outline-none sm:rounded-xl bg-card">
        <div className="flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="p-6 md:p-8 bg-muted/30 border-b space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                        (
                          e.currentTarget.nextElementSibling as HTMLElement
                        )?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <span
                    className={`text-sm font-semibold text-muted-foreground select-none ${logoUrl ? "hidden" : ""}`}
                  >
                    {(job.company_name || "C").charAt(0)}
                  </span>
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-semibold tracking-tight">
                    {job.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {job.company_name}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {employmentType && (
                <Badge variant="secondary" className="font-medium">
                  {employmentType}
                </Badge>
              )}
              {workMode && (
                <Badge variant="outline" className="font-medium">
                  {workMode}
                </Badge>
              )}
              {salary && (
                <Badge variant="outline" className="font-medium">
                  {salary}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 w-full">
              {job.direct_apply_url && (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                >
                  <Link
                    href={job.direct_apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="default" asChild className="flex-1">
                <Link
                  href={`/interview/${job.id}?company=${encodeURIComponent(job.company_name)}&job=${encodeURIComponent(job.title)}`}
                >
                  <PhoneCall className="h-4 w-4" />
                  Practice
                </Link>
              </Button>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <section className="max-w-none text-muted-foreground">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <TypographyH1 className="text-left [&_strong]:font-inherit">
                      {children}
                    </TypographyH1>
                  ),
                  h2: ({ children }) => (
                    <TypographyH2 className="[&_strong]:font-inherit">
                      {children}
                    </TypographyH2>
                  ),
                  h3: ({ children }) => (
                    <TypographyH3 className="[&_strong]:font-inherit">
                      {children}
                    </TypographyH3>
                  ),
                  h4: ({ children }) => (
                    <TypographyH4 className="[&_strong]:font-inherit">
                      {children}
                    </TypographyH4>
                  ),
                  p: ({ children }) => <TypographyP>{children}</TypographyP>,
                  blockquote: ({ children }) => (
                    <TypographyBlockquote>{children}</TypographyBlockquote>
                  ),
                  ul: ({ children }) => (
                    <TypographyList>{children}</TypographyList>
                  ),
                  ol: ({ children }) => (
                    <TypographyList className="list-decimal">
                      {children}
                    </TypographyList>
                  ),
                  code: ({ children }) => (
                    <TypographyInlineCode>{children}</TypographyInlineCode>
                  ),
                  table: ({ children }) => (
                    <TypographyTable>{children}</TypographyTable>
                  ),
                }}
              >
                {job.description || "No description available."}
              </ReactMarkdown>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
