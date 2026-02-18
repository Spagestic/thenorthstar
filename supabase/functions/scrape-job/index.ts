import { createClient } from "@supabase/supabase-js";
import { corsHeaders, jsonResponse } from "./cors.ts";
import { toIsoOrNull } from "./helpers.ts";
import { FirecrawlError, scrapeWithFirecrawl } from "./firecrawl.ts";
import { extractStructuredJobWithMistral } from "./mistral.ts";

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // ── Auth ──
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

    // ── Input validation ──
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

    // ── Env checks ──
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

    // ── Step 1: Scrape ──
    let scrapeResult;
    try {
      scrapeResult = await scrapeWithFirecrawl(targetUrl, firecrawlApiKey);
    } catch (err) {
      if (err instanceof FirecrawlError) {
        return jsonResponse(
          { error: err.message, details: err.details },
          err.status,
        );
      }
      throw err;
    }

    const { markdown, metadata } = scrapeResult;

    // ── Step 2: Extract structured data via Mistral SDK ──
    const job = await extractStructuredJobWithMistral({
      markdown,
      targetUrl,
      apiKey: mistralApiKey,
    });

    // ── Step 3: Persist ──
    const derivedTitle = job.title ||
      (typeof metadata.title === "string" ? metadata.title : null) ||
      "Unknown Title";

    const dbRow = {
      url: job.url,
      title: derivedTitle,
      company_name: job.companyName || "Unknown Company",
      company_domain: job.companyDomain || null,
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
      description: job.description ?? markdown ?? null,
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
      metadata,
      markdown,
    });
  } catch (error) {
    console.error("scrape-job edge function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
