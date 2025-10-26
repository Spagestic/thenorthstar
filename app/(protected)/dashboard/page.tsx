import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../Header";
import { JobCard } from "@/app/(protected)/dashboard/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { JobSearchBar } from "@/app/(protected)/dashboard/job-search-bar";
import { JobsFilters } from "@/app/(protected)/dashboard/jobs-filters-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { jobSearchParamsCache } from "./searchParams";
import type { SearchParams } from "nuqs/server";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function page({ searchParams }: PageProps) {
  // Parse search params using nuqs cache
  const params = await jobSearchParamsCache.parse(searchParams);

  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8 overflow-y-auto">
        <div className="w-full">
          <JobSearchBar />
        </div>
        <div className="w-full mb-4">
          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[160px]" />
                </div>
              </div>
            }
          >
            <JobsFilters />
          </Suspense>
        </div>
        <Suspense
          key={JSON.stringify(params)}
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <JobCardSkeleton count={9} />
            </div>
          }
        >
          <JobList />
        </Suspense>
      </div>
    </div>
  );
}

async function JobList() {
  // Access parsed search params from the cache
  const { search, industry, company, seniority } = jobSearchParamsCache.all();

  const supabase = await createClient();

  let query = supabase.from("job_positions").select(`
    id, title, category, seniority_level, typical_requirements, 
    typical_responsibilities, industry_id, company_id,
    companies!inner (name),
    industry!inner (name)
  `);

  // Apply filters based on parsed search params
  if (industry) {
    query = query.eq("industry.name", industry);
  }

  if (company) {
    query = query.eq("companies.name", company);
  }

  if (seniority) {
    query = query.eq("seniority_level", seniority);
  }

  // TEXT SEARCH feature!
  if (search) {
    query = query.textSearch("title", search, { config: "english" });
  }

  const { data, error } = await query.limit(45);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No jobs found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {data.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
