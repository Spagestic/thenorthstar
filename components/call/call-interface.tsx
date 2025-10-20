"use client";

import { useCallback, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { CallOrb } from "./call-orb";
import { CallStatus } from "./call-status";
import { CallControls } from "./call-controls";

const DEFAULT_AGENT = {
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
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
  job_title: string;
  company_name: string;
};

export function CallInterface({ job_title, company_name }: CallInterfaceProps) {
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => {
      console.error("Error:", error);
      setAgentState("disconnected");
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setErrorMessage(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: DEFAULT_AGENT.agentId,
        dynamicVariables: { job_title: job_title, company_name: company_name },
        connectionType: "webrtc",
        onStatusChange: (status) => setAgentState(status.status),
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      setAgentState("disconnected");
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage(
          "Please enable microphone permissions in your browser."
        );
      }
    }
  }, [conversation]);

  const handleCall = useCallback(() => {
    if (agentState === "disconnected" || agentState === null) {
      setAgentState("connecting");
      startConversation();
    } else if (agentState === "connected") {
      conversation.endSession();
      setAgentState("disconnected");
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
