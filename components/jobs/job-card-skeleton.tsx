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
        <Card key={index} className="h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Skeleton className="h-14 w-14 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};
