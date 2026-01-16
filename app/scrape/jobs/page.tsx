import { createClient } from "@/lib/supabase/server";
import { JobCard } from "./job-card";

export default async function page() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*")
    .limit(10);
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job) => (
          <JobCard
            key={job.id}
            job={{
              ...job,
              workMode: job.work_mode as any,
              companyName: job.company_name,
              directApplyUrl: job.direct_apply_url,
              employmentType: job.employment_type as any,
              datePosted: job.posted_at,
              jobLocation: job.location as any,
              baseSalary:
                job.salary_min || job.salary_max
                  ? {
                      minValue: job.salary_min,
                      maxValue: job.salary_max,
                      currency: job.salary_currency,
                      unitText: job.salary_period,
                    }
                  : undefined,
              rawDescription: job.description_text || job.description_html,
            }}
          />
        ))}
      </div>
    </div>
  );
}
