// @/app/(protected)/history/[id]/actions.ts
"use server";

import type { ConversationResponse } from "@/types/elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1/convai/conversations";

export async function getConversation(conversationId: string) {
    if (!ELEVENLABS_API_KEY) {
        throw new Error("API key not configured");
    }

    if (!conversationId) {
        throw new Error("Missing conversation_id parameter");
    }

    try {
        // Get transcript & metadata
        const transcriptRes = await fetch(
            `${ELEVENLABS_BASE_URL}/${conversationId}`,
            {
                headers: {
                    "xi-api-key": ELEVENLABS_API_KEY,
                },
                cache: "no-store",
            },
        );

        if (!transcriptRes.ok) {
            const errorData = await transcriptRes.json().catch(() => ({}));
            throw new Error(errorData.detail || "Failed to fetch conversation");
        }

        const conversationData = await transcriptRes.json();

        return {
            conversation:
                conversationData as ConversationResponse["conversation"],
        };
    } catch (err: any) {
        console.error("Error fetching conversation:", err);
        throw new Error(err?.message || "Unknown error");
    }
}
