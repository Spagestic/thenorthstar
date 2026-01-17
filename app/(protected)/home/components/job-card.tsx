"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Bookmark,
  MapPin,
  Building2,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { JobPosting } from "@/types/job-posting";
import Link from "next/link";
import { JobDialog } from "./job-dialog";
import {
  formatEmploymentType,
  formatWorkMode,
  formatTimeAgo,
} from "@/lib/utils";

function joinMeta(parts: Array<string | null | undefined>, sep = " · ") {
  return parts.filter(Boolean).join(sep);
}

export function JobCard({ job }: { job: JobPosting }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const timeAgo = formatTimeAgo(job.datePosted);
  const employmentType = formatEmploymentType(job.employmentType);

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

  const firstLocation = job.jobLocations?.[0];
  const locationText =
    firstLocation?.rawAddress ||
    [firstLocation?.city, firstLocation?.country].filter(Boolean).join(", ") ||
    formatWorkMode(job.workMode) ||
    "Remote";

  const additionalLocationsCount = (job.jobLocations?.length || 0) - 1;
  const location =
    additionalLocationsCount > 0
      ? `${locationText} +${additionalLocationsCount} more`
      : locationText;

  return (
    <div>
      <JobDialog
        job={job}
        isOpen={isDialogOpen}
        onClose={(open) => setIsDialogOpen(open)}
      />
      <Card
        className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent>
          <div className="flex items-start gap-2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 overflow-hidden">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={`${job.companyName || "Company"} logo`}
                  className="h-full w-full object-contain"
                />
              ) : job.companyName ? (
                <span className="text-sm font-bold text-muted-foreground select-none">
                  {job.companyName.charAt(0)}
                </span>
              ) : (
                <Building2 className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              {/* Single line header: company + title */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 text-sm font-semibold text-foreground/90 leading-5 truncate">
                  {(job.companyName || "Unknown Company") + "  "}
                  <span className="block min-w-0 font-bold text-foreground truncate">
                    {job.title}
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {joinMeta([employmentType, locationText, timeAgo])}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-card/80 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      // bookmark logic
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="">
          {job.directApplyUrl && (
            <div className="pt-2 border-t border-border flex gap-2 w-full">
              <Button
                size="sm"
                asChild
                className="w-1/2"
                variant={"secondary"}
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={job.directApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant={"default"}
                size="sm"
                asChild
                className="w-1/2"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={"#"}>
                  <PhoneCall className="h-4 w-4" />
                  Practice
                </Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
