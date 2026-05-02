import { type JobLocationEntry, type JobPosting } from "@/types/job-posting";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Json } from "@/database.types";
import { resolveCompanyLogoUrl } from "@/lib/company-logo";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rgbDataURL = (r: number, g: number, b: number): string =>
  `data:image/svg+xml;base64,${
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="rgb(${r}, ${g}, ${b})"/></svg>`,
    )
  }`;

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function normalizeUrl(input: string): string {
  if (!input) return "";
  // If input starts with protocol, return as is
  if (/^https?:\/\//i.test(input)) return input;
  // If input looks like a domain, prepend protocol
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(input)) return `https://${input}`;
  // Otherwise, treat as path (not recommended, but fallback)
  return `https://${input}`;
}

export function formatTimeAgo(dateString?: string | null) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(date.getTime())) return null;

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} months ago`;
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERN: "Internship",
  TEMPORARY: "Temporary",
  VOLUNTEER: "Volunteer",
  OTHER: "Other",
};

const WORK_MODE_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
  UNKNOWN: "Unknown",
};

export function formatEmploymentType(type?: string | null) {
  if (!type) return null;
  return EMPLOYMENT_TYPE_LABELS[type] || type;
}

export function formatWorkMode(mode?: string | null) {
  if (!mode) return null;
  return WORK_MODE_LABELS[mode] || mode;
}

export function formatSalary(
  salary: {
    minValue: number | null;
    maxValue: number | null;
    currency: string | null;
    unitText: string | null;
  } | null,
): string | null {
  const min = salary?.minValue;
  const max = salary?.maxValue;
  if (!min && !max) return null;

  const currency = salary?.currency === "USD" ? "$" : salary?.currency || "$";

  // Match the reference: "$150 – 220k" (no /yr text, compact)
  const fmt = (v?: number | null) => {
    if (!v) return "";
    // If your data is already in "k" units remove this. Otherwise it approximates the reference style.
    if (v >= 1000) return `${Math.round(v / 1000)}k`;
    return v.toLocaleString();
  };

  if (min && max) return `${currency}${fmt(min)} – ${fmt(max)}`;
  if (min) return `${currency}${fmt(min)}`;
  return `${currency}${fmt(max)}`;
}

function isLocationEntry(value: unknown): value is JobLocationEntry {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** DB stores `location` as an array; API payloads may use `{ jobLocations: [...] }`. */
function normalizeLocationEntries(location: unknown): JobLocationEntry[] {
  if (!location) return [];
  if (Array.isArray(location)) {
    return location.filter(isLocationEntry);
  }
  if (typeof location === "object" && location !== null) {
    const nested = (location as { jobLocations?: unknown }).jobLocations;
    if (Array.isArray(nested)) {
      return nested.filter(isLocationEntry);
    }
  }
  return [];
}

/** Prefer a concrete place (city/state) over a generic remote-only row when both exist. */
function pickBestLocationEntry(entries: JobLocationEntry[]): JobLocationEntry | null {
  if (entries.length === 0) return null;
  const withCity = entries.find((e) => e.city?.trim());
  if (withCity) return withCity;
  const withState = entries.find((e) => e.state?.trim());
  if (withState) return withState;
  const withRaw = entries.find((e) => e.rawAddress?.trim());
  if (withRaw) return withRaw;
  return entries[0] ?? null;
}

function formatLocationEntry(entry: JobLocationEntry): string {
  const raw = entry.rawAddress?.trim();
  if (raw) return raw;
  const parts = [entry.city, entry.state, entry.country].filter((p) =>
    Boolean(p?.trim()),
  );
  return parts.join(", ");
}

/**
 * @param location — Supabase `job_postings.location` (array of entries) or `{ jobLocations }` from API
 * @param workMode — `job_postings.work_mode`; used only when there is no address text to show
 */
export function formatLocation(
  location: unknown,
  workMode?: string | null,
): string {
  const entries = normalizeLocationEntries(location);
  const best = pickBestLocationEntry(entries);
  const fromAddress = best ? formatLocationEntry(best) : "";
  if (fromAddress) return fromAddress;

  const legacyRoot =
    typeof location === "object" && location !== null && !Array.isArray(location)
      ? (location as { workMode?: string | null }).workMode
      : null;
  const mode = workMode ?? legacyRoot ?? null;

  return formatWorkMode(mode) || "";
}

export function getCompanyLogoUrl(
  domain: string | null,
  companyLogoUrl?: string | null,
): string | null {
  return resolveCompanyLogoUrl({
    companyLogoUrl,
    companyDomain: domain,
  });
}
