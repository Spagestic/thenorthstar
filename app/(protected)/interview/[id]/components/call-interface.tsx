"use client";

import { useCallback, useState, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { useRouter } from "next/navigation";
import { CallOrb } from "./call-orb";
import { CallStatus } from "./call-status";
import { CallControls } from "./call-controls";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_AGENT = {
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_NEW!,
  name: "Interview Agent",
  description: "Tap to start the interview",
};

type AgentState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | null;

type CallInterfaceProps = {
  userId?: string;
  jobId: string;
  job_title: string;
  company_name: string;
  description: string;
  location?: object;
  work_mode?: string;
  employment_type?: string;
};

export function CallInterface({
  userId,
  jobId,
  company_name,
  job_title,
  description,
  location,
  work_mode,
  employment_type,
}: CallInterfaceProps) {
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected");
    },
    onDisconnect: () => {
      console.log("Disconnected");
      if (conversationIdRef.current) {
        router.push(`/history/${conversationIdRef.current}`);
      }
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Error:", error);
      setAgentState("disconnected");
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setErrorMessage(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const conversationId = await conversation.startSession({
        agentId: DEFAULT_AGENT.agentId,
        dynamicVariables: {
          job_title: job_title,
          company_name: company_name,
          description: description,
        },
        connectionType: "webrtc",
        onStatusChange: (status) => setAgentState(status.status),
      });

      // Save conversation to database when it starts
      if (userId && conversationId) {
        conversationIdRef.current = conversationId;

        const { error } = await supabase.from("interviews").insert({
          user_id: userId,
          job_id: jobId,
          agent_id: DEFAULT_AGENT.agentId,
          conversation_id: conversationId,
          started_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error saving conversation:", error);
        }
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      setAgentState("disconnected");
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage(
          "Please enable microphone permissions in your browser.",
        );
      }
    }
  }, [
    conversation,
    userId,
    jobId,
    job_title,
    company_name,
    description,
    location,
    work_mode,
    employment_type,
    supabase,
  ]);

  const handleCall = useCallback(() => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 1000); // Prevent spam clicking for 1 second

    if (agentState === "disconnected" || agentState === null) {
      setAgentState("connecting");
      startConversation();
    } else if (agentState === "connected") {
      setAgentState("disconnecting");
      conversation.endSession();
    }
  }, [agentState, conversation, startConversation]);

  const getInputVolume = useCallback(() => {
    const rawValue = conversation.getInputVolume?.() ?? 0;
    return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5);
  }, [conversation]);

  const getOutputVolume = useCallback(() => {
    const rawValue = conversation.getOutputVolume?.() ?? 0;
    return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5);
  }, [conversation]);

  return (
    <div className="flex h-[84vh] w-full flex-col items-center justify-center overflow-hidden p-6">
      <div className="flex flex-col items-center gap-6">
        <CallOrb
          getInputVolume={getInputVolume}
          getOutputVolume={getOutputVolume}
        />

        <CallStatus
          agentName={DEFAULT_AGENT.name}
          agentState={agentState}
          errorMessage={errorMessage}
        />

        <CallControls agentState={agentState} onCall={handleCall} />
      </div>
    </div>
  );
}
