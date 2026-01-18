// @/app/(protected)/history/[id]/page.tsx
import { Suspense } from "react";
import { PageSkeleton } from "./page-skeleton"; // Your existing skeleton
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/(protected)/Header";
import { getConversation } from "./actions";
import { AudioPlayerSection } from "./components/audio-player-section"; // Client
import { AnalysisSection } from "./components/analysis-section"; // Server
import { TranscriptSection } from "./components/transcript-section"; // Server
import { ErrorToaster } from "./components/error-toaster";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
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
      id, conversation_id, started_at, feedback,
      job:job_positions!inner(
        id, title, 
        company:companies!inner(name), 
        industry:industry!inner(name)
      )
    `,
    )
    .eq("conversation_id", id)
    .single();

  const { conversation: elevenlabs, error } = await getConversation(id);
  const finalError = !conversation
    ? "Conversation not found in database."
    : error;

  const jobData = (conversation?.job as any) || {
    id: "unknown",
    title: "Unknown Position",
    company: { name: "Unknown Company" },
    industry: { name: "Unknown Industry" },
  };

  return (
    <div>
      <ErrorToaster error={finalError} />
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
          startedAt={conversation?.started_at || new Date().toISOString()}
          jobTitle={jobData.title}
          companyName={jobData.company.name}
          industryName={jobData.industry.name}
          duration={elevenlabs.metadata?.call_duration_secs}
          status={elevenlabs.status}
          transcriptSummary={elevenlabs.analysis?.transcript_summary}
        />
        <AnalysisSection
          analysis={elevenlabs.analysis}
          feedback={conversation?.feedback as any}
        />
        <TranscriptSection
          transcript={elevenlabs.transcript}
          conversationId={id}
        />
      </div>
    </div>
  );
}
