import { CallInterface } from "@/components/call";
import Header from "../../Header";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  searchParams: { jobId?: string };
}

async function getJobTitle(jobId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.title || null;
  } catch (error) {
    console.error("Failed to fetch job details:", error);
    return null;
  }
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = id;
  const supabase = await createClient();
  const { data: job } = await supabase
    .from("job_positions")
    .select(`title`)
    .eq("id", jobId)
    .single();
  const jobTitle = jobId ? job?.title || null : null;
  return (
    <div>
      <Header
        nav={
          jobTitle
            ? [{ label: jobTitle, href: `/job/${jobId}` }, { label: "Call" }]
            : [{ label: "Call" }]
        }
      />
      <CallInterface />
    </div>
  );
}
