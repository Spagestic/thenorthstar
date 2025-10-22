import Header from "../../Header";
import VoiceInterface from "@/app/(protected)/voice-chat/[id]/voice-interface";
import { createClient } from "@/lib/supabase/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = id;

  const supabase = await createClient();
  const { data: job } = await supabase
    .from("job_positions")
    .select(
      `*, company:companies(name, description, culture, values), industry:industry(name)`
    )
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
                { label: "Voice Chat" },
              ]
            : [{ label: "Voice Chat" }]
        }
      />

      <VoiceInterface
        jobId={jobId}
        jobTitle={job?.title}
        companyName={job?.company?.name}
        requirements={job?.typical_requirements}
        responsibilities={job?.typical_responsibilities}
        industryName={job?.industry?.name}
      />
    </div>
  );
}
