import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1/convai/conversations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversation_id = searchParams.get("conversation_id");

  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  if (!conversation_id) {
    return NextResponse.json(
      { error: "Missing conversation_id parameter" },
      { status: 400 }
    );
  }

  try {
    // Get audio download URL
    const audioRes = await fetch(
      `${ELEVENLABS_BASE_URL}/${conversation_id}/audio`,
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!audioRes.ok) {
      const errorData = await audioRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch audio" },
        { status: audioRes.status }
      );
    }

    const audioData = await audioRes.json();

    return NextResponse.json({
      audio_url: audioData.audio_url,
    });
  } catch (err: any) {
    console.error("Error fetching audio:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
