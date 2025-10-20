import React from "react";
import { createClient } from "@/lib/supabase/server";
import { JobFilterBar } from "@/components/jobs/job-filter-bar";
import { JobListInfinite } from "@/components/jobs/job-list-infinite";
import { JobPosition } from "@/components/jobs/job-card";
import Header from "../Header";

export const revalidate = 0;

export default async function JobsPage() {
  const supabase = await createClient();

  // Fetch all industries directly from the industry table
  const { data: industriesData } = await supabase
    .from("industry")
    .select("name")
    .order("name", { ascending: true });

  // Fetch all companies directly from the companies table
  const { data: companiesData } = await supabase
    .from("companies")
    .select("name")
    .order("name", { ascending: true });

  // Fetch distinct categories and seniority levels from job_positions
  const { data: jobsData } = await supabase
    .from("job_positions")
    .select("category, seniority_level")
    .order("created_at", { ascending: false });

  const jobs = (jobsData ?? []) as any[];

  const industries = (industriesData ?? [])
    .map((ind) => ind.name)
    .filter((value): value is string => !!value && value.trim().length > 0);

  const companies = (companiesData ?? [])
    .map((comp) => comp.name)
    .filter((value): value is string => !!value && value.trim().length > 0);

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
          companies={companies}
        />

        <JobListInfinite />
      </div>
    </div>
  );
}
