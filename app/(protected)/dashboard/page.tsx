import { Suspense } from "react";
import Header from "../Header";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { JobSearchBar } from "@/components/jobs/job-search-bar";
import { JobsFilters } from "@/components/jobs/jobs-filters-wrapper";
import { InfiniteJobList } from "@/components/jobs/infinite-job-list";
import { Skeleton } from "@/components/ui/skeleton";
import { jobSearchParamsCache } from "@/components/jobs/searchParams";
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

        {/* Scrollable job list with infinite scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          <InfiniteJobList
            key={JSON.stringify(params)}
            search={params.search || undefined}
            industry={params.industry || undefined}
            company={params.company || undefined}
            seniority={params.seniority || undefined}
          />
        </div>
      </div>
    </div>
  );
}
