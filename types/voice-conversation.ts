export type VoiceConversation = {
  id: string;
  user_id: string;
  conversation_id: string;
  agent_id?: string;
  started_at: string | null;
  created_at: string;
  job_id: string;
};

export type VoiceConversationInsert = Omit<
  VoiceConversation,
  "id" | "created_at"
>;
