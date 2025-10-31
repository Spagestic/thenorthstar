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
  const [isPending, startTransition] = React.useTransition();
  const [companyOpen, setCompanyOpen] = React.useState(false);
  const [industryOpen, setIndustryOpen] = React.useState(false);

  // Use nuqs to manage all filter states together
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString,
      industry: parseAsString,
      company: parseAsString,
      seniority: parseAsString,
      page: parseAsString,
    },
    {
      shallow: false, // Notify server
      startTransition, // Use transition for loading state
    }
  );

  const { search, industry, company, seniority } = filters;

  const updateFilter = (key: keyof typeof filters, value: string | null) => {
    if (value && value !== "all") {
      setFilters({ [key]: value, page: null }); // Reset to page 1 when filter changes
    } else {
      setFilters({ [key]: null, page: null });
    }
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ [key]: null, page: null }); // Reset to page 1 when removing filter
  };

  const resetAllFilters = () => {
    setFilters({
      search: null,
      industry: null,
      company: null,
      seniority: null,
      page: null,
    });
  };

  const activeFiltersCount = [search, industry, company, seniority].filter(
    Boolean
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Industry Filter */}
        <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={industry ? "default" : "outline"}
              role="combobox"
              aria-expanded={industryOpen}
              className="w-[200px] justify-between"
              disabled={isPending}
            >
              <span className="truncate">{industry || "Industry"}</span>
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
                          value === industry ? null : value
                        );
                        setIndustryOpen(false);
                      }}
                    >
                      {ind.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          industry === ind.name ? "opacity-100" : "opacity-0"
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
              variant={company ? "default" : "outline"}
              role="combobox"
              aria-expanded={companyOpen}
              className="w-[200px] justify-between"
              disabled={isPending}
            >
              <span className="truncate">{company || "Company"}</span>
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
                          value === company ? null : value
                        );
                        setCompanyOpen(false);
                      }}
                    >
                      {comp.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          company === comp.name ? "opacity-100" : "opacity-0"
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
          value={seniority || "all"}
          onValueChange={(value) =>
            updateFilter("seniority", value === "all" ? null : value)
          }
          disabled={isPending}
        >
          <SelectTrigger
            className={cn("w-[160px]", seniority && "border-primary")}
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
            disabled={isPending}
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>Search: {search}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("search");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove search filter"
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {industry && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>{industry}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("industry");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove industry filter"
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {company && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>{company}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFilter("company");
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
                aria-label="Remove company filter"
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {seniority && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              <span>
                {seniority.charAt(0).toUpperCase() + seniority.slice(1)}
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
                disabled={isPending}
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
