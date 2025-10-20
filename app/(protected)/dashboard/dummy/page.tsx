"use client";

import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies } from "./companies";
import { jobPositions } from "./job-positions";
import { JobCard } from "@/app/(protected)/dashboard/dummy/job-card";
import Header from "../../Header";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Get unique values for filters
  const departments = useMemo(() => {
    const deps = [...new Set(jobPositions.map((job) => job.department))];
    return deps;
  }, []);

  const locations = useMemo(() => {
    const locs = [...new Set(jobPositions.map((job) => job.location))];
    return locs;
  }, []);

  // Filter job positions based on search and filters
  const filteredJobs = useMemo(
    () =>
      jobPositions.filter((job) => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requirements.some((req) =>
            req.toLowerCase().includes(searchQuery.toLowerCase())
          );

        const matchesCompany =
          selectedCompany === "all" || job.companyId === selectedCompany;
        const matchesLevel =
          selectedLevel === "all" || job.level === selectedLevel;
        const matchesDepartment =
          selectedDepartment === "all" || job.department === selectedDepartment;
        const matchesLocation =
          selectedLocation === "all" || job.location === selectedLocation;

        return (
          matchesSearch &&
          matchesCompany &&
          matchesLevel &&
          matchesDepartment &&
          matchesLocation
        );
      }),
    [
      searchQuery,
      selectedCompany,
      selectedLevel,
      selectedDepartment,
      selectedLocation,
    ]
  );

  const handleStartInterview = (jobId: string) => {
    // Navigate to the call page with the selected job
    router.push(`/call?jobId=${jobId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "entry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "mid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "senior":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "lead":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto">
      <Header nav={["Dashboard"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
            <Input
              className="h-12 pl-10 text-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or skills..."
              value={searchQuery}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select onValueChange={setSelectedCompany} value={selectedCompany}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.logo} {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedLevel} value={selectedLevel}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead Level</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedDepartment}
              value={selectedDepartment}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedLocation}
              value={selectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="ml-auto"
              onClick={() => {
                setSearchQuery("");
                setSelectedCompany("all");
                setSelectedLevel("all");
                setSelectedDepartment("all");
                setSelectedLocation("all");
              }}
              variant="outline"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm dark:text-gray-400">
            {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        {/* Job Positions Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              getLevelColor={getLevelColor}
              onStartInterview={handleStartInterview}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 font-semibold text-xl">No positions found</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCompany("all");
                setSelectedLevel("all");
                setSelectedDepartment("all");
                setSelectedLocation("all");
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
