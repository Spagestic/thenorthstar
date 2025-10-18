"use client";

import { useCallback, useState, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon, PhoneIcon, PhoneOffIcon, AlertTriangleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Orb } from "@/components/ui/orb";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "../Header";

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

type ErrorType = 
  | "api_key_missing"
  | "agent_id_missing"
  | "microphone_permission"
  | "audio_device"
  | "connection_failed"
  | "session_error"
  | null;

export default function Page() {
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);

  // Environment validation
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
      setErrorType("api_key_missing");
      setErrorMessage("ElevenLabs API key is missing. Please check your environment variables.");
    }
    
    if (!DEFAULT_AGENT.agentId) {
      setErrorType("agent_id_missing");
      setErrorMessage("ElevenLabs Agent ID is missing. Please check your environment variables.");
    }
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: (message) => {
      console.log("Message received:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      setAgentState("disconnected");
      setErrorType("session_error");
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Session error: ${errorMessage}`);
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setErrorMessage(null);
      setErrorType(null);
      
      // Check for audio devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      
      if (audioInputs.length === 0) {
        setErrorType("audio_device");
        setErrorMessage("No audio input devices found. Please connect a microphone.");
        return;
      }
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Check if we have an agent ID
      if (!DEFAULT_AGENT.agentId) {
        setErrorType("agent_id_missing");
        setErrorMessage("Agent ID is missing. Please check your environment variables.");
        return;
      }
      
      await conversation.startSession({
        agentId: DEFAULT_AGENT.agentId,
        connectionType: "webrtc",
        onStatusChange: (status) => {
          console.log("Status change:", status);
          setAgentState(status.status);
        },
      });
      
    } catch (error) {
      console.error("Error starting conversation:", error);
      setAgentState("disconnected");
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            setErrorType("microphone_permission");
            setErrorMessage("Microphone permission denied. Please allow microphone access and try again.");
            break;
          case "NotFoundError":
            setErrorType("audio_device");
            setErrorMessage("No microphone found. Please connect a microphone and try again.");
            break;
          case "NotReadableError":
            setErrorType("audio_device");
            setErrorMessage("Microphone is being used by another application. Please close other apps and try again.");
            break;
          default:
            setErrorType("connection_failed");
            setErrorMessage(`Audio error: ${error.message}`);
        }
      } else {
        setErrorType("connection_failed");
        setErrorMessage(`Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
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

  const isCallActive = agentState === "connected";
  const isTransitioning =
    agentState === "connecting" || agentState === "disconnecting";

  const getInputVolume = useCallback(() => {
    const rawValue = conversation.getInputVolume?.() ?? 0;
    return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5);
  }, [conversation]);

  const getOutputVolume = useCallback(() => {
    const rawValue = conversation.getOutputVolume?.() ?? 0;
    return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5);
  }, [conversation]);

  return (
    <div>
      <Header nav={["Call"]} />
      <div className="flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="relative size-32">
            <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
              <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                <Orb
                  className="h-full w-full"
                  volumeMode="manual"
                  getInputVolume={getInputVolume}
                  getOutputVolume={getOutputVolume}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold">{DEFAULT_AGENT.name}</h2>
            <AnimatePresence mode="wait">
              {errorMessage ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full max-w-md"
                >
                  <Alert variant="destructive">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertDescription className="text-center">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              ) : agentState === "disconnected" || agentState === null ? (
                <motion.p
                  key="disconnected"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-muted-foreground text-sm"
                >
                  {DEFAULT_AGENT.description}
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

          <Button
            onClick={handleCall}
            disabled={isTransitioning}
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
        </div>
        
      </div>
    </div>
  );
}
