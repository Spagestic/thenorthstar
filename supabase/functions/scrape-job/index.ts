import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const JOB_POSTING_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: ["string", "null"] },
    companyName: { type: ["string", "null"] },
    url: { type: "string" },
    jobLocations: {
      type: ["array", "null"],
      items: {
        type: "object",
        properties: {
          city: { type: ["string", "null"] },
          state: { type: ["string", "null"] },
          country: { type: ["string", "null"] },
          rawAddress: { type: ["string", "null"] },
        },
      },
    },
    workMode: { type: ["string", "null"] },
    employmentType: { type: ["string", "null"] },
    description: { type: ["string", "null"] },
    baseSalary: {
      type: ["object", "null"],
      properties: {
        currency: { type: ["string", "null"] },
        minValue: { type: ["number", "null"] },
        maxValue: { type: ["number", "null"] },
        unitText: { type: ["string", "null"] },
      },
    },
    datePosted: { type: ["string", "null"] },
    validThrough: { type: ["string", "null"] },
    directApplyUrl: { type: ["string", "null"] },
  },
  required: ["url"],
} as const;

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
    const maxAge = typeof body?.maxAge === "number" ? body.maxAge : 600000;

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

    const firecrawlRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "x-api-key": firecrawlApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,
        formats: [
          "markdown",
          "links",
          {
            type: "json",
            schema: JOB_POSTING_JSON_SCHEMA,
            prompt: [
              "Extract all job posting details from this page.",
              "Focus on: job title, company name, locations, work mode (remote/hybrid/onsite),",
              "employment type, full job description in markdown, responsibilities,",
              "qualifications, salary/compensation, dates, and application URL.",
              "If a field is not found on the page, leave it null.",
              "For the description field, preserve the full content as markdown.",
            ].join(" "),
          },
        ],
        actions: DEFAULT_ACTIONS,
        excludeTags: ["script", "style", "noscript", "iframe"],
        onlyMainContent: true,
        maxAge,
        storeInCache: true,
        timeout: 120000,
      }),
    });

    let firecrawlBody = await firecrawlRes.json().catch(() => null);

    // Fallback path: some pages/schema combos can trigger a 400 with JSON format.
    // Retry without JSON extraction and save a minimal row instead of failing.
    if (!firecrawlRes.ok && firecrawlRes.status === 400) {
      const fallbackRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firecrawlApiKey}`,
          "x-api-key": firecrawlApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: targetUrl,
          formats: ["markdown", "links"],
          actions: DEFAULT_ACTIONS,
          excludeTags: ["script", "style", "noscript", "iframe"],
          onlyMainContent: true,
          maxAge,
          storeInCache: true,
          timeout: 120000,
        }),
      });

      firecrawlBody = await fallbackRes.json().catch(() => null);

      if (!fallbackRes.ok || !firecrawlBody?.success) {
        return jsonResponse(
          {
            error: firecrawlBody?.error || "Firecrawl scrape failed",
            details: firecrawlBody,
          },
          fallbackRes.status || 500,
        );
      }
    } else if (!firecrawlRes.ok || !firecrawlBody?.success) {
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
    const job = (extracted.json || {}) as Record<string, unknown>;
    const salary = (job.baseSalary || null) as Record<string, unknown> | null;
    const canonicalUrl = typeof job.url === "string" && job.url
      ? job.url
      : targetUrl;
    const metadata = (extracted.metadata || {}) as Record<string, unknown>;
    const derivedTitle = typeof job.title === "string" && job.title
      ? job.title
      : (typeof metadata.title === "string" ? metadata.title : "Unknown Title");

    const dbRow = {
      url: canonicalUrl,
      title: derivedTitle,
      company_name: (job.companyName as string | undefined) ||
        "Unknown Company",
      location: (job.jobLocations as unknown) ?? null,
      work_mode: (job.workMode as string | undefined) ?? null,
      employment_type: (job.employmentType as string | undefined) ?? null,
      salary_min: typeof salary?.minValue === "number" ? salary.minValue : null,
      salary_max: typeof salary?.maxValue === "number" ? salary.maxValue : null,
      salary_currency: typeof salary?.currency === "string"
        ? salary.currency
        : null,
      salary_period: typeof salary?.unitText === "string"
        ? salary.unitText
        : null,
      posted_at: toIsoOrNull(job.datePosted as string | null | undefined),
      valid_through: toIsoOrNull(job.validThrough as string | null | undefined),
      direct_apply_url: typeof job.directApplyUrl === "string"
        ? job.directApplyUrl
        : null,
      description: typeof job.description === "string"
        ? job.description
        : (extracted.markdown as string | undefined) ?? null,
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
      job: {
        ...job,
        url: canonicalUrl,
      },
      savedJob,
      metadata: extracted.metadata ?? null,
      markdown: extracted.markdown ?? null,
    });
  } catch (error) {
    console.error("scrape-job edge function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
