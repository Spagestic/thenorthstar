import { createClient } from "@supabase/supabase-js";
import { corsHeaders, jsonResponse } from "./cors.ts";
import { FirecrawlError, scrapeWithFirecrawl } from "../scrape-job/firecrawl.ts";
import { extractStructuredJobWithMistral } from "../scrape-job/mistral.ts";
import { toIsoOrNull } from "../scrape-job/helpers.ts";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 15;
const SCRAPE_CONCURRENCY = 3;
const JOB_PATH_PATTERN = /job|jobs|career|careers|position|opening|vacanc|role|apply/i;
const GENERIC_PATH_PATTERN =
  /^\/($|careers?\/?$|jobs?\/?$|openings?\/?$|positions?\/?$|roles?\/?$|apply\/?$)/i;
const EXCLUDED_PATH_PATTERN =
  /\/(blog|docs|pricing|customers|customer-stories|compare|templates|changelog|integrations|use-cases|about|contact|privacy|terms|security|login|signup|sign-up|book-demo)(\/|$)/i;
const ATS_HOST_PATTERNS = [
  /ashbyhq\.com$/i,
  /greenhouse\.io$/i,
  /lever\.co$/i,
  /workable\.com$/i,
  /job-boards\.greenhouse\.io$/i,
  /myworkdayjobs\.com$/i,
  /gem\.com$/i,
];

type RankedLink = {
  url: string;
  score: number;
  reasons: string[];
};

function isStrongJobCandidate(link: RankedLink): boolean {
  const reasonSet = new Set(link.reasons);

  if (reasonSet.has("known-ats-host")) {
    return true;
  }

  if (
    reasonSet.has("job-like-path") &&
    (reasonSet.has("detail-path-shape") ||
      reasonSet.has("id-in-path") ||
      reasonSet.has("deeper-path"))
  ) {
    return true;
  }

  return false;
}

function normalizeCandidateUrl(href: string): string | null {
  try {
    const url = new URL(href);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_")) {
        url.searchParams.delete(key);
      }
    }
    return url.href;
  } catch {
    return null;
  }
}

function isKnownAtsHost(hostname: string): boolean {
  return ATS_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

function deriveFallbackCompanyName(targetUrl: string): string {
  try {
    const url = new URL(targetUrl);
    const hostnameParts = url.hostname.split(".");

    if (hostnameParts.length > 1) {
      const root = hostnameParts.at(-2) ?? hostnameParts[0];
      if (root && root !== "www" && root !== "jobs") {
        return root
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");
      }
    }

    const firstPathSegment = url.pathname.split("/").filter(Boolean)[0];
    if (firstPathSegment) {
      return firstPathSegment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  } catch {
    // ignore
  }

  return "Unknown Company";
}

function filterAndCapJobLinks(
  links: string[] | undefined,
  careerPageUrl: string,
  limit: number,
): { links: string[]; totalFound: number; rankedLinks: RankedLink[] } {
  if (!Array.isArray(links) || links.length === 0) {
    return { links: [], totalFound: 0, rankedLinks: [] };
  }

  let careerUrl: URL;
  try {
    careerUrl = new URL(careerPageUrl);
  } catch {
    return { links: [], totalFound: 0, rankedLinks: [] };
  }

  const seen = new Set<string>();
  const ranked: RankedLink[] = [];
  const careerHost = careerUrl.hostname;
  const careerOrigin = careerUrl.origin;
  const careerNormalized = normalizeCandidateUrl(careerPageUrl);

  for (const href of links) {
    const normalized = normalizeCandidateUrl(href);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);

    try {
      const url = new URL(normalized);
      const pathname = new URL(url).pathname;
      const reasons: string[] = [];
      let score = 0;

      const sameOrigin = url.origin === careerOrigin;
      const sameHost = url.hostname === careerHost;
      const atsHost = isKnownAtsHost(url.hostname);
      const jobLikePath = JOB_PATH_PATTERN.test(pathname);
      const genericPath = GENERIC_PATH_PATTERN.test(pathname);
      const excludedPath = EXCLUDED_PATH_PATTERN.test(pathname);
      const pathSegments = pathname.split("/").filter(Boolean);

      if (careerNormalized && normalized === careerNormalized) {
        score -= 100;
        reasons.push("same-as-career-page");
      }

      if (sameOrigin) {
        score += 10;
        reasons.push("same-origin");
      }

      if (sameHost) {
        score += 5;
        reasons.push("same-host");
      }

      if (atsHost) {
        score += 25;
        reasons.push("known-ats-host");
      }

      if (jobLikePath) {
        score += 15;
        reasons.push("job-like-path");
      }

      if (genericPath) {
        score -= 30;
        reasons.push("generic-listing-path");
      }

      if (excludedPath) {
        score -= 50;
        reasons.push("excluded-non-job-path");
      }

      if (pathSegments.length >= 2) {
        score += 5;
        reasons.push("deeper-path");
      }

      if (/\d/.test(pathname)) {
        score += 5;
        reasons.push("id-in-path");
      }

      if (/\/(apply|job|jobs|careers)\//i.test(pathname)) {
        score += 10;
        reasons.push("detail-path-shape");
      }

      if (!sameOrigin && !atsHost) {
        score -= 20;
        reasons.push("untrusted-cross-origin");
      }

      if (score > 0) {
        ranked.push({ url: normalized, score, reasons });
      }
    } catch {
      // invalid URL, skip
    }
  }

  ranked.sort((a, b) => b.score - a.score);
  const qualified = ranked.filter(isStrongJobCandidate);
  const capped = qualified.map((item) => item.url).slice(0, limit);
  return { links: capped, totalFound: qualified.length, rankedLinks: ranked };
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
      ? Math.min(body.limit, MAX_LIMIT)
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

    console.log("batch-scrape-careers:start", {
      careerPageUrl,
      requestedLimit: body?.limit,
      appliedLimit: limit,
    });

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

    const { links: jobLinks, totalFound: totalLinksFound, rankedLinks } = filterAndCapJobLinks(
      careerScrape.links,
      careerPageUrl,
      limit,
    );

    console.log("batch-scrape-careers:career-page", {
      careerPageUrl,
      metadataTitle: typeof careerScrape.metadata.title === "string"
        ? careerScrape.metadata.title
        : null,
      rawLinkCount: careerScrape.links?.length ?? 0,
      rankedCount: totalLinksFound,
      selectedLinks: rankedLinks.slice(0, limit).map((item) => ({
        url: item.url,
        score: item.score,
        reasons: item.reasons,
      })),
    });

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

    const scrapeAndSaveJob = async (jobUrl: string): Promise<string | null> => {
      try {
        console.log("batch-scrape-careers:scraping-job", { jobUrl });
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
        const derivedCompanyName = job.companyName ||
          deriveFallbackCompanyName(job.url || jobUrl);

        console.log("batch-scrape-careers:extracted-job", {
          jobUrl,
          metadataTitle: typeof metadata.title === "string" ? metadata.title : null,
          extractedTitle: job.title ?? null,
          savedTitle: derivedTitle,
          extractedCompanyName: job.companyName ?? null,
          savedCompanyName: derivedCompanyName,
        });

        const dbRow = {
          url: job.url,
          title: derivedTitle,
          company_name: derivedCompanyName,
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
          return null;
        }

        console.log("batch-scrape-careers:saved-job", {
          jobUrl,
          savedJobId: savedJob?.id ?? null,
          savedTitle: derivedTitle,
          savedCompanyName: derivedCompanyName,
        });

        return savedJob?.id ?? null;
      } catch (err) {
        console.warn("Failed to scrape or save job", jobUrl, err);
        return null;
      }
    };

    for (let i = 0; i < jobLinks.length; i += SCRAPE_CONCURRENCY) {
      const batch = jobLinks.slice(i, i + SCRAPE_CONCURRENCY);
      const results = await Promise.all(batch.map(scrapeAndSaveJob));

      for (const savedJobId of results) {
        if (savedJobId) {
          jobIds.push(savedJobId);
        } else {
          failed++;
        }
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
      processed: jobLinks.length,
      requestedLimit: limit,
      selectedLinks: jobLinks,
      jobIds,
    });
  } catch (error) {
    console.error("batch-scrape-careers error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
