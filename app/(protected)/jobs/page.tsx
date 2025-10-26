import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../Header";
import { JobCard } from "@/app/(protected)/jobs/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { JobSearchBar } from "@/app/(protected)/jobs/job-search-bar";
import { JobsFilters } from "@/app/(protected)/jobs/jobs-filters-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function page({ searchParams }: PageProps) {
  const params = await searchParams;

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
          <JobList searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

interface JobListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function JobList({ searchParams }: JobListProps) {
  const supabase = await createClient();

  let query = supabase.from("job_positions").select(`
    id, title, category, seniority_level, typical_requirements, 
    typical_responsibilities, industry_id, company_id,
    companies!inner (name),
    industry!inner (name)
  `);

  // generic field map for filters
  const fieldMap: Record<string, string> = {
    industry: "industry.name",
    category: "category",
    seniority: "seniority_level",
    company: "companies.name",
  };

  // Filters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && fieldMap[key]) {
      if (Array.isArray(value)) {
        query = query.in(fieldMap[key], value);
      } else {
        query = query.eq(fieldMap[key], value as string);
      }
    }
  });

  // TEXT SEARCH feature!
  if (searchParams.search) {
    query = query.textSearch(
      "title", // Change to the text column you want to search (e.g., 'title', 'typical_requirements')
      searchParams.search as string,
      { config: "english" } // optional: specify search config
    );
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
