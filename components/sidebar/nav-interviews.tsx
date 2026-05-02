import { createClient } from "@/lib/supabase/server";
import { NavInterviewsClient } from "./nav-interviews-client";

export async function NavInterviews() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch conversations with job and company details
  const { data: conversations } = await supabase
    .from("interviews")
    .select(
      `
      id,
      conversation_id,
      started_at,
      job:job_postings(
        title,
        company_name,
        company_domain,
        company_logo_url
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("agent_id", process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_NEW!)
    .order("started_at", { ascending: false })
    .limit(10);

  // Transform the data for display
  const interviews =
    conversations?.map((conv) => ({
      id: conv.id,
      conversationId: conv.conversation_id,
      name: conv.job?.title || "Unknown Position",
      company: conv.job?.company_name || "Unknown Company",
      domain: conv.job?.company_domain ?? null,
      companyLogoUrl: conv.job?.company_logo_url ?? null,
      url: `/history/${conv.conversation_id}`,
      startedAt: conv.started_at,
    })) || [];

  return <NavInterviewsClient interviews={interviews} />;
}
