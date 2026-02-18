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
      <Suspense fallback={<Header nav={[{ label: "Interview" }]} />}>
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
  searchParams: Promise<{ company?: string; job?: string }>;
  params: Promise<{ id: string }>;
}) {
  const { company, job: jobTitle } = await searchParams;
  const { id } = await params;

  return (
    <Header
      nav={
        company && jobTitle
          ? [{ label: company }, { label: jobTitle }, { label: "Interview" }]
          : [{ label: "Interview" }]
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
    .from("job_postings")
    .select(`*`)
    .eq("id", jobId)
    .single();

  return (
    <CallInterface
      userId={user?.id}
      jobId={jobId}
      job_title={job?.title || "Interview"}
      company_name={job?.company_name || "Company"}
      description={job?.description || ""}
    />
  );
}
