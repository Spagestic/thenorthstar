// types.ts
import { z } from "zod";
import { JobPostingSchema } from "./schema.ts";

export type JobPosting = z.infer<typeof JobPostingSchema>;

export interface ExtractionParams {
  markdown: string;
  targetUrl: string;
  apiKey: string;
}

export interface ScrapeResult {
  markdown: string;
  metadata: Record<string, unknown>;
  links?: string[];
}
