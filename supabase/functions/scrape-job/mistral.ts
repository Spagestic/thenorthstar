import { Mistral } from "@mistralai/mistralai";
import { JobPostingSchema } from "./schema.ts";
import { MISTRAL_EXTRACTION_PROMPT } from "./schema.ts";
import {
  buildMinimalJob,
  normalizeMistralContentToText,
  stripJsonCodeFence,
} from "./helpers.ts";
import type { ExtractionParams, JobPosting } from "./types.ts";

export async function extractStructuredJobWithMistral(
  params: ExtractionParams,
): Promise<JobPosting> {
  const { markdown, targetUrl, apiKey } = params;
  const model = Deno.env.get("MISTRAL_MODEL") ?? "mistral-large-latest";

  // ── Instantiate the Mistral SDK client ──
  const client = new Mistral({ apiKey });

  let lastRaw: Record<string, unknown> = {};
  let validationErrors: import("zod").ZodIssue[] | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    const retryContext = validationErrors
      ? `\nPrevious output failed validation. Fix these issues:\n${
        JSON.stringify(
          validationErrors,
          null,
          2,
        )
      }`
      : "";

    // ── SDK call instead of raw fetch ──
    const chatResponse = await client.chat.complete({
      model,
      temperature: 0,
      responseFormat: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert HR data extractor that outputs strict JSON.",
        },
        {
          role: "user",
          content:
            `${MISTRAL_EXTRACTION_PROMPT}${retryContext}\n\nJob URL: ${targetUrl}\n\nMarkdown:\n${markdown}`,
        },
      ],
    });

    // ── Extract content from SDK response ──
    const content = chatResponse.choices?.[0]?.message?.content;
    const contentText = stripJsonCodeFence(
      normalizeMistralContentToText(content),
    );

    let parsed: unknown = {};
    try {
      parsed = JSON.parse(contentText || "{}");
    } catch {
      parsed = {};
    }

    const raw = parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : {};

    lastRaw = raw;

    const parseResult = JobPostingSchema.safeParse({
      ...raw,
      url: typeof raw.url === "string" && raw.url.trim() ? raw.url : targetUrl,
      description: typeof raw.description === "string" && raw.description.trim()
        ? raw.description
        : markdown,
    });

    if (parseResult.success) {
      return parseResult.data;
    }

    validationErrors = parseResult.error.issues;
  }

  console.warn(
    "Mistral output failed schema validation after retry",
    validationErrors,
  );
  return buildMinimalJob(targetUrl, markdown, lastRaw);
}
