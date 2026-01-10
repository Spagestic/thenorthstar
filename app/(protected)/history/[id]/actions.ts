// @/app/(protected)/history/[id]/actions.ts
"use server";

import { unstable_cache } from "next/cache";
import type { Conversation } from "@/types/elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1/convai/conversations";

export const getConversation = unstable_cache(
    async (conversationId: string) => {
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
                },
            );

            if (!transcriptRes.ok) {
                const errorData = await transcriptRes.json().catch(() => ({}));
                throw new Error(
                    errorData.detail || "Failed to fetch conversation",
                );
            }

            const conversationData = await transcriptRes.json();

            return {
                conversation: conversationData as Conversation,
            };
        } catch (err: any) {
            console.error("Error fetching conversation:", err);
            throw new Error(err?.message || "Unknown error");
        }
    },
    ["conversation-data"], // Cache Key
    { revalidate: 3600 * 24 }, // Cache for 24 hours
);
