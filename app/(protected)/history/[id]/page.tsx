import { createClient } from "@/lib/supabase/server";
import Header from "../../Header";
import { ConversationHistory } from "./conversation-history";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversationId = id;
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user) {
    return (
      <div>
        <Header nav={[{ label: "History" }, { label: "Unauthorized" }]} />
        <div className="flex h-[84vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Unauthorized</h2>
            <p className="text-muted-foreground mt-2">
              Please sign in to view this conversation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch conversation details from database
  const { data: conversation } = await supabase
    .from("voice_conversations")
    .select(
      `
      id,
      conversation_id,
      started_at,
      agent_id,
      job:job_positions!inner(
        id,
        title,
        company:companies!inner(
          name
        ),
        industry:industry!inner(
          name
        )
      )
    `
    )
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conversation) {
    return (
      <div>
        <Header nav={[{ label: "History" }, { label: "Not Found" }]} />
        <div className="flex h-[84vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Conversation Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The conversation you're looking for doesn't exist or you don't
              have access to it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Type assertion for the nested data
  const jobData = conversation.job as any;
  const companyName = jobData?.company?.name || "Company";
  const jobTitle = jobData?.title || "Position";
  const jobId = jobData?.id;
  const industryName = jobData?.industry?.name;

  return (
    <div>
      <Header
        nav={[
          { label: "History", href: "/dashboard" },
          {
            label: companyName,
            href: `/dashboard?company=${encodeURIComponent(companyName)}`,
          },
          {
            label: jobTitle,
            href: `/job/${jobId}`,
          },
        ]}
      />
      <ConversationHistory
        conversationId={conversationId}
        jobTitle={jobTitle}
        companyName={companyName}
        industryName={industryName}
        startedAt={conversation.started_at}
      />
    </div>
  );
}
