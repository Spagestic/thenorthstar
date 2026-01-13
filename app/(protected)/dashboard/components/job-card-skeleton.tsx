import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface JobCardSkeletonProps {
  count?: number;
}

export const JobCardSkeleton: React.FC<JobCardSkeletonProps> = ({
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Company logo skeleton - matches 64x64 (h-16 w-16) */}
                <Skeleton className="h-16 w-16 rounded-md" />
                <div>
                  {/* Job title skeleton */}
                  <Skeleton className="h-5 w-48 mb-2" />
                  {/* Company and industry skeleton */}
                  <Skeleton className="h-4 w-56 mb-1" />
                  {/* Category skeleton */}
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              {/* Seniority badge skeleton */}
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-4">
            <div className="flex-1 space-y-4">
              {/* Requirements section */}
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <Skeleton className="h-3 w-3 shrink-0 self-center rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </li>
                  <li className="flex items-start gap-2">
                    <Skeleton className="h-3 w-3 shrink-0 self-center rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </li>
                  <li className="flex items-start gap-2">
                    <Skeleton className="h-3 w-3 shrink-0 self-center rounded-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </li>
                </ul>
              </div>

              {/* Responsibilities section */}
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <Skeleton className="h-3 w-3 shrink-0 self-center rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </li>
                  <li className="flex items-start gap-2">
                    <Skeleton className="h-3 w-3 shrink-0 self-center rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </li>
                  <li className="flex items-start gap-2">
                    <Skeleton className="h-3 w-3 shrink-0 self-center rounded-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </li>
                </ul>
              </div>
            </div>

            {/* Button skeleton */}
            <Skeleton className="h-9 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};
