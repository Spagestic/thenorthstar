// app/api/ai/feedback/route.ts
import { generateText, Output } from "ai";
import { z } from "zod";
import { mistral } from "@ai-sdk/mistral";
import { NextRequest, NextResponse } from "next/server";

const FeedbackSchema = z.object({
    technical_score: z
        .number()
        .min(1)
        .max(10)
        .describe("1-10 technical conceptual understanding"),
    communication_score: z
        .number()
        .min(1)
        .max(10)
        .describe("1-10 clarity, conciseness, articulation"),
    behavioral_score: z
        .number()
        .min(1)
        .max(10)
        .describe("1-10 behavioral competence across scenarios"),
    strengths: z
        .array(z.string())
        .describe("Bullet points describing what the candidate did well"),
    improvements: z
        .array(z.string())
        .describe(
            "Actionable suggestions for improvement, phrased constructively",
        ),
    stage_feedback: z.object({
        introduction: z.string().describe("Feedback on Stage 1 introduction"),
        technical: z.string().describe(
            "Feedback on Stage 2 technical deep dive",
        ),
        behavioral: z.string().describe(
            "Feedback on Stage 3 behavioral answers",
        ),
    }),
    summary: z.string().describe("Short overall summary in 2-3 sentences"),
});

export async function POST(req: NextRequest) {
    const { transcript, analysis, conversationId } = await req.json();

    const result = await generateText({
        model: mistral("mistral-large-latest"),
        output: Output.object({ schema: FeedbackSchema }),
        prompt: `
You are an expert technical interviewer and career coach.
You will receive a full interview transcript (voice-based mock interview) and should provide structured, pragmatic feedback.

Interview structure:
- Stage 1: Introduction (background, projects, motivation).
- Stage 2: Technical deep dive (concepts, comparisons, trade-offs).
- Stage 3: Behavioral (STAR: Situation, Task, Action, Result).

Scoring rules:
- technical_score: 1-10 based ONLY on correctness, depth, and intuition of technical answers.
- communication_score: 1-10 based on clarity, conciseness, pacing, and structure across the entire call.
- behavioral_score: 1-10 based on how well answers follow STAR, show ownership, reflection, and learning.

Constraints:
- Be honest but supportive.
- Make improvements highly actionable and concrete.
- Assume the candidate is preparing for software/ML roles and wants to practice effectively.

Return JSON ONLY following the schema.

TRANSCRIPT:
${transcript}

OPTIONAL ANALYSIS OBJECT:
${JSON.stringify(analysis ?? {}, null, 2)}
`,
    });

    return NextResponse.json({
        conversationId,
        ...result.output, // typed FeedbackSchema
    });
}
