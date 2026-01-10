// @/app/(protected)/history/[id]/page.tsx
import { Suspense } from "react";
import { PageSkeleton } from "./page-skeleton"; // Your existing skeleton
import { createClient } from "@/lib/supabase/server";
import Header from "../../Header";
import { getConversation } from "./actions";
import { AudioPlayerSection } from "./components/audio-player-section"; // Client
import { AnalysisSection } from "./components/analysis-section"; // Server
import { TranscriptSection } from "./components/transcript-section"; // Server

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      {/* All dynamic logic is pushed down into this component */}
      <ConversationContainer params={params} />
    </Suspense>
  );
}

export async function ConversationContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("voice_conversations")
    .select(
      `
      id, conversation_id, started_at,
      job:job_positions!inner(
        id, title, 
        company:companies!inner(name), 
        industry:industry!inner(name)
      )
    `
    )
    .eq("conversation_id", id)
    .single();

  if (!conversation) {
    return (
      <div>
        <Header nav={[{ label: "History" }, { label: "Not Found" }]} />
        <div className="flex h-[84vh] items-center justify-center">
          <p>Conversation not found.</p>
        </div>
      </div>
    );
  }

  const jobData = conversation.job as any;
  const { conversation: elevenlabs } = await getConversation(id);

  return (
    <div>
      <Header
        nav={[
          { label: "History", href: "/dashboard" },
          { label: jobData.company.name, href: "#" },
          { label: jobData.title, href: `/job/${jobData.id}` },
        ]}
      />
      <div className="container mx-auto p-6 max-w-6xl space-y-6">
        <AudioPlayerSection
          conversationId={id}
          startedAt={conversation.started_at}
          jobTitle={jobData.title}
          companyName={jobData.company.name}
          industryName={jobData.industry.name}
          duration={elevenlabs.metadata?.call_duration_secs}
          status={elevenlabs.status}
          transcriptSummary={elevenlabs.analysis?.transcript_summary}
        />
        <AnalysisSection analysis={elevenlabs.analysis} />
        <TranscriptSection transcript={elevenlabs.transcript} />
      </div>
    </div>
  );
}
