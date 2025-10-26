import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../Header";
import { JobCard } from "@/app/(protected)/jobs/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";

// /jobs?search=machine+%26+learning
// You can filter Jobs by url like....
// /jobs?industry=Technology&category=Data, AI & ML&seniority=mid&company=Apple
// /jobs?jobs?industry=Agriculture+%26+Sustainability&company=Cargill
// /jobs?company=Bank+of+America

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8 overflow-y-auto">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <JobCardSkeleton count={9} />
            </div>
          }
        >
          <JobList searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

interface JobListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function JobList({ searchParams }: JobListProps) {
  const supabase = await createClient();

  let query = supabase.from("job_positions").select(`
    id, title, category, seniority_level, typical_requirements, 
    typical_responsibilities, industry_id, company_id,
    companies!inner (name),
    industry!inner (name)
  `);

  // generic field map for filters
  const fieldMap: Record<string, string> = {
    industry: "industry.name",
    category: "category",
    seniority: "seniority_level",
    company: "companies.name",
  };

  // Filters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && fieldMap[key]) {
      if (Array.isArray(value)) {
        query = query.in(fieldMap[key], value);
      } else {
        query = query.eq(fieldMap[key], value as string);
      }
    }
  });

  // TEXT SEARCH feature!
  if (searchParams.search) {
    query = query.textSearch(
      "title", // Change to the text column you want to search (e.g., 'title', 'typical_requirements')
      searchParams.search as string,
      { config: "english" } // optional: specify search config
    );
  }

  const { data, error } = await query.limit(18);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {data?.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
