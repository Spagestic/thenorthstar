import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, MapPin, Building2 } from "lucide-react";
import { JobPosting } from "@/types/job-posting";
import Link from "next/link";

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

  const location =
    job.jobLocation?.rawAddress ||
    [job.jobLocation?.city, job.jobLocation?.country]
      .filter(Boolean)
      .join(", ") ||
    job.workMode ||
    "Remote";

  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:shadow-md transition-all duration-300 rounded-xl">
      <CardContent>
        <div className="flex items-start justify-center gap-4">
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
                <h3 className="text-sm font-semibold text-foreground/90 truncate">
                  {job.companyName || "Unknown Company"}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 -mt-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-full"
              >
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Bookmark</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h2 className="text-base font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {job.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-foreground/80">
            {salaryString && (
              <>
                <span className="font-medium">{salaryString}</span>
                <span>·</span>
              </>
            )}
            {employmentType && (
              <span className="font-medium">{employmentType} job</span>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground pt-1">
            <MapPin className="inline-block w-4 h-4 mr-1" />
            <span className="truncate">{location}</span>
            {timeAgo && (
              <>
                <span>·</span>
                <span>{timeAgo}</span>
              </>
            )}
          </div>
        </div>
        {job.directApplyUrl && (
          <div className="mt-4 pt-4 border-t border-border flex gap-2 w-full">
            <Button size="sm" asChild className="w-1/2" variant={"secondary"}>
              <Link
                href={job.directApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </Link>
            </Button>
            <Button variant={"default"} size="sm" asChild className="w-1/2">
              <Link href={"#"}>Practice Interview</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
