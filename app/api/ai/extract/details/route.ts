// app/api/ai/extract/details/route.ts
import { generateText, Output } from "ai";
import { z } from "zod";
import { mistral } from "@ai-sdk/mistral";
import { NextRequest, NextResponse } from "next/server";
import { JobPostingSchema } from "./schema";

export async function POST(req: NextRequest) {
    try {
        const { markdown, url, validationErrors, isRetry } = await req.json();

        let prompt =
            `You are an expert HR data extractor. Extract precise JSON from this job posting markdown.
        If a value is not found, use null or omit the key.
        For description, return canonical markdown for the actual job content only.
        Exclude navigation, footer, cookie, share, login, and apply-widget chrome unless it contains unique job details.
        Normalize headings, bullets, and spacing so the markdown is clean and readable.
        Preserve meaningful sections like responsibilities, requirements, benefits, compensation, and application steps.
        ${url ? `The URL of this job is: ${url}` : ""}
        Markdown:\n\n${markdown}`;

        if (isRetry && validationErrors) {
            prompt =
                `PREVIOUS EXTRACTION FAILED VALIDATION. Please fix the following errors in your extraction:
            ${JSON.stringify(validationErrors, null, 2)}
            Keep description as canonical markdown for the job content only, with clean headings, bullets, and spacing.
            
            Original Source Markdown:
            ${markdown}`;
        }

        const result = await generateText({
            model: mistral("mistral-large-latest"),
            output: Output.object({
                schema: JobPostingSchema,
            }),
            prompt: prompt,
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
