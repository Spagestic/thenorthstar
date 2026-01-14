import { Feedback } from "@/app/api/ai/feedback/route";

export type VoiceConversation = {
  id: string;
  user_id: string;
  conversation_id: string;
  agent_id?: string;
  started_at: string | null;
  created_at: string;
  job_id: string;
  feedback?: Feedback | null;
};

export type VoiceConversationInsert = Omit<
  VoiceConversation,
  "id" | "created_at"
>;
