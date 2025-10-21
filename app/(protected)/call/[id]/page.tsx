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
    .select(`*, company:companies(name), industry:industry(name)`)
    .eq("id", jobId)
    .single();

  return (
    <div>
      <Header
        nav={
          job?.title
            ? [
                {
                  label: job?.industry?.name,
                  href: `/dashboard?industry=${encodeURIComponent(
                    job?.industry?.name || ""
                  )}`,
                },
                {
                  label: job?.company?.name,
                  href: `/dashboard?company=${encodeURIComponent(
                    job?.company?.name || ""
                  )}`,
                },
                { label: job?.title, href: `/job/${jobId}` },
                { label: "Call" },
              ]
            : [{ label: "Call" }]
        }
      />
      <CallInterface
        job_title={job?.title}
        company_name={job?.company?.name}
        requirements={job?.typical_requirements}
        responsibilities={job?.typical_responsibilities}
      />
    </div>
  );
}
