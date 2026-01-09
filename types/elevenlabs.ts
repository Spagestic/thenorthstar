// @/types/elevenlabs.ts

export type ConversationMessage = {
  role: "user" | "agent";
  message: string;
  time_in_call_secs?: number;
};

export type ConversationMetadata = {
  start_time_unix_secs?: number;
  call_duration_secs?: number;
  // add other metadata fields as needed
};

export type EvaluationCriterionResult = {
  criteria_id: string;
  result: "success" | "failure" | "unknown";
  rationale: string;
};

export type DataCollectionResult = {
  data_collection_id: string;
  value: any;
  json_schema?: any;
};

export type ConversationAnalysis = {
  call_successful?: "success" | "failure" | "unknown";
  transcript_summary?: string;
  evaluation_criteria_results?: Record<string, EvaluationCriterionResult>;
  data_collection_results?: Record<string, DataCollectionResult>;
  call_summary_title?: string | null;
};

export type Conversation = {
  agent_id: string;
  conversation_id: string;
  status: "initiated" | "in-progress" | "processing" | "done" | "failed";
  transcript: ConversationMessage[];
  metadata: ConversationMetadata;
  has_audio: boolean;
  has_user_audio: boolean;
  has_response_audio: boolean;
  user_id: string | null;
  branch_id: string | null;
  version_id: string | null;
  analysis: ConversationAnalysis | null;
  // optionally add:
  // conversation_initiation_client_data?: any;
  // source_info?: any;
  // dynamic_variables?: Record<string, string | number | boolean | null>;
};

export type ConversationResponse = Conversation;

export type AudioResponse = {
  audio_url: string;
};
