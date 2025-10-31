import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../Header";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { JobSearchBar } from "@/components/jobs/job-search-bar";
import { JobsFilters } from "@/components/jobs/jobs-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { jobSearchParamsCache } from "@/components/jobs/searchParams";
import type { SearchParams } from "nuqs/server";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function page({ searchParams }: PageProps) {
  // Parse search params using nuqs cache
  const params = await jobSearchParamsCache.parse(searchParams);

  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Sticky search and filters section */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="p-4 pt-8 space-y-4">
            <div className="w-full">
              <JobSearchBar />
            </div>
            <div className="w-full">
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
          </div>
        </div>

        {/* Scrollable job list */}
        <div className="flex-1 overflow-y-auto p-4">
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
          <Suspense fallback={<div className="h-12" />}>
            <JobPagination className="pt-8" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function JobList() {
  // Access parsed search params from the cache
  const { search, industry, company, seniority, page } =
    jobSearchParamsCache.all();

  const supabase = await createClient();
  const PAGE_SIZE = 9;

  // Calculate pagination range
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from("job_positions").select(
    `
    id, title, category, seniority_level, typical_requirements, 
    typical_responsibilities, industry_id, company_id,
    companies!inner (name),
    industry!inner (name)
  `,
    { count: "exact" }
  );

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

  const { data, error, count } = await query.range(from, to);

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

async function JobPagination({ className }: { className?: string }) {
  // Access parsed search params from the cache
  const { search, industry, company, seniority, page } =
    jobSearchParamsCache.all();

  const supabase = await createClient();
  const PAGE_SIZE = 9;

  let countQuery = supabase.from("job_positions").select(
    `
    id,
    companies!inner (name),
    industry!inner (name)
  `,
    { count: "exact", head: true }
  );

  // Apply the same filters to get accurate count
  if (industry) {
    countQuery = countQuery.eq("industry.name", industry);
  }

  if (company) {
    countQuery = countQuery.eq("companies.name", company);
  }

  if (seniority) {
    countQuery = countQuery.eq("seniority_level", seniority);
  }

  if (search) {
    countQuery = countQuery.textSearch("title", search, { config: "english" });
  }

  const { count } = await countQuery;
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  // Build query params for navigation
  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (industry) params.set("industry", industry);
    if (company) params.set("company", company);
    if (seniority) params.set("seniority", seniority);
    if (newPage > 1) params.set("page", newPage.toString());

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationPrevious
            href={hasPreviousPage ? buildPageUrl(page - 1) : "#"}
            className={`border ${
              !hasPreviousPage ? "pointer-events-none opacity-50" : ""
            }`}
            aria-disabled={!hasPreviousPage}
          />
        </PaginationItem>
        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            Page <span className="text-foreground">{page}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={hasNextPage ? buildPageUrl(page + 1) : "#"}
            className={`border ${
              !hasNextPage ? "pointer-events-none opacity-50" : ""
            }`}
            aria-disabled={!hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
