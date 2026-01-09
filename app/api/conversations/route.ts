// app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1/convai/conversations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversation_id = searchParams.get("conversation_id");

  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  if (!conversation_id) {
    return NextResponse.json(
      { error: "Missing conversation_id parameter" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${ELEVENLABS_BASE_URL}/${conversation_id}`, {
      method: "GET",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch conversation" },
        { status: res.status },
      );
    }

    const conversationData = await res.json();

    // This already contains agent_id, transcript, metadata, analysis, etc.
    return NextResponse.json(conversationData);
  } catch (err: any) {
    console.error("Error fetching conversation:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
