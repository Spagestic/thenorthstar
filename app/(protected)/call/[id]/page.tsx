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
  const { data: job } = await supabase
    .from("job_positions")
    .select(`title, companies(name)`)
    .eq("id", jobId)
    .single();
  const jobTitle = jobId ? job?.title || null : null;
  console.log(job);
  return (
    <div>
      <Header
        nav={
          jobTitle
            ? [{ label: jobTitle, href: `/job/${jobId}` }, { label: "Call" }]
            : [{ label: "Call" }]
        }
      />
      <CallInterface job_title={jobTitle} company_name={job?.companies?.name} />
    </div>
  );
}
