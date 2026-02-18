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
    .from("interviews")
    .select(
      `
      id,
      conversation_id,
      started_at,
      job:job_postings(
        title,
        company_name
      )
    `,
    )
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(10);
  console.log("Fetched conversations:", conversations);

  // Transform the data for display
  const interviews =
    conversations?.map((conv: any) => ({
      id: conv.id,
      conversationId: conv.conversation_id,
      name: conv.job?.title || "Unknown Position",
      company: conv.job?.company_name || "Unknown Company",
      domain: conv.job?.company_domain || "",
      url: `/history/${conv.conversation_id}`,
      startedAt: conv.started_at,
    })) || [];

  return <NavInterviewsClient interviews={interviews} />;
}
