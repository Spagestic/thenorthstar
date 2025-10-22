import { createClient } from "@/lib/supabase/server";
import { getCompanyLogo } from "@/lib/company-logos";
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
    .from("voice_conversations")
    .select(
      `
      id,
      conversation_id,
      started_at,
      job:job_positions(
        id,
        title,
        company:companies(
          name
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(10);

  // Transform the data for display
  const interviews =
    conversations?.map((conv: any) => ({
      id: conv.id,
      conversationId: conv.conversation_id,
      name: conv.job?.title || "Unknown Position",
      company: conv.job?.company?.name || "Unknown Company",
      logo: getCompanyLogo(conv.job?.company?.name || ""),
      url: `/history/${conv.conversation_id}`,
      startedAt: conv.started_at,
    })) || [];

  return <NavInterviewsClient interviews={interviews} />;
}
