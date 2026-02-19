// firecrawl.ts
import type { ScrapeResult } from "./types.ts";

const DEFAULT_ACTIONS = [
  { type: "wait", milliseconds: 2000 },
  { type: "scroll", direction: "down" },
  { type: "wait", milliseconds: 1000 },
  { type: "scroll", direction: "down" },
  { type: "wait", milliseconds: 1000 },
];

export async function scrapeWithFirecrawl(
  targetUrl: string,
  apiKey: string,
): Promise<ScrapeResult> {
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    const errorDetail = body?.error || "Firecrawl scrape failed";
    throw new FirecrawlError(errorDetail, res.status, body);
  }

  const data = (body.data || body) as Record<string, unknown>;
  const markdown = typeof data.markdown === "string" ? data.markdown : "";

  if (!markdown.trim()) {
    throw new FirecrawlError(
      "Scraped page did not return markdown content",
      422,
    );
  }

  return {
    markdown,
    metadata: (data.metadata || {}) as Record<string, unknown>,
    links: Array.isArray(data.links) ? (data.links as string[]) : undefined,
  };
}

export class FirecrawlError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "FirecrawlError";
    this.status = status;
    this.details = details;
  }
}
