import type { JobPosting } from "./types.ts";

export function toIsoOrNull(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function stripJsonCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

/**
 * Mistral SDK can return content as a string, an array of text chunks,
 * or structured content blocks. Normalize everything to a single string.
 */
export function normalizeMistralContentToText(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          const text = (item as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

export function buildMinimalJob(
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
