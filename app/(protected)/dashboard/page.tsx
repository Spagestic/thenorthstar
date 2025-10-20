import React from "react";
import { createClient } from "@/lib/supabase/server";
import { JobFilterBar } from "@/components/jobs/job-filter-bar";
import { JobListInfinite } from "@/components/jobs/job-list-infinite";
import { JobPosition } from "@/components/jobs/job-card";
import Header from "../Header";

export const revalidate = 0;

export default async function JobsPage() {
  const supabase = await createClient();

  // Fetch initial data for filter options with joined tables
  const { data } = await supabase
    .from("job_positions")
    .select(
      `
      category,
      seniority_level,
      industry:industry_id(name),
      company:company_id(name)
    `
    )
    .order("created_at", { ascending: false });

  const jobs = (data ?? []) as any[];

  const industries = Array.from(
    new Set(
      jobs
        .map((job) => {
          // Handle both array and single object responses
          if (Array.isArray(job.industry)) {
            return job.industry[0]?.name;
          }
          return job.industry?.name;
        })
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

  const companies = Array.from(
    new Set(
      jobs
        .map((job) => {
          // Handle both array and single object responses
          if (Array.isArray(job.company)) {
            return job.company[0]?.name;
          }
          return job.company?.name;
        })
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
          companies={companies}
        />

        <JobListInfinite />
      </div>
    </div>
  );
}
