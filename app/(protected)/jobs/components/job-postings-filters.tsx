// app/(protected)/jobs/components/job-postings-filters.tsx
"use client";

import * as React from "react";
import { useQueryStates, parseAsString } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { formatEmploymentType, formatWorkMode } from "@/lib/utils";

interface JobPostingsFiltersProps {
  employmentTypes: string[];
  workModes: string[];
}

export function JobPostingsFilters({
  employmentTypes,
  workModes,
}: JobPostingsFiltersProps) {
  const [isPending, startTransition] = React.useTransition();

  const [filters, setFilters] = useQueryStates(
    {
      employmentType: parseAsString,
      workMode: parseAsString,
      page: parseAsString,
      sort: parseAsString,
    },
    {
      shallow: false,
      startTransition,
    },
  );

  const { employmentType, workMode, sort } = filters;

  const updateFilter = (key: keyof typeof filters, value: string | null) => {
    if (value && value !== "all") {
      setFilters({ [key]: value, page: null });
    } else {
      setFilters({ [key]: null, page: null });
    }
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ [key]: null, page: null });
  };

  const resetAllFilters = () => {
    setFilters({
      employmentType: null,
      workMode: null,
      sort: null,
      page: null,
    });
  };

  const activeFiltersCount = [employmentType, workMode, sort].filter(
    Boolean,
  ).length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={employmentType || "all"}
          onValueChange={(value) => updateFilter("employmentType", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {employmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {formatEmploymentType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={workMode || "all"}
          onValueChange={(value) => updateFilter("workMode", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Work Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            {workModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {formatWorkMode(mode)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort || "posted_at_desc"}
          onValueChange={(value) =>
            updateFilter("sort", value === "posted_at_desc" ? null : value)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-44 ml-auto">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="posted_at_desc">Newest First</SelectItem>
            <SelectItem value="posted_at_asc">Oldest First</SelectItem>
            <SelectItem value="salary_desc">Salary: High → Low</SelectItem>
            <SelectItem value="salary_asc">Salary: Low → High</SelectItem>
            <SelectItem value="title_asc">Title: A → Z</SelectItem>
            <SelectItem value="title_desc">Title: Z → A</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetAllFilters}
            className="h-8 px-2 lg:px-3"
            disabled={isPending}
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {employmentType && (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              Type: {formatEmploymentType(employmentType)}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter("employmentType")}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {workMode && (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              Mode: {formatWorkMode(workMode)}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter("workMode")}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {sort && (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              Sort: {sort.replace(/_/g, " ")}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter("sort")}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
