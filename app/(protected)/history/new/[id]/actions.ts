// @/app/(protected)/history/[id]/actions.ts
"use server";

import { unstable_cache } from "next/cache";
import type { Conversation } from "@/types/elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1/convai/conversations";

const DUMMY_CONVERSATION: Conversation = {
    agent_id: "",
    conversation_id: "",
    status: "failed",
    transcript: [],
    metadata: {
        start_time_unix_secs: 0,
        call_duration_secs: 0,
    },
    has_audio: false,
    has_user_audio: false,
    has_response_audio: false,
    user_id: null,
    branch_id: null,
    version_id: null,
    analysis: {
        call_successful: "unknown",
        transcript_summary: "No data available.",
        evaluation_criteria_results: {},
        data_collection_results: {},
    },
};

export const getConversation = unstable_cache(
    async (
        conversationId: string,
    ): Promise<{ conversation: Conversation; error?: string }> => {
        if (!ELEVENLABS_API_KEY) {
            return {
                conversation: DUMMY_CONVERSATION,
                error: "API key not configured",
            };
        }

        if (!conversationId) {
            return {
                conversation: DUMMY_CONVERSATION,
                error: "Missing conversation_id parameter",
            };
        }

        try {
            // Get transcript & metadata
            const transcriptRes = await fetch(
                `${ELEVENLABS_BASE_URL}/${conversationId}`,
                {
                    headers: {
                        "xi-api-key": ELEVENLABS_API_KEY,
                    },
                },
            );

            if (!transcriptRes.ok) {
                const errorData = await transcriptRes.json().catch(() => ({}));
                let errorMessage = "Failed to fetch conversation";

                if (typeof errorData.detail === "string") {
                    errorMessage = errorData.detail;
                } else if (
                    errorData.detail && typeof errorData.detail === "object"
                ) {
                    errorMessage = errorData.detail.message ||
                        JSON.stringify(errorData.detail);
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }

                return {
                    conversation: DUMMY_CONVERSATION,
                    error: errorMessage,
                };
            }

            const conversationData = await transcriptRes.json();

            return {
                conversation: conversationData as Conversation,
            };
        } catch (err: any) {
            console.error("Error fetching conversation:", err);
            const errorMessage = typeof err === "string"
                ? err
                : err?.message || "Unknown error";

            return {
                conversation: DUMMY_CONVERSATION,
                error: errorMessage,
            };
        }
    },
    ["conversation-data"], // Cache Key
    { revalidate: 3600 * 24 }, // Cache for 24 hours
);
