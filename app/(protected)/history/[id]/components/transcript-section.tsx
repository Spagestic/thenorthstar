// @/app/(protected)/history/[id]/components/transcript-section.tsx
"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Message, MessageContent } from "@/components/ui/message";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerProgress,
  AudioPlayerDuration,
  AudioPlayerSpeed,
} from "@/components/ui/audio-player";

export function TranscriptSection({
  transcript,
  conversationId,
}: {
  transcript: any[];
  conversationId: string;
}) {
  if (!transcript?.length) return null;
  const [downloading, setDownloading] = useState(false);
  const audioUrl = `/api/conversations/audio?conversation_id=${conversationId}`;

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

  return (
    <AudioPlayerProvider>
      <Card>
        <CardHeader>
          <CardTitle>Conversation Transcript</CardTitle>
        </CardHeader>
        <CardContent>
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
        <CardFooter className="flex justify-end">
          {" "}
          <ScrollArea className="h-120 rounded-md border border-accent px-8 py-2">
            <div className="space-y-4">
              {transcript.map((msg, idx) => (
                <Message
                  key={idx}
                  from={msg.role === "user" ? "user" : "assistant"}
                >
                  <MessageContent>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </MessageContent>
                  {msg.role === "agent" && (
                    <Image
                      src={"/orb.png"}
                      alt="Orb"
                      width={14}
                      height={14}
                      className="size-8 rounded-full"
                    />
                  )}
                </Message>
              ))}
            </div>
          </ScrollArea>
        </CardFooter>
      </Card>
    </AudioPlayerProvider>
  );
}
