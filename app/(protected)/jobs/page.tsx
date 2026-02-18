import { Suspense } from "react";
import { ScraperDialog } from "./components/scraper-dialog";
import Header from "../Header";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "./components/job-card";
import { JobSearchBar } from "./components/job-search-bar";
import { jobPostingsSearchParamsCache } from "./components/searchParams";
import { JobPostingsFilters } from "./components/job-postings-filters";
import type { SearchParams } from "nuqs/server";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 16;

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default function HomePage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header
        nav={["Jobs"]}
        rightContent={
          <Button size="sm" className="gap-2" asChild>
            <Link href="/app" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Job</span>
            </Link>
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-6 mb-8 space-y-6">
          <div className="sticky top-0 z-10 bg-background  py-4 -mx-6 px-6 border-b">
            <div className="space-y-4 mx-auto">
              <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <JobSearchBar />
              </Suspense>
              <Suspense
                fallback={
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-45" />
                    <Skeleton className="h-10 w-45" />
                  </div>
                }
              >
                <FiltersContainer />
              </Suspense>
            </div>
          </div>

          <section>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 w-full bg-muted animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              }
            >
              <JobList searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={<div className="h-12" />}>
              <JobPagination className="pt-8" searchParams={searchParams} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}

async function FiltersContainer() {
  const supabase = await createClient();

  const { data: employmentTypesData } = await supabase
    .from("job_postings")
    .select("employment_type");

  const { data: workModesData } = await supabase
    .from("job_postings")
    .select("work_mode");

  const employmentTypes = [
    ...new Set(
      (employmentTypesData || [])
        .map((item) => item.employment_type)
        .filter((t): t is string => !!t),
    ),
  ].sort();

  const workModes = [
    ...new Set(
      (workModesData || [])
        .map((item) => item.work_mode)
        .filter((m): m is string => !!m),
    ),
  ].sort();

  return (
    <JobPostingsFilters
      employmentTypes={employmentTypes}
      workModes={workModes}
    />
  );
}

export async function JobList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = jobPostingsSearchParamsCache.parse(await searchParams);
  const { search, employmentType, workMode, page } = resolvedParams;

  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from("job_postings").select("*", {
    count: "exact",
  });

  if (search) {
    query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%`);
  }

  if (employmentType) {
    query = query.eq("employment_type", employmentType);
  }

  if (workMode) {
    query = query.eq("work_mode", workMode);
  }

  const { data: jobs, count } = await query
    .order("posted_at", { ascending: false })
    .range(from, to);

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No job postings found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {jobs.map((job: any) => (
        <JobCard
          key={job.id}
          job={{
            ...job,
            workMode: job.work_mode as any,
            companyName:
              job.company?.name || job.company_name || "Unknown Company",
            companyLogo: job.company?.logo_url || undefined,
            directApplyUrl: job.direct_apply_url,
            employmentType: job.employment_type as any,
            datePosted: job.posted_at,
            jobLocations: job.location as any,
            baseSalary:
              job.salary_min || job.salary_max
                ? {
                    minValue: job.salary_min,
                    maxValue: job.salary_max,
                    currency: job.salary_currency,
                    unitText: job.salary_period,
                  }
                : undefined,
            description: job.description,
          }}
        />
      ))}
    </div>
  );
}

async function JobPagination({
  className,
  searchParams,
}: {
  className?: string;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = jobPostingsSearchParamsCache.parse(await searchParams);
  const { search, employmentType, workMode, page } = resolvedParams;

  const supabase = await createClient();

  let countQuery = supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true });

  if (search) {
    countQuery = countQuery.or(
      `title.ilike.%${search}%,company_name.ilike.%${search}%`,
    );
  }

  if (employmentType) {
    countQuery = countQuery.eq("employment_type", employmentType);
  }

  if (workMode) {
    countQuery = countQuery.eq("work_mode", workMode);
  }

  const { count } = await countQuery;
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (employmentType) params.set("employmentType", employmentType);
    if (workMode) params.set("workMode", workMode);
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
