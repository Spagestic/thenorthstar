// @/app/(protected)/history/[id]/components/audio-player-section.tsx
"use client";

import { useState } from "react";
import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerProgress,
  AudioPlayerDuration,
  AudioPlayerSpeed,
} from "@/components/ui/audio-player";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Download } from "lucide-react";

export function AudioPlayerSection({
  conversationId,
  jobTitle,
  companyName,
  industryName,
  transcriptSummary,
  duration,
  status,
  startedAt,
}: any) {
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <AudioPlayerProvider>
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
            {duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">
                    {formatDuration(duration)}
                  </p>
                </div>
              </div>
            )}

            <Badge variant={status === "done" ? "default" : "secondary"}>
              {status || "Unknown"}
            </Badge>
          </div>

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
        <CardFooter>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {transcriptSummary}
          </p>
        </CardFooter>
      </Card>
    </AudioPlayerProvider>
  );
}
