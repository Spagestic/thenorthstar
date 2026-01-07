// app/api/ai/extract/details/route.ts
import { generateText, Output } from "ai";
import { z } from "zod";
import { mistral } from "@ai-sdk/mistral";
import { NextRequest, NextResponse } from "next/server";
import { JobPostingSchema } from "./schema";

export async function POST(req: NextRequest) {
    const { markdown } = await req.json();

    const result = await generateText({
        model: mistral("mistral-large-latest"),
        output: Output.object({
            schema: JobPostingSchema,
        }),
        prompt:
            `You are an expert HR data extractor. precise JSON from this job posting markdown:\n\n
        ${markdown}`,
    });

    // result.output is the typed object according to JobPostSchema
    return NextResponse.json(result.output);
}
