// app/api/ai/extract/details/route.ts
import { generateText, Output } from "ai";
import { z } from "zod";
import { mistral } from "@ai-sdk/mistral";
import { NextRequest, NextResponse } from "next/server";

// Define the schema you want for your UI
const JobPostSchema = z.object({
    title: z.string(),
    location: z.string(),
    salary: z.string().optional(),
    description: z.string().describe("A brief summary of the role"),
    requirements: z.array(z.string()).optional(),
    applyLink: z.string().optional(),
});

export async function POST(req: NextRequest) {
    const { markdown } = await req.json();

    const result = await generateText({
        model: mistral("mistral-large-latest"),
        output: Output.object({
            schema: JobPostSchema,
        }),
        prompt: `Extract structured data from this job posting:\n\n${
            markdown.substring(0, 20000)
        }`,
    });

    // result.output is the typed object according to JobPostSchema
    return NextResponse.json(result.output);
}
