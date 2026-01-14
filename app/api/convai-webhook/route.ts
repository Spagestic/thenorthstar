// app/api/convai-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createClient } from "@/lib/supabase/server";

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

// optional: cache in DB (Supabase/Prisma)
async function saveFeedbackToDb(data: {
    conversationId: string;
    feedback: any;
}) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("voice_conversations")
        .update({ feedback: data.feedback })
        .eq("conversation_id", data.conversationId);

    if (error) {
        console.error("Error saving feedback to DB:", error);
    }
}

async function constructWebhookEvent(req: NextRequest, secret?: string) {
    const body = await req.text();
    const signatureHeader = req.headers.get("ElevenLabs-Signature") ?? "";
    return elevenlabs.webhooks.constructEvent(
        body,
        signatureHeader,
        secret ?? "",
    );
}

export async function POST(req: NextRequest) {
    const secret = process.env.ELEVENLABS_CONVAI_WEBHOOK_SECRET;
    const { event, error } = await constructWebhookEvent(req, secret);

    if (error) {
        return NextResponse.json({ error }, { status: 401 });
    }

    if (event.type === "post_call_transcription") {
        const { conversation_id, analysis, agent_id } = event.data;

        // Optional: only handle your Ovoxa agent
        if (agent_id !== process.env.ELEVENLABS_AGENT_ID) {
            return NextResponse.json({ skipped: true }, { status: 200 });
        }

        const transcript =
            analysis.data_collection_results.full_transcript?.value ??
                analysis.transcript ?? ""; // fallback if you expose raw transcript

        // Call your feedback route (internal call for separation of concerns)
        const feedbackRes = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/feedback`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transcript,
                    analysis,
                    conversationId: conversation_id,
                }),
            },
        );

        if (!feedbackRes.ok) {
            return NextResponse.json(
                { error: "Failed to generate feedback" },
                { status: 500 },
            );
        }

        const feedbackJson = await feedbackRes.json();

        // Persist for later retrieval in UI
        await saveFeedbackToDb({
            conversationId: conversation_id,
            feedback: feedbackJson,
        });

        return NextResponse.json({ received: true }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
