"use client";

import { useTransition, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search, Loader2 } from "lucide-react";

interface JobFilterBarProps {
  industries: string[];
  categories: string[];
  seniorities: string[];
}

const ALL_VALUE = "all";

export function JobFilterBar({
  industries,
  categories,
  seniorities,
}: JobFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") ?? "";
  const currentIndustry = searchParams.get("industry") ?? ALL_VALUE;
  const currentCategory = searchParams.get("category") ?? ALL_VALUE;
  const currentSeniority = searchParams.get("seniority") ?? ALL_VALUE;

  // Local state for search input to avoid lag
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Update local state when URL changes
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateParam("q", searchValue);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchValue]);

  const hasActiveFilters =
    currentSearch.trim().length > 0 ||
    currentIndustry !== ALL_VALUE ||
    currentCategory !== ALL_VALUE ||
    currentSeniority !== ALL_VALUE;

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value.length > 0 && value !== ALL_VALUE) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="space-y-4 rounded-lg ">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Search job titles, companies, or skills"
          className="pl-9"
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search by role, company, or skills"
          value={searchValue}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          onValueChange={(value) => updateParam("industry", value)}
          value={currentIndustry}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateParam("category", value)}
          value={currentCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateParam("seniority", value)}
          value={currentSeniority}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seniority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Levels</SelectItem>
            {seniorities.map((seniority) => (
              <SelectItem key={seniority} value={seniority}>
                {seniority.charAt(0).toUpperCase() + seniority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="ml-auto"
          disabled={!hasActiveFilters}
          onClick={() => {
            setSearchValue("");
            startTransition(() => {
              router.push(pathname, { scroll: false });
            });
          }}
          type="button"
          variant="outline"
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Updating results...
        </div>
      )}
    </div>
  );
}
