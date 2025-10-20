"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShimmeringText } from "@/components/ui/shimmering-text";

type AgentState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | null;

interface CallStatusProps {
  agentName: string;
  agentState: AgentState;
  errorMessage: string | null;
}

export function CallStatus({
  agentName,
  agentState,
  errorMessage,
}: CallStatusProps) {
  const isTransitioning =
    agentState === "connecting" || agentState === "disconnecting";

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-xl font-semibold">{agentName}</h2>
      <AnimatePresence mode="wait">
        {errorMessage ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-destructive text-center text-sm"
          >
            {errorMessage}
          </motion.p>
        ) : agentState === "disconnected" || agentState === null ? (
          <motion.p
            key="disconnected"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-muted-foreground text-sm"
          >
            Tap to start the interview
          </motion.p>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                agentState === "connected" && "bg-green-500",
                isTransitioning && "bg-primary/60 animate-pulse"
              )}
            />
            <span className="text-sm capitalize">
              {isTransitioning ? (
                <ShimmeringText text={agentState} />
              ) : (
                <span className="text-green-600">Connected</span>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
