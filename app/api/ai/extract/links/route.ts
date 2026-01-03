// app/api/extract/links/route.ts
import { generateText, Output } from "ai";
import { z } from "zod";
import { mistralModel } from "@/app/api/ai/mistralClient";
import { NextRequest, NextResponse } from "next/server";

const JobLinksSchema = z.object({
    jobLinks: z
        .array(z.url())
        .describe("List of absolute URLs for individual job postings"),
});

export async function POST(req: NextRequest) {
    const { markdown, baseUrl } = await req.json();

    const result = await generateText({
        model: mistralModel,
        output: Output.object({
            schema: JobLinksSchema,
        }),
        prompt: `
You are a job scraper. Extract all valid job posting links from this markdown.
The base URL is: ${baseUrl} (use this to resolve relative links if needed).

MARKDOWN CONTENT:
${
            markdown.substring(0, 30000)
        } // Truncate to avoid context limits if page is huge
`,
    });

    return NextResponse.json(result.output);
}
