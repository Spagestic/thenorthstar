"use client";

import * as React from "react";
import { useQueryState, parseAsString, debounce } from "nuqs";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export function JobSearchBar() {
  const [isPending, startTransition] = React.useTransition();

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({
      shallow: false,
      startTransition,
      limitUrlUpdates: debounce(200),
    }),
  );

  const [, setPage] = useQueryState("page");

  const handleSearchChange = (value: string | null) => {
    setSearch(value);
    setPage(null);
  };

  return (
    <div className="relative">
      {isPending ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        aria-label="Search job postings"
        className="pl-9"
        onChange={(e) => handleSearchChange(e.target.value || null)}
        placeholder="Search by role or company..."
        value={search ?? ""}
      />
    </div>
  );
}
