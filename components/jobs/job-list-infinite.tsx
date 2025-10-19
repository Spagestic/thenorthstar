"use client";

import { JobCard, JobPosition } from "@/components/jobs/job-card";
import { InfiniteList } from "@/components/jobs/infinite-job-list";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { SupabaseQueryHandler } from "@/hooks/use-infinite-query";

interface JobListInfiniteProps {
  searchValue: string;
  industryFilter: string;
  categoryFilter: string;
  seniorityFilter: string;
}

const normalizeText = (value: string | null | undefined) =>
  value?.toLowerCase().trim() ?? "";

const extractStrings = (value: unknown): string[] => {
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

export function JobListInfinite({
  searchValue,
  industryFilter,
  categoryFilter,
  seniorityFilter,
}: JobListInfiniteProps) {
  const trailingQuery: SupabaseQueryHandler<"job_positions"> = (query) => {
    let filteredQuery = query.order("created_at", { ascending: false });

    // Apply server-side filters when possible
    if (industryFilter) {
      filteredQuery = filteredQuery.ilike("industry", industryFilter);
    }
    if (categoryFilter) {
      filteredQuery = filteredQuery.ilike("category", categoryFilter);
    }
    if (seniorityFilter) {
      filteredQuery = filteredQuery.ilike("seniority_level", seniorityFilter);
    }

    return filteredQuery;
  };

  const matchesClientFilters = (job: JobPosition) => {
    if (!searchValue) return true;

    const title = normalizeText(job.title);
    const company = normalizeText(job.company ?? undefined);
    const category = normalizeText(job.category);
    const industry = normalizeText(job.industry);

    const requirements = extractStrings(job.typical_requirements).map((item) =>
      item.toLowerCase()
    );
    const responsibilities = extractStrings(job.typical_responsibilities).map(
      (item) => item.toLowerCase()
    );
    const skillTokens = [...requirements, ...responsibilities];

    return (
      title.includes(searchValue) ||
      company.includes(searchValue) ||
      category.includes(searchValue) ||
      industry.includes(searchValue) ||
      skillTokens.some((token) => token.includes(searchValue))
    );
  };

  return (
    <InfiniteList
      tableName="job_positions"
      columns="*"
      pageSize={12}
      trailingQuery={trailingQuery}
      renderItem={(job: JobPosition, index) => {
        // Apply client-side search filter
        if (!matchesClientFilters(job)) {
          return null;
        }

        return <JobCard job={job} />;
      }}
      renderSkeleton={(count) => <JobCardSkeleton count={count} />}
      renderNoResults={() => (
        <div className="py-12 text-center text-muted-foreground">
          No roles match the current filters. Try adjusting your search.
        </div>
      )}
      renderEndMessage={() => (
        <div className="py-8 text-center text-muted-foreground text-sm">
          You&apos;ve reached the end of the list.
        </div>
      )}
    />
  );
}
