// @/app/(protected)/history/[id]/page.tsx
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../../Header";
import { ConversationHistory } from "./conversation-history";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getConversation } from "./actions";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ConversationContent params={params} />
    </Suspense>
  );
}

async function ConversationContent({
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

  // Fetch conversation data from ElevenLabs
  let conversationData = null;
  let conversationError = null;

  try {
    const result = await getConversation(conversationId);
    conversationData = result.conversation;
  } catch (err: any) {
    conversationError = err.message || "Failed to load conversation";
  }

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
        initialConversation={conversationData}
        initialError={conversationError}
      />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div>
      <Header nav={[{ label: "History" }]} />
      <div className="container mx-auto p-6 max-w-5xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
