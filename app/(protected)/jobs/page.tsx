import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../Header";
import { JobCard } from "@/app/(protected)/jobs/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
export default async function page() {
  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8 overflow-hidden">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <JobCardSkeleton count={9} />
            </div>
          }
        >
          <JobList />
        </Suspense>
      </div>
    </div>
  );
}

async function JobList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_positions")
    .select(
      `
    id, title, category, seniority_level, typical_requirements, typical_responsibilities, industry_id, company_id,
    companies!inner (
      name
    ),
    industry!inner (
    name
    )
  `
    )
    .eq("industry.name", "Technology")
    .eq("category", "Data, AI & ML")
    .eq("seniority_level", "mid")
    .eq("companies.name", "Apple")
    .limit(9);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {data?.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
