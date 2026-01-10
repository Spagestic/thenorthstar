// @/app/(protected)/history/[id]/components/transcript-section.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Message, MessageContent } from "@/components/ui/message";
import { Orb } from "@/components/ui/orb";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TranscriptSection({ transcript }: { transcript: any[] }) {
  if (!transcript?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Transcript</CardTitle>
      </CardHeader>
      <CardContent>
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
                {msg.role === "agent" && <Orb className="size-8" />}
              </Message>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
