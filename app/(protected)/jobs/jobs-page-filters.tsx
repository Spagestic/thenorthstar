"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface JobsPageFiltersProps {
  industries: { name: string }[];
  seniorities: string[];
  companies: { name: string }[];
}

export function JobsPageFilters({
  industries,
  seniorities,
  companies,
}: JobsPageFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companyOpen, setCompanyOpen] = React.useState(false);
  const [industryOpen, setIndustryOpen] = React.useState(false);

  // Get current filter values from URL
  const currentIndustry = searchParams.get("industry") || "";
  const currentSeniority = searchParams.get("seniority") || "";
  const currentCompany = searchParams.get("company") || "";
  const currentSearch = searchParams.get("search") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetAllFilters = () => {
    router.push("/jobs", { scroll: false });
  };

  const activeFiltersCount = [
    currentIndustry,
    currentSeniority,
    currentCompany,
    currentSearch,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Industry Filter */}
        <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={currentIndustry ? "default" : "outline"}
              role="combobox"
              aria-expanded={industryOpen}
              className="w-[200px] justify-between"
            >
              <span className="truncate">{currentIndustry || "Industry"}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search industry..." className="h-9" />
              <CommandList>
                <CommandEmpty>No industry found.</CommandEmpty>
                <CommandGroup>
                  {industries.map((ind) => (
                    <CommandItem
                      key={ind.name}
                      value={ind.name}
                      onSelect={(value) => {
                        updateFilter(
                          "industry",
                          value === currentIndustry ? "" : value
                        );
                        setIndustryOpen(false);
                      }}
                    >
                      {ind.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentIndustry === ind.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Company Filter */}
        <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={currentCompany ? "default" : "outline"}
              role="combobox"
              aria-expanded={companyOpen}
              className="w-[200px] justify-between"
            >
              <span className="truncate">{currentCompany || "Company"}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search company..." className="h-9" />
              <CommandList>
                <CommandEmpty>No company found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((comp) => (
                    <CommandItem
                      key={comp.name}
                      value={comp.name}
                      onSelect={(value) => {
                        updateFilter(
                          "company",
                          value === currentCompany ? "" : value
                        );
                        setCompanyOpen(false);
                      }}
                    >
                      {comp.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentCompany === comp.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Seniority Filter */}
        <Select
          value={currentSeniority || "all"}
          onValueChange={(value) => updateFilter("seniority", value)}
        >
          <SelectTrigger
            className={cn("w-[160px]", currentSeniority && "border-primary")}
          >
            <SelectValue placeholder="Seniority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {seniorities.map((sen) => (
              <SelectItem key={sen} value={sen}>
                {sen.charAt(0).toUpperCase() + sen.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            onClick={resetAllFilters}
            variant="ghost"
            size="sm"
            className="ml-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentSearch && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>Search: {currentSearch}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("search");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentIndustry && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>{currentIndustry}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("industry");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove industry filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentCompany && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>{currentCompany}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("company");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove company filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentSeniority && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>
                {currentSeniority.charAt(0).toUpperCase() +
                  currentSeniority.slice(1)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("seniority");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove seniority filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
