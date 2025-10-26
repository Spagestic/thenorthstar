"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export function JobSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("search") || ""
  );
  const [isPending, startTransition] = React.useTransition();

  // Debounce timer ref
  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  // Update URL with debouncing and transition
  const updateSearchParam = React.useCallback(
    (value: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
          params.set("search", value.trim());
        } else {
          params.delete("search");
        }

        startTransition(() => {
          router.push(`?${params.toString()}`, { scroll: false });
        });
      }, 200); // Reduced from 300ms to 200ms for faster response
    },
    [router, searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    updateSearchParam(value);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {isPending ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        aria-label="Search job titles"
        className="pl-9"
        onChange={handleSearchChange}
        placeholder="Search by role, company, or skills"
        value={searchValue}
      />
    </div>
  );
}
