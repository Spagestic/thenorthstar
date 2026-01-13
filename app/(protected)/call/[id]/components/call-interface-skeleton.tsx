import { Skeleton } from "@/components/ui/skeleton";

export function CallInterfaceSkeleton() {
  return (
    <div className="flex h-[84vh] w-full flex-col items-center justify-center overflow-hidden p-6">
      <div className="flex flex-col items-center gap-6">
        {/* Orb Skeleton */}
        <div className="relative size-32">
          <Skeleton className="h-full w-full rounded-full" />
        </div>

        {/* Status Skeleton */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Controls Skeleton */}
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}
