import { CallInterface } from "@/components/call";
import Header from "../../Header";
import { createClient } from "@/lib/supabase/server";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = id;
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job } = await supabase
    .from("job_positions")
    .select(
      `*, company:companies(name, description, culture, values), industry:industry(name)`
    )
    .eq("id", jobId)
    .single();

  // Check if essential data is loaded
  const isDataLoaded = !!(job?.title && job?.company?.name);

  return (
    <div>
      <Header
        nav={
          job?.title && job?.industry?.name && job?.company?.name
            ? [
                {
                  label: job.industry.name,
                  href: `/dashboard?industry=${encodeURIComponent(
                    job.industry.name
                  )}`,
                },
                {
                  label: job.company.name,
                  href: `/dashboard?company=${encodeURIComponent(
                    job.company.name
                  )}`,
                },
                { label: job.title, href: `/job/${jobId}` },
                { label: "Call" },
              ]
            : [{ label: "Call" }]
        }
      />
      <CallInterface
        userId={user?.id}
        jobId={jobId}
        job_title={job?.title || "Interview"}
        requirements={job?.typical_requirements as string[] | undefined}
        responsibilities={job?.typical_responsibilities as string[] | undefined}
        company_name={job?.company?.name || "Company"}
        company_description={job?.company?.description || undefined}
        company_culture={job?.company?.culture || undefined}
        company_values={job?.company?.values as string[] | undefined}
        industry_name={job?.industry?.name || undefined}
        isDataLoaded={isDataLoaded}
      />
    </div>
  );
}
