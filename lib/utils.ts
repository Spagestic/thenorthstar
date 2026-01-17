import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
