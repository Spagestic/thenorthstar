// @/types/elevenlabs.ts
export type ConversationMessage = {
  role: "user" | "agent";
  message: string;
  timestamp?: number;
};

export type ConversationMetadata = {
  conversation_id: string;
  agent_id: string;
  status: string;
  start_time_unix_secs?: number;
  end_time_unix_secs?: number;
  duration_secs?: number;
};

export type ConversationTranscript = {
  transcript: ConversationMessage[];
  metadata: ConversationMetadata;
  analysis?: {
    evaluation_criteria_results?: Record<string, any>;
  };
};

export type ConversationResponse = {
  conversation: ConversationTranscript;
};

export type AudioResponse = {
  audio_url: string;
};
