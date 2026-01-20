// @/app/(protected)/history/[id]/page.tsx
import { Suspense } from "react";
import { PageSkeleton } from "./page-skeleton";
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/(protected)/Header";
import { getConversation } from "./actions";
import { TranscriptSection } from "./components/transcript-section";
import { ErrorToaster } from "./components/error-toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getCompanyLogo } from "@/lib/company-logos";
import { format } from "date-fns";
import { Copy } from "lucide-react";

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

  const feedback = conversation?.feedback as any;
  const startedAt = conversation?.started_at
    ? new Date(conversation.started_at)
    : new Date();

  return (
    <div className="min-h-screen bg-background">
      <ErrorToaster error={finalError} />
      <Header
        nav={[
          { label: "History", href: "/dashboard" },
          { label: jobData.company.name, href: "#" },
          { label: jobData.title, href: `/job/${jobData.id}` },
        ]}
      />
      <div className="container mx-auto p-6 max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                Interview Results
              </h1>
              <Badge
                variant="outline"
                className="text-muted-foreground font-normal bg-muted/50"
              >
                <Copy />
                ID: ...{id.slice(-7)}
              </Badge>
            </div>
            <div className="text-muted-foreground text-sm">
              {format(startedAt, "MMM d, h:mm a")}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {getCompanyLogo(jobData.company.name) && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white p-1 shadow-sm ring-1 ring-border">
                <Image
                  src={getCompanyLogo(jobData.company.name)}
                  alt={jobData.company.name}
                  className="h-full w-full object-contain"
                  fill
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {jobData.company.name}
              </p>
              <h2 className="text-xl font-semibold">{jobData.title}</h2>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
            <TabsTrigger
              value="overview"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="transcription"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Transcription
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="space-y-8 py-6 animate-in fade-in-50 slide-in-from-bottom-2"
          >
            {/* Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feedback?.summary ||
                  "No summary available for this interview."}
              </p>
            </div>

            <Separator />

            {/* Stage Feedback */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Stage Feedback</h3>
              <Separator className="" />
              {/* Introduction */}
              <div className="px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      Introduction
                    </h4>
                    <span className="text-sm font-medium text-muted-foreground">
                      {feedback?.communication_score || 0}/10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback?.stage_feedback?.introduction ||
                      "No feedback available."}
                  </p>
                  <Separator className="my-4" />
                </div>

                {/* Technical */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Technical</h4>
                    <span className="text-sm font-medium text-muted-foreground">
                      {feedback?.technical_score || 0}/10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback?.stage_feedback?.technical ||
                      "No feedback available."}
                  </p>
                  <Separator className="my-4" />
                </div>

                {/* Behavioral */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Behavioral</h4>
                    <span className="text-sm font-medium text-muted-foreground">
                      {feedback?.behavioral_score || 0}/10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback?.stage_feedback?.behavioral ||
                      "No feedback available."}
                  </p>
                  <Separator className="my-4" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="transcription"
            className="animate-in fade-in-50 slide-in-from-bottom-2"
          >
            <TranscriptSection
              transcript={elevenlabs.transcript}
              conversationId={id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
