"use client";

import { Loader2Icon, PhoneIcon, PhoneOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type AgentState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | null;

interface CallControlsProps {
  agentState: AgentState;
  onCall: () => void;
}

export function CallControls({ agentState, onCall }: CallControlsProps) {
  const isCallActive = agentState === "connected";
  const isTransitioning =
    agentState === "connecting" || agentState === "disconnecting";

  return (
    <Button
      onClick={onCall}
      disabled={isTransitioning}
      size="icon"
      variant={isCallActive ? "secondary" : "default"}
      className="h-12 w-12 rounded-full"
    >
      {isTransitioning ? (
        <Loader2Icon className="h-5 w-5 animate-spin" />
      ) : isCallActive ? (
        <PhoneOffIcon className="h-5 w-5" />
      ) : (
        <PhoneIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
