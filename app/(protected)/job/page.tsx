"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "./use-infinite-query";
import { Button } from "@/components/ui/button";

type Job = {
  id: string | number;
  title: string;
  category?: string | null;
  seniority_level?: string | null;
  salary_range_min?: number | null;
  salary_range_max?: number | null;
  salary_currency?: string | null;
  typical_requirements?: string[] | null;
  typical_responsibilities?: string[] | null;
  created_at: string | Date;
};

function JobListContent() {
  const params = useSearchParams();
  const searchQuery = params.get("q");

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    error,
    hasMore,
    fetchNextPage,
    count,
  } = useInfiniteQuery({
    tableName: "job_positions",
    columns: "*",
    pageSize: 10,
    trailingQuery: (query) => {
      let modifiedQuery = query.order("created_at", { ascending: false });

      if (searchQuery && searchQuery.length > 0) {
        modifiedQuery = modifiedQuery.ilike("title", `%${searchQuery}%`);
      }

      return modifiedQuery;
    },
  });

  // Cast the potentially-unknown data to a typed array for safe usage
  const typedData = (data ?? []) as Job[];

  // Loading state for initial fetch
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Job Positions</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Error loading job positions: {error.message}</p>
        </div>
      </div>
    );
  }

  // No results state
  if (isSuccess && typedData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Job Positions</h1>
        <div className="text-center text-gray-500 py-10">
          No job positions found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Job Positions{" "}
        {count > 0 && (
          <span className="text-gray-500 text-lg">({count} total)</span>
        )}
      </h1>

      <div className="space-y-4">
        {typedData.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex gap-4">
                <span className="font-medium">Category:</span>
                <span>{job.category}</span>
              </div>

              {job.seniority_level && (
                <div className="flex gap-4">
                  <span className="font-medium">Seniority:</span>
                  <span>{job.seniority_level}</span>
                </div>
              )}

              {(job.salary_range_min || job.salary_range_max) && (
                <div className="flex gap-4">
                  <span className="font-medium">Salary Range:</span>
                  <span>
                    {job.salary_currency || "USD"}{" "}
                    {job.salary_range_min?.toLocaleString() || "0"} -{" "}
                    {job.salary_range_max?.toLocaleString() || "N/A"}
                  </span>
                </div>
              )}

              {job.typical_requirements &&
                Array.isArray(job.typical_requirements) && (
                  <div>
                    <span className="font-medium">Requirements:</span>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      {job.typical_requirements
                        .slice(0, 3)
                        .map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                    </ul>
                  </div>
                )}

              {job.typical_responsibilities &&
                Array.isArray(job.typical_responsibilities) && (
                  <div>
                    <span className="font-medium">Responsibilities:</span>
                    <ul className="list-disc list-inside mt-1 ml-4">
                      {job.typical_responsibilities
                        .slice(0, 3)
                        .map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                    </ul>
                  </div>
                )}

              <div className="text-xs text-gray-400 pt-2">
                Created: {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button onClick={fetchNextPage} disabled={isFetching} className="">
            {isFetching ? "Loading..." : "Load More Jobs"}
          </Button>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && typedData.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          You've reached the end of the list.
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Job Positions</h1>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <JobListContent />
    </Suspense>
  );
}
