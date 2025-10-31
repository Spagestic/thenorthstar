import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2 } from "lucide-react";
import { getCompanyLogo } from "@/lib/company-logos";

export interface JobCardData {
  id: string;
  title: string;
  category: string | null;
  seniority_level: string | null;
  typical_requirements: unknown;
  typical_responsibilities: unknown;
  company_id: string | null;
  industry_id: string | null;
  // Joined relations
  companies: Array<{ name: string }>;
  industry: Array<{ name: string }>;
}

interface JobCardProps {
  job: JobCardData;
}

const normalizeList = (value: unknown): string[] => {
  // Convert heterogeneous JSON payloads into a string array that can be displayed.
  if (!value) {
    return [];
  }

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

const getSeniorityBadgeStyles = (level: string | null): string => {
  if (!level) {
    return "bg-muted text-muted-foreground";
  }

  switch (level.toLowerCase()) {
    case "entry":
    case "entry level":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200";
    case "mid":
    case "mid level":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
    case "senior":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200";
    case "lead":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const requirements = normalizeList(job.typical_requirements);
  const responsibilities = normalizeList(job.typical_responsibilities);
  // @ts-ignore
  const companyName = job.companies?.name || null;
  const companyLogo = companyName ? getCompanyLogo(companyName) : null;
  // @ts-ignore
  const industryName = job.industry?.name || null;

  return (
    <Card className="group flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-accent/20 aspect-square p-8">
              {companyLogo ? (
                <Image
                  alt={`${companyName || "Company"} logo`}
                  className="h-full w-full object-contain"
                  fill
                  src={companyLogo}
                />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg transition-colors group-hover:text-primary">
                {job.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {companyName || "Company coming soon"}
                {industryName ? ` • ${industryName}` : ""}
              </CardDescription>
              {job.category && (
                <p className="text-xs text-muted-foreground">{job.category}</p>
              )}
            </div>
          </div>
          {job.seniority_level && (
            <Badge
              className={`${getSeniorityBadgeStyles(
                job.seniority_level
              )} text-xs`}
            >
              {job.seniority_level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <div className="flex-1 space-y-4">
          {requirements.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Requirements
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {requirements.slice(0, 3).map((item, index) => (
                  <li
                    className="flex items-start gap-2"
                    key={`${job.id}-req-${index}`}
                  >
                    <CheckCircle2 className="h-3 w-3 shrink-0 self-center text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {responsibilities.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Responsibilities
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {responsibilities.slice(0, 3).map((item, index) => (
                  <li
                    className="flex items-start gap-2 "
                    key={`${job.id}-resp-${index}`}
                  >
                    <CheckCircle2 className="h-3 w-3 shrink-0 self-center text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button asChild className="w-full" size="sm">
          {/*  */}
          <Link
            href={`/call/${job.id}?industry=${industryName}&company=${job.companies?.name}&job=${job.title}`}
          >
            Start Interview
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
