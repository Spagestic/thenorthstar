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
