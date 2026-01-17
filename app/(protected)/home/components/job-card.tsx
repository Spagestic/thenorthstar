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

function formatTimeAgo(dateString?: string | null) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(date.getTime())) return null;

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} months ago`;
}

function formatEmploymentType(type?: string | null) {
  if (!type) return null;
  const mapping: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERN: "Internship",
    TEMPORARY: "Temporary",
    VOLUNTEER: "Volunteer",
    OTHER: "Other",
  };
  return mapping[type] || type;
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
    job.workMode ||
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
        className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 overflow-hidden">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={`${job.companyName || "Company"} logo`}
                  className="h-full w-full object-contain"
                />
              ) : job.companyName ? (
                <span className="text-xl font-bold text-muted-foreground select-none">
                  {job.companyName.charAt(0)}
                </span>
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-foreground/90 truncate">
                    {job.companyName || "Unknown Company"}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2 -mt-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Bookmark logic could go here
                  }}
                >
                  <Bookmark className="h-6 w-6" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {/* Title: always 1 line */}
            <h2 className="text-base font-bold leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {job.title}
            </h2>

            {/* Meta row: also 1 line so it doesn’t wrap and change height */}
            <div className="text-sm text-foreground/80 line-clamp-1">
              {salaryString && (
                <span className="font-medium">{salaryString}</span>
              )}
              {salaryString && employmentType && <span> · </span>}
              {employmentType && (
                <span className="font-medium">{employmentType} job</span>
              )}
            </div>

            {/* Location/time: keep to 1 line too */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1 min-w-0">
                {location}
                {timeAgo ? ` • ${timeAgo}` : ""}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {job.directApplyUrl && (
            <div className="pt-4 border-t border-border flex gap-2 w-full">
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
