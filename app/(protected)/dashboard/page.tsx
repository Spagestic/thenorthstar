import React from "react";
import { createClient } from "@/lib/supabase/server";
import { JobFilterBar } from "@/components/jobs/job-filter-bar";
import { JobListInfinite } from "@/components/jobs/job-list-infinite";
import { JobPosition } from "@/components/jobs/job-card";
import Header from "../Header";

export const revalidate = 0;

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const normalizeText = (value: string | null | undefined) =>
  value?.toLowerCase().trim() ?? "";

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();

  // Fetch initial data for filter options
  const { data } = await supabase
    .from("job_positions")
    .select("industry, category, seniority_level")
    .order("created_at", { ascending: false });

  const jobs = (data ?? []) as Partial<JobPosition>[];

  const searchValue = normalizeText(
    typeof resolvedSearchParams.q === "string"
      ? resolvedSearchParams.q
      : Array.isArray(resolvedSearchParams.q)
      ? resolvedSearchParams.q[0]
      : undefined
  );
  const industryFilter = normalizeText(
    typeof resolvedSearchParams.industry === "string"
      ? resolvedSearchParams.industry
      : Array.isArray(resolvedSearchParams.industry)
      ? resolvedSearchParams.industry[0]
      : undefined
  );
  const categoryFilter = normalizeText(
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : Array.isArray(resolvedSearchParams.category)
      ? resolvedSearchParams.category[0]
      : undefined
  );
  const seniorityFilter = normalizeText(
    typeof resolvedSearchParams.seniority === "string"
      ? resolvedSearchParams.seniority
      : Array.isArray(resolvedSearchParams.seniority)
      ? resolvedSearchParams.seniority[0]
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

  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8 overflow-hidden">
        <JobFilterBar
          categories={categories}
          industries={industries}
          seniorities={seniorities}
        />

        <JobListInfinite
          searchValue={searchValue}
          industryFilter={industryFilter}
          categoryFilter={categoryFilter}
          seniorityFilter={seniorityFilter}
        />
      </div>
    </div>
  );
}
