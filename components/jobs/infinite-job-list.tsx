"use client";

import * as React from "react";
import {
  useInfiniteQuery,
  type SupabaseQueryHandler,
} from "@/hooks/use-infinite-query";
import { JobCard, type JobCardData } from "./job-card";
import { JobCardSkeleton } from "./job-card-skeleton";
import { Loader2 } from "lucide-react";

interface InfiniteJobListProps {
  search?: string;
  industry?: string;
  company?: string;
  seniority?: string;
}

export function InfiniteJobList({
  search,
  industry,
  company,
  seniority,
}: InfiniteJobListProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = React.useRef<HTMLDivElement>(null);
  const observer = React.useRef<IntersectionObserver | null>(null);

  // Define the query handler with filters
  const trailingQuery: SupabaseQueryHandler<"job_positions"> =
    React.useCallback(
      (query) => {
        // Apply filters
        if (industry) {
          query = query.eq("industry.name", industry);
        }
        if (company) {
          query = query.eq("companies.name", company);
        }
        if (seniority) {
          query = query.eq("seniority_level", seniority);
        }
        // Apply text search
        if (search && search.trim()) {
          query = query.textSearch("title", search, { config: "english" });
        }
        return query;
      },
      [search, industry, company, seniority]
    );

  const { data, isFetching, hasMore, fetchNextPage, isSuccess, isLoading } =
    useInfiniteQuery({
      tableName: "job_positions",
      columns: `
        id, title, category, seniority_level, typical_requirements, 
        typical_responsibilities, industry_id, company_id,
        companies!inner (name),
        industry!inner (name)
      `,
      pageSize: 15,
      trailingQuery,
    });

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage();
        }
      },
      {
        root: null, // Use viewport as root
        threshold: 0.1,
        rootMargin: "0px 0px 200px 0px", // Trigger 200px before reaching the end
      }
    );

    if (loadMoreSentinelRef.current) {
      observer.current.observe(loadMoreSentinelRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isFetching, hasMore, fetchNextPage]);

  // Show loading skeleton during initial load
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <JobCardSkeleton count={15} />
      </div>
    );
  }

  // Show no results message
  if (isSuccess && data.length === 0) {
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
    <div ref={scrollContainerRef}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.map((job) => (
          <JobCard key={job.id} job={job as any as JobCardData} />
        ))}
      </div>

      {/* Intersection observer sentinel */}
      <div ref={loadMoreSentinelRef} style={{ height: "1px" }} />

      {/* Loading indicator */}
      {isFetching && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more jobs...</span>
          </div>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && data.length > 0 && (
        <div className="flex justify-center py-8">
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached the end of the list
          </p>
        </div>
      )}
    </div>
  );
}
