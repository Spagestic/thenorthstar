"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Clock, Calendar } from "lucide-react";
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
import type { ConversationResponse } from "@/types/elevenlabs";

type ConversationHistoryProps = {
  conversationId: string;
  jobTitle?: string;
  companyName?: string;
  industryName?: string;
  startedAt: string | null;
};

export function ConversationHistory({
  conversationId,
  jobTitle,
  companyName,
  industryName,
  startedAt,
}: ConversationHistoryProps) {
  const [conversation, setConversation] = useState<
    ConversationResponse["conversation"] | null
  >(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchConversation() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/conversations?conversation_id=${conversationId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch conversation");
        }

        const data: ConversationResponse = await response.json();
        setConversation(data.conversation);

        // Set the audio URL immediately after loading conversation
        const audioApiUrl = `/api/conversations/audio?conversation_id=${conversationId}`;
        setAudioUrl(audioApiUrl);
      } catch (err: any) {
        console.error("Error fetching conversation:", err);
        setError(err.message || "Failed to load conversation");
      } finally {
        setLoading(false);
      }
    }

    fetchConversation();
  }, [conversationId]);

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

  if (loading) {
    return (
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
    );
  }

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
                      <Orb className="size-8 shrink-0" />
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

        {/* Analysis Card (if available) */}
        {/* {conversation?.analysis?.evaluation_criteria_results && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(
                conversation.analysis.evaluation_criteria_results
              ).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <Badge>{String(value)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}
      </div>
    </AudioPlayerProvider>
  );
}
