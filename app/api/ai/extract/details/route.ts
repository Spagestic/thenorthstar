// app/api/ai/extract/details/route.ts
import { generateText, Output } from "ai";
import { z } from "zod";
import { mistral } from "@ai-sdk/mistral";
import { NextRequest, NextResponse } from "next/server";
import { JobPostingSchema } from "./schema";

export async function POST(req: NextRequest) {
    try {
        const { markdown, url } = await req.json();

        const result = await generateText({
            model: mistral("mistral-large-latest"),
            output: Output.object({
                schema: JobPostingSchema,
            }),
            prompt:
                `You are an expert HR data extractor. Extract precise JSON from this job posting markdown.
                If a value is not found, use null or omit the key.
                ${url ? `The URL of this job is: ${url}` : ""}
                Markdown:\n\n${markdown}`,
        });

        const output = result.output;
        // Ensure URL is present if passed in but missing in extraction
        if (!output.url && url) {
            output.url = url;
        }

        return NextResponse.json(output);
    } catch (error: any) {
        console.error("Extraction error:", error);
        return NextResponse.json(
            { error: "Failed to extract job details", details: error.message },
            { status: 500 },
        );
    }
}
