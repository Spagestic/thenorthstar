import { CallInterface, CallInterfaceSkeleton } from "@/components/call";
import Header from "../../Header";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ industry?: string; company?: string; job?: string }>;
}) {
  const { id } = await params;
  const jobId = id;
  const { industry, company, job: jobTitle } = await searchParams;

  return (
    <div>
      <Header
        nav={
          industry && company && jobTitle
            ? [
                {
                  label: industry,
                  href: `/dashboard?industry=${encodeURIComponent(industry)}`,
                },
                {
                  label: company,
                  href: `/dashboard?company=${encodeURIComponent(company)}`,
                },
                { label: jobTitle, href: `/job/${jobId}` },
                { label: "Call" },
              ]
            : [{ label: "Call" }]
        }
      />
      <Suspense fallback={<CallInterfaceSkeleton />}>
        <InterviewCall jobId={jobId} />
      </Suspense>
    </div>
  );
}

async function InterviewCall({ jobId }: { jobId: string }) {
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
  );
}
