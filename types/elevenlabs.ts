// @/types/elevenlabs.ts
export type ConversationMessage = {
  role: "user" | "agent";
  message: string;
  time_in_call_secs?: number;
};

export type ConversationMetadata = {
  conversation_id: string;
  agent_id: string;
  status: string;
  start_time_unix_secs?: number;
  duration_secs?: number;
};

export type EvaluationCriterionResult = {
  criteria_id: string;
  result: "success" | "failure" | "unknown";
  rationale: string;
};

export type DataCollectionResult = {
  data_collection_id: string;
  value: any; // String, number, boolean, or array depending on config
  json_schema?: any;
};

export type ConversationAnalysis = {
  evaluation_criteria_results?: Record<string, EvaluationCriterionResult>;
  data_collection_results?: Record<string, DataCollectionResult>;
};

export type ConversationTranscript = {
  transcript: ConversationMessage[];
  metadata: ConversationMetadata;
  analysis?: ConversationAnalysis;
};

export type ConversationResponse = {
  conversation: ConversationTranscript;
};

export type AudioResponse = {
  audio_url: string;
};
