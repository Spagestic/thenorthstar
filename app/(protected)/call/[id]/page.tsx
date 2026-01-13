import { CallInterface, CallInterfaceSkeleton } from "./components/index";
import Header from "../../Header";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ industry?: string; company?: string; job?: string }>;
}) {
  return (
    <div>
      <Suspense fallback={<Header nav={[{ label: "Call" }]} />}>
        <DynamicHeader searchParams={searchParams} params={params} />
      </Suspense>
      <Suspense fallback={<CallInterfaceSkeleton />}>
        <InterviewCall params={params} />
      </Suspense>
    </div>
  );
}

async function DynamicHeader({
  searchParams,
  params,
}: {
  searchParams: Promise<{ industry?: string; company?: string; job?: string }>;
  params: Promise<{ id: string }>;
}) {
  const { industry, company, job: jobTitle } = await searchParams;
  const { id } = await params;

  return (
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
              { label: jobTitle, href: `/job/${id}` },
              { label: "Call" },
            ]
          : [{ label: "Call" }]
      }
    />
  );
}

async function InterviewCall({ params }: { params: Promise<{ id: string }> }) {
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
    />
  );
}
