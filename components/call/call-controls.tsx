"use client";

import { AnimatePresence, motion } from "framer-motion";
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
  isDataLoaded?: boolean;
}

export function CallControls({
  agentState,
  onCall,
  isDataLoaded = true,
}: CallControlsProps) {
  const isCallActive = agentState === "connected";
  const isTransitioning =
    agentState === "connecting" || agentState === "disconnecting";

  return (
    <Button
      onClick={onCall}
      disabled={isTransitioning || !isDataLoaded}
      size="icon"
      variant={isCallActive ? "secondary" : "default"}
      className="h-12 w-12 rounded-full"
    >
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            }}
          >
            <Loader2Icon className="h-5 w-5" />
          </motion.div>
        ) : isCallActive ? (
          <motion.div
            key="end"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <PhoneOffIcon className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <PhoneIcon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
