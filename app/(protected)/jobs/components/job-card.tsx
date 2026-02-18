"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Phone } from "lucide-react";
import { JobPosting } from "@/types/job-posting";
import { JobDialog } from "./job-dialog";
import {
  formatTimeAgo,
  formatEmploymentType,
  formatWorkMode,
  formatSalary,
  formatLocation,
} from "@/lib/utils";

export function JobCard({ job }: { job: JobPosting }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const timeAgo = formatTimeAgo(job.datePosted);
  const employmentType = formatEmploymentType(job.employmentType);
  const salary = useMemo(() => formatSalary(job), [job]);
  const location = useMemo(() => formatLocation(job), [job]);

  return (
    <div>
      <JobDialog
        job={job}
        isOpen={isDialogOpen}
        onClose={(open) => setIsDialogOpen(open)}
      />

      <Card
        onClick={() => setIsDialogOpen(true)}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/95 shadow-sm transition hover:shadow-lg cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={`${job.companyName || "Company"} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground select-none">
                    {(job.companyName || "C").slice(0, 1)}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {job.companyName || "Company"}
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
            {job.workMode && (
              <span className="inline-flex items-center rounded-xl bg-muted px-3 py-1 text-sm text-foreground/80">
                {formatWorkMode(job.workMode)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="my-5 h-px w-full bg-border" />

          {/* Bottom row */}
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="h-6 font-semibold truncate">{salary || null}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {location}
              </div>
            </div>

            <Button
              className="h-10 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
            >
              <Phone className="size-4" />
              Practice
            </Button>
            {/* {job.directApplyUrl ? (
              <Button
                asChild
                className="h-10 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={job.directApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply now
                </Link>
              </Button>
            ) : (
              <Button
                className="h-10 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                Apply now
              </Button>
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
