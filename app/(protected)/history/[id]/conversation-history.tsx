// @/app/(protected)/history/[id]/conversation-history.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Activity,
} from "lucide-react";
import { Message, MessageContent } from "@/components/ui/message";
import { Orb } from "@/components/ui/orb";
import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerProgress,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed,
} from "@/components/ui/audio-player";
import type {
  ConversationResponse,
  EvaluationCriterionResult,
} from "@/types/elevenlabs";

type ConversationHistoryProps = {
  conversationId: string;
  jobTitle?: string;
  companyName?: string;
  industryName?: string;
  startedAt: string | null;
  initialConversation: ConversationResponse["conversation"] | null;
  initialError: string | null;
};

export function ConversationHistory({
  conversationId,
  jobTitle,
  companyName,
  industryName,
  startedAt,
  initialConversation,
  initialError,
}: ConversationHistoryProps) {
  const [downloading, setDownloading] = useState(false);
  const conversation = initialConversation;
  const error = initialError;

  // Set the audio URL
  const audioUrl = `/api/conversations/audio?conversation_id=${conversationId}`;

  // Helper for Success/Failure Icons
  const getStatusIcon = (result: "success" | "failure" | "unknown") => {
    switch (result) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failure":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Helper to format data collection values
  const renderDataValue = (key: string, value: any) => {
    if (typeof value === "boolean") {
      return value ? (
        <Badge className="bg-green-600">Yes</Badge>
      ) : (
        <Badge variant="destructive">No</Badge>
      );
    }
    // Handle 1-10 scores specifically if key contains "score"
    if (typeof value === "number" && key.includes("score")) {
      return (
        <div className="flex items-center gap-2 w-full max-w-[200px]">
          <span className="font-bold text-lg">{value}/10</span>
          <Progress value={value * 10} className="h-2" />
        </div>
      );
    }
    if (typeof value === "number") {
      return <span className="font-mono">{value}</span>;
    }
    return <span className="text-sm">{String(value)}</span>;
  };

  const handleDownloadAudio = async () => {
    try {
      setDownloading(true);
      const audioApiUrl = `/api/conversations/audio?conversation_id=${conversationId}`;

      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = audioApiUrl;
      link.download = `conversation_${conversationId}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Error downloading audio:", err);
      alert(err.message || "Failed to download audio");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const analysis = conversation?.analysis;
  const evaluationResults = analysis?.evaluation_criteria_results;
  const dataCollection = analysis?.data_collection_results;

  return (
    <AudioPlayerProvider>
      <div className="container mx-auto p-6 max-w-5xl space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">
                  {jobTitle || "Interview"}
                </CardTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {companyName && (
                    <Badge variant="secondary">{companyName}</Badge>
                  )}
                  {industryName && (
                    <Badge variant="outline">{industryName}</Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={handleDownloadAudio}
                disabled={downloading}
                variant="outline"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloading ? "Downloading..." : "Download Audio"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Started</p>
                  <p className="text-sm font-medium">{formatDate(startedAt)}</p>
                </div>
              </div>
              {conversation?.metadata?.duration_secs && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium">
                      {formatDuration(conversation.metadata.duration_secs)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    conversation?.metadata?.status === "done"
                      ? "default"
                      : "secondary"
                  }
                >
                  {conversation?.metadata?.status || "Unknown"}
                </Badge>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <AudioPlayerButton
                  item={
                    audioUrl
                      ? {
                          id: conversationId,
                          src: audioUrl,
                        }
                      : undefined
                  }
                  variant="default"
                  size="icon"
                  className="shrink-0"
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <AudioPlayerTime className="text-xs" />
                  <div className="flex-1">
                    <AudioPlayerProgress />
                  </div>
                  <AudioPlayerDuration className="text-xs" />
                </div>
                <AudioPlayerSpeed variant="ghost" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis & Feedback Section */}
        {(evaluationResults || dataCollection) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col: Success Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Success Criteria
                </CardTitle>
                <CardDescription>Automated pass/fail checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluationResults ? (
                  Object.entries(evaluationResults).map(([key, item]) => (
                    <div
                      key={key}
                      className="flex flex-col space-y-1 pb-3 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        {getStatusIcon(item.result)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.rationale}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No evaluation criteria found.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Right Col: Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Data
                </CardTitle>
                <CardDescription>
                  Key details from the interview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataCollection ? (
                  Object.entries(dataCollection).map(([key, item]) => (
                    <div
                      key={key}
                      className="flex flex-col space-y-1 pb-3 border-b last:border-0 last:pb-0"
                    >
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {key.replace(/_/g, " ")}
                      </span>
                      <div className="mt-1">
                        {renderDataValue(key, item.value)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No data collected.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transcript Card */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {conversation?.transcript && conversation.transcript.length > 0 ? (
              <div className="space-y-0">
                {conversation.transcript.map((message, index) => (
                  <Message
                    key={index}
                    from={message.role === "user" ? "user" : "assistant"}
                  >
                    <MessageContent>
                      <p className="whitespace-pre-wrap">{message.message}</p>
                    </MessageContent>
                    {message.role === "agent" && (
                      <Orb className="size-8 shrink-0 border rounded-full" />
                    )}
                  </Message>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No transcript available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AudioPlayerProvider>
  );
}
