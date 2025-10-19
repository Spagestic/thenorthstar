import React from "react";
import { createClient } from "@/lib/supabase/server";
import { JobCard, JobPosition } from "@/components/jobs/job-card";
import { JobFilterBar } from "@/components/jobs/job-filter-bar";
import Header from "../Header";

export const revalidate = 0;

type JobsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

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

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_positions")
    .select("*")
    .range(0, 10)
    .order("created_at", { ascending: false });

  const jobs = (data ?? []) as JobPosition[];
  const searchValue = normalizeText(
    typeof searchParams.q === "string"
      ? searchParams.q
      : Array.isArray(searchParams.q)
      ? searchParams.q[0]
      : undefined
  );
  const industryFilter = normalizeText(
    typeof searchParams.industry === "string"
      ? searchParams.industry
      : Array.isArray(searchParams.industry)
      ? searchParams.industry[0]
      : undefined
  );
  const categoryFilter = normalizeText(
    typeof searchParams.category === "string"
      ? searchParams.category
      : Array.isArray(searchParams.category)
      ? searchParams.category[0]
      : undefined
  );
  const seniorityFilter = normalizeText(
    typeof searchParams.seniority === "string"
      ? searchParams.seniority
      : Array.isArray(searchParams.seniority)
      ? searchParams.seniority[0]
      : undefined
  );

  const industries = Array.from(
    new Set(
      jobs
        .map((job) => job.industry)
        .filter((value): value is string => !!value && value.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const categories = Array.from(
    new Set(
      jobs
        .map((job) => job.category)
        .filter((value): value is string => !!value && value.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const seniorities = Array.from(
    new Set(
      jobs
        .map((job) => job.seniority_level)
        .filter((value): value is string => !!value && value.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredJobs = jobs.filter((job) => {
    const title = normalizeText(job.title);
    const company = normalizeText(job.company ?? undefined);
    const category = normalizeText(job.category);
    const industry = normalizeText(job.industry);
    const seniority = normalizeText(job.seniority_level ?? undefined);

    const requirements = extractStrings(job.typical_requirements).map((item) =>
      item.toLowerCase()
    );
    const responsibilities = extractStrings(job.typical_responsibilities).map(
      (item) => item.toLowerCase()
    );
    const skillTokens = [...requirements, ...responsibilities];

    const searchMatches =
      searchValue.length === 0 ||
      title.includes(searchValue) ||
      company.includes(searchValue) ||
      category.includes(searchValue) ||
      industry.includes(searchValue) ||
      skillTokens.some((token) => token.includes(searchValue));

    const industryMatches =
      industryFilter.length === 0 || industry === industryFilter;
    const categoryMatches =
      categoryFilter.length === 0 || category === categoryFilter;
    const seniorityMatches =
      seniorityFilter.length === 0 || seniority === seniorityFilter;

    return (
      searchMatches && industryMatches && categoryMatches && seniorityMatches
    );
  });

  return (
    <div className="container mx-auto">
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8">
        <JobFilterBar
          categories={categories}
          industries={industries}
          seniorities={seniorities}
        />

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Unable to load positions right now. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && !error && (
          <div className="py-12 text-center text-muted-foreground">
            {jobs.length === 0
              ? "Check back soon—new opportunities are on their way."
              : "No roles match the current filters. Try adjusting your search."}
          </div>
        )}
      </div>
    </div>
  );
}
