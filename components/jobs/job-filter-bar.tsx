"use client";

import * as React from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Input } from "@/components/ui/input";
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
import { Filter, Search, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobFilterBarProps {
  industries: string[];
  categories: string[];
  seniorities: string[];
  companies: string[];
}

const ALL_VALUE = "all";

export function JobFilterBar({
  industries,
  categories,
  seniorities,
  companies,
}: JobFilterBarProps) {
  // Use nuqs for URL state management with debouncing
  const [searchValue, setSearchValue] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      shallow: false,
      throttleMs: 300, // Built-in debouncing
    })
  );

  const [industry, setIndustry] = useQueryState(
    "industry",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const [seniority, setSeniority] = useQueryState(
    "seniority",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const [company, setCompany] = useQueryState(
    "company",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const [open, setOpen] = React.useState(false);

  const hasActiveFilters =
    searchValue.trim().length > 0 ||
    industry.length > 0 ||
    category.length > 0 ||
    seniority.length > 0 ||
    company.length > 0;

  const resetFilters = () => {
    setSearchValue("");
    setIndustry("");
    setCategory("");
    setSeniority("");
    setCompany("");
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {company
                ? companies.find((c) => c === company)
                : "Select company..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search company..." className="h-9" />
              <CommandList>
                <CommandEmpty>No company found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((c) => (
                    <CommandItem
                      key={c}
                      value={c}
                      onSelect={(currentValue) => {
                        setCompany(
                          currentValue === company ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {c}
                      <Check
                        className={cn(
                          "ml-auto",
                          company === c ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          onValueChange={(value) =>
            setIndustry(value === ALL_VALUE ? "" : value)
          }
          value={industry || ALL_VALUE}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Industries</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setCategory(value === ALL_VALUE ? "" : value)
          }
          value={category || ALL_VALUE}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setSeniority(value === ALL_VALUE ? "" : value)
          }
          value={seniority || ALL_VALUE}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Seniority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Levels</SelectItem>
            {seniorities.map((sen) => (
              <SelectItem key={sen} value={sen}>
                {sen.charAt(0).toUpperCase() + sen.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="ml-auto"
          disabled={!hasActiveFilters}
          onClick={resetFilters}
          type="button"
          variant="outline"
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
