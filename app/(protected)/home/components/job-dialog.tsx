"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  PhoneCall,
} from "lucide-react";
import { JobPosting } from "@/types/job-posting";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
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

interface JobDialogProps {
  job: JobPosting;
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function JobDialog({ job, isOpen, onClose }: JobDialogProps) {
  const salaryString =
    job.baseSalary?.minValue || job.baseSalary?.maxValue
      ? `${
          job.baseSalary.currency === "USD"
            ? "$"
            : job.baseSalary.currency || "$"
        }${job.baseSalary.minValue?.toLocaleString() || ""}${
          job.baseSalary.maxValue
            ? ` - ${job.baseSalary.maxValue.toLocaleString()}`
            : ""
        }/${
          job.baseSalary.unitText
            ? job.baseSalary.unitText
                .toLowerCase()
                .replace("year", "yr")
                .replace("month", "mo")
            : "mo"
        }`
      : null;

  const location =
    job.jobLocation?.rawAddress ||
    [job.jobLocation?.city, job.jobLocation?.country]
      .filter(Boolean)
      .join(", ") ||
    job.workMode ||
    "Remote";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden outline-none sm:rounded-xl bg-card">
        <div className="flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="p-6 md:p-8 bg-muted/30 border-b space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.companyName || "Company"} logo`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-semibold tracking-tight">
                    {job.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {job.companyName}
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
              {job.employmentType && (
                <Badge variant="secondary" className="font-medium">
                  {job.employmentType.replace("_", " ")}
                </Badge>
              )}
              {job.workMode && (
                <Badge variant="outline" className="font-medium">
                  {job.workMode}
                </Badge>
              )}
              {salaryString && (
                <Badge variant="outline" className="font-medium">
                  {salaryString}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 w-full">
              {job.directApplyUrl && (
                <Button
                  asChild
                  size="sm"
                  variant={"secondary"}
                  className="w-1/2"
                >
                  <Link
                    href={job.directApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="default" asChild className="w-1/2">
                <Link
                  href={`/call/practice?title=${encodeURIComponent(
                    job.title || ""
                  )}&company=${encodeURIComponent(job.companyName || "")}`}
                  className="gap-2"
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
      <DialogFooter>
        {job.datePosted && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Posted: {new Date(job.datePosted).toLocaleDateString()}</span>
          </div>
        )}
        {job.validThrough && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Expires: {new Date(job.validThrough).toLocaleDateString()}
            </span>
          </div>
        )}
      </DialogFooter>
    </Dialog>
  );
}
