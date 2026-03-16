import { createClient } from "@supabase/supabase-js";
import { corsHeaders, jsonResponse } from "./cors.ts";
import { FirecrawlError, scrapeWithFirecrawl } from "../scrape-job/firecrawl.ts";
import { extractStructuredJobWithMistral } from "../scrape-job/mistral.ts";
import { toIsoOrNull } from "../scrape-job/helpers.ts";

const DEFAULT_LIMIT = 10;
const JOB_PATH_PATTERN = /job|careers|position|opening|vacanc/i;

function filterAndCapJobLinks(
  links: string[] | undefined,
  careerPageUrl: string,
  limit: number,
): { links: string[]; totalFound: number } {
  if (!Array.isArray(links) || links.length === 0) {
    return { links: [], totalFound: 0 };
  }

  let origin: string;
  try {
    origin = new URL(careerPageUrl).origin;
  } catch {
    return { links: [], totalFound: 0 };
  }

  const seen = new Set<string>();
  const sameOrigin: string[] = [];

  for (const href of links) {
    try {
      const u = new URL(href);
      if (u.origin !== origin) continue;
      const normalized = u.href;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      sameOrigin.push(normalized);
    } catch {
      // invalid URL, skip
    }
  }

  // Prefer links whose path looks like a job detail page
  const scored = sameOrigin.map((url) => {
    try {
      const pathname = new URL(url).pathname;
      const jobLike = JOB_PATH_PATTERN.test(pathname);
      return { url, jobLike };
    } catch {
      return { url, jobLike: false };
    }
  });

  scored.sort((a, b) => (a.jobLike === b.jobLike ? 0 : a.jobLike ? -1 : 1));
  const capped = scored.map((s) => s.url).slice(0, limit);
  return { links: capped, totalFound: scored.length };
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

    const body = await req.json().catch(() => ({}));
    const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
    const limit = typeof body?.limit === "number" && body.limit > 0
      ? Math.min(body.limit, 20)
      : DEFAULT_LIMIT;

    if (!rawUrl) {
      return jsonResponse({ error: "URL is required" }, 400);
    }

    let careerPageUrl: string;
    try {
      careerPageUrl = new URL(rawUrl).href;
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

    // ── Scrape career page ──
    let careerScrape;
    try {
      careerScrape = await scrapeWithFirecrawl(careerPageUrl, firecrawlApiKey);
    } catch (err) {
      if (err instanceof FirecrawlError) {
        return jsonResponse(
          { error: err.message, details: err.details },
          err.status,
        );
      }
      throw err;
    }

    const { links: jobLinks, totalFound: totalLinksFound } = filterAndCapJobLinks(
      careerScrape.links,
      careerPageUrl,
      limit,
    );

    if (jobLinks.length === 0) {
      return jsonResponse({
        success: true,
        batchId: null,
        scraped: 0,
        failed: 0,
        totalLinksFound: totalLinksFound || (careerScrape.links?.length ?? 0),
        jobIds: [],
        message: "No same-origin job-like links found on the career page",
      });
    }

    // ── Optional: create scraping_jobs row for progress ──
    const { data: scrapingJob, error: insertJobError } = await supabase
      .from("scraping_jobs")
      .insert({
        user_id: user.id,
        url: careerPageUrl,
        status: "in_progress",
        steps: [],
        jobs_found: jobLinks.length,
      })
      .select("id")
      .single();

    const batchId = insertJobError ? null : scrapingJob?.id ?? null;

    const jobIds: string[] = [];
    let failed = 0;

    for (const jobUrl of jobLinks) {
      try {
        const scrapeResult = await scrapeWithFirecrawl(jobUrl, firecrawlApiKey);
        const { markdown, metadata } = scrapeResult;

        const job = await extractStructuredJobWithMistral({
          markdown,
          targetUrl: jobUrl,
          apiKey: mistralApiKey,
        });

        const derivedTitle = job.title ||
          (typeof metadata.title === "string" ? metadata.title : null) ||
          "Unknown Title";

        const dbRow = {
          url: job.url,
          title: derivedTitle,
          company_name: job.companyName || "Unknown Company",
          company_domain: job.companyDomain ?? null,
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
          .select("id")
          .single();

        if (saveError) {
          console.warn("Failed to save job", jobUrl, saveError.message);
          failed++;
        } else if (savedJob?.id) {
          jobIds.push(savedJob.id);
        }
      } catch (err) {
        console.warn("Failed to scrape or save job", jobUrl, err);
        failed++;
      }
    }

    if (batchId) {
      await supabase
        .from("scraping_jobs")
        .update({
          status: "completed",
          jobs_found: jobIds.length,
          updated_at: new Date().toISOString(),
        })
        .eq("id", batchId);
    }

    return jsonResponse({
      success: true,
      batchId,
      scraped: jobIds.length,
      failed,
      totalLinksFound,
      jobIds,
    });
  } catch (error) {
    console.error("batch-scrape-careers error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
