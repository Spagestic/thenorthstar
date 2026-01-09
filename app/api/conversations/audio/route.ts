// app/api/conversations/audio/route.ts
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
    const audioRes = await fetch(
      `${ELEVENLABS_BASE_URL}/${conversation_id}/audio`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        cache: "no-store",
      },
    );

    if (!audioRes.ok) {
      let errorData: any = {};
      try {
        errorData = await audioRes.json();
      } catch {
        // ignore
      }
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch audio" },
        { status: audioRes.status },
      );
    }

    const arrayBuffer = await audioRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": audioRes.headers.get("Content-Type") || "audio/mpeg",
        "Content-Disposition":
          `inline; filename="conversation_${conversation_id}.mp3"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Error fetching audio:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
