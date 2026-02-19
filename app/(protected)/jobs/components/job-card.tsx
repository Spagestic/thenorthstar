"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Phone } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";
import { JobDialog } from "./job-dialog";
import {
  formatTimeAgo,
  formatEmploymentType,
  formatWorkMode,
  formatSalary,
  formatLocation,
} from "@/lib/utils";
import { getCompanyLogoUrl } from "@/lib/utils";
type JobRow = Database["public"]["Tables"]["job_postings"]["Row"];

export function JobCard({ job }: { job: JobRow }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const timeAgo = formatTimeAgo(job.posted_at);
  const employmentType = formatEmploymentType(job.employment_type);
  const logoUrl = getCompanyLogoUrl(job.company_domain);
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
  return (
    <>
      <JobDialog job={job} isOpen={isDialogOpen} onClose={setIsDialogOpen} />

      <Card
        onClick={() => setIsDialogOpen(true)}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/95 shadow-sm transition hover:shadow-lg cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
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

              <div className="min-w-0">
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {job.company_name || "Company"}
                  {timeAgo ? ` • ${timeAgo}` : ""}
                </div>
              </div>
            </div>

            {/* Saved button (pill) */}
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-xl px-3 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSaved((s) => !s);
              }}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </Button>
          </div>
          {/* Title */}
          <div className="mt-3">
            <h2 className="text-2xl font-semibold tracking-tight leading-tight line-clamp-2 h-[2.5em]">
              {job.title}
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {/* Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {employmentType && (
              <span className="inline-flex items-center rounded-xl bg-muted px-3 py-1 text-sm text-foreground/80">
                {employmentType}
              </span>
            )}
            {job.work_mode && (
              <span className="inline-flex items-center rounded-xl bg-muted px-3 py-1 text-sm text-foreground/80">
                {formatWorkMode(job.work_mode)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="my-5 h-px w-full bg-border" />

          {/* Bottom row */}
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              {salary && <div className="font-semibold truncate">{salary}</div>}
              <div className="text-sm text-muted-foreground line-clamp-1">
                {location}
              </div>
            </div>

            <Button
              asChild
              className="h-10 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link
                href={`/interview/${job.id}?company=${encodeURIComponent(job.company_name)}&job=${encodeURIComponent(job.title)}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="size-4" />
                Practice
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
