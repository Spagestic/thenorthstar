import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { JobPostingSchema } from "./JobPostingSchema.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Convert Zod schema to JSON Schema for Firecrawl's extract format
const JOB_POSTING_JSON_SCHEMA = z.toJSONSchema(JobPostingSchema) as Record<
  string,
  unknown
>;

type JobPosting = z.infer<typeof JobPostingSchema>;

const MISTRAL_EXTRACTION_PROMPT = [
  "Extract all job posting details from this markdown into strict JSON.",
  "Use this JSON schema shape:",
  JSON.stringify(JOB_POSTING_JSON_SCHEMA),
  "Rules:",
  "- Return ONLY valid JSON object and no additional text.",
  "- If a field is not found, use null.",
  "- Preserve full job description in markdown for description.",
  "- workMode must be one of REMOTE, HYBRID, ONSITE, UNKNOWN.",
  "- employmentType must be one of FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN, VOLUNTEER, OTHER.",
].join("\n");

const DEFAULT_ACTIONS = [
  { type: "wait", milliseconds: 2000 },
  { type: "scroll", direction: "down" },
  { type: "wait", milliseconds: 1000 },
  { type: "scroll", direction: "down" },
  { type: "wait", milliseconds: 1000 },
];

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toIsoOrNull(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeMistralContentToText(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    const chunks = content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          const text = (item as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }
        return "";
      })
      .filter(Boolean);

    return chunks.join("\n");
  }

  return "";
}

function stripJsonCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function buildMinimalJob(
  targetUrl: string,
  markdown: string,
  raw: Record<string, unknown>,
): JobPosting {
  return {
    url: targetUrl,
    title: typeof raw.title === "string" ? raw.title : null,
    companyName: typeof raw.companyName === "string" ? raw.companyName : null,
    workMode: "UNKNOWN",
    description: typeof raw.description === "string" && raw.description.trim()
      ? raw.description
      : markdown,
    jobLocations: null,
    employmentType: null,
    baseSalary: null,
    datePosted: null,
    validThrough: null,
    directApplyUrl: null,
  };
}

async function extractStructuredJobWithMistral(params: {
  markdown: string;
  targetUrl: string;
  apiKey: string;
}): Promise<JobPosting> {
  const { markdown, targetUrl, apiKey } = params;
  const model = Deno.env.get("MISTRAL_MODEL") ?? "mistral-large-latest";

  let lastRaw: Record<string, unknown> = {};
  let validationErrors: z.ZodIssue[] | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    const retryContext = validationErrors
      ? `\nPrevious output failed validation. Fix these issues:\n${
        JSON.stringify(validationErrors, null, 2)
      }`
      : "";

    const mistralRes = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          response_format: { type: "json_object" },
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
        }),
      },
    );

    const mistralBody = await mistralRes.json().catch(() => null);
    if (!mistralRes.ok) {
      const details = mistralBody && typeof mistralBody === "object"
        ? JSON.stringify(mistralBody)
        : "Unknown Mistral error";
      throw new Error(`Mistral extraction failed: ${details}`);
    }

    const content = (mistralBody as {
      choices?: Array<{ message?: { content?: unknown } }>;
    })?.choices?.[0]?.message?.content;

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
      ? parsed as Record<string, unknown>
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") ?? "",
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const body = await req.json();
    const targetUrl = typeof body?.url === "string" ? body.url.trim() : "";

    if (!targetUrl) {
      return jsonResponse({ error: "URL is required" }, 400);
    }

    try {
      new URL(targetUrl);
    } catch {
      return jsonResponse({ error: "Invalid URL" }, 400);
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      return jsonResponse(
        { error: "FIRECRAWL_API_KEY is not configured" },
        500,
      );
    }

    const mistralApiKey = Deno.env.get("MISTRAL_API_KEY");
    if (!mistralApiKey) {
      return jsonResponse(
        { error: "MISTRAL_API_KEY is not configured" },
        500,
      );
    }

    // Primary request: scrape raw markdown and links
    const firecrawlRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,
        formats: ["markdown", "links"],
        actions: DEFAULT_ACTIONS,
        excludeTags: ["script", "style", "noscript", "iframe"],
        onlyMainContent: true,
        timeout: 120000,
      }),
    });

    const firecrawlBody = await firecrawlRes.json().catch(() => null);

    if (!firecrawlRes.ok || !firecrawlBody?.success) {
      return jsonResponse(
        {
          error: firecrawlBody?.error || "Firecrawl scrape failed",
          details: firecrawlBody,
        },
        firecrawlRes.status || 500,
      );
    }

    const extracted = (firecrawlBody.data || firecrawlBody) as Record<
      string,
      unknown
    >;

    const markdown = typeof extracted.markdown === "string"
      ? extracted.markdown
      : "";

    if (!markdown.trim()) {
      return jsonResponse(
        { error: "Scraped page did not return markdown content" },
        422,
      );
    }

    const job = await extractStructuredJobWithMistral({
      markdown,
      targetUrl,
      apiKey: mistralApiKey,
    });

    const metadata = (extracted.metadata || {}) as Record<string, unknown>;
    const derivedTitle = job.title ||
      (typeof metadata.title === "string" ? metadata.title : null) ||
      "Unknown Title";

    const dbRow = {
      url: job.url,
      title: derivedTitle,
      company_name: job.companyName || "Unknown Company",
      location: job.jobLocations ?? null,
      work_mode: job.workMode ?? null,
      employment_type: job.employmentType ?? null,
      salary_min: job.baseSalary?.minValue ?? null,
      salary_max: job.baseSalary?.maxValue ?? null,
      salary_currency: job.baseSalary?.currency ?? null,
      salary_period: job.baseSalary?.unitText ?? null,
      posted_at: toIsoOrNull(job.datePosted),
      valid_through: toIsoOrNull(job.validThrough),
      direct_apply_url: job.directApplyUrl ?? null,
      description: job.description ??
        markdown ??
        null,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    const { data: savedJob, error: saveError } = await supabase
      .from("job_postings")
      .upsert(dbRow, { onConflict: "url", ignoreDuplicates: false })
      .select("id, url, title, company_name, created_at, updated_at")
      .single();

    if (saveError) {
      return jsonResponse({ error: saveError.message }, 500);
    }

    return jsonResponse({
      success: true,
      job,
      savedJob,
      metadata: extracted.metadata ?? null,
      markdown,
    });
  } catch (error) {
    console.error("scrape-job edge function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
