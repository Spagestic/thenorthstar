import { z } from "zod";
import { JobPostingSchema } from "./JobPostingSchema.ts";

// Re-export the schema itself
export { JobPostingSchema };

// Convert Zod schema to JSON Schema for prompt injection
export const JOB_POSTING_JSON_SCHEMA = z.toJSONSchema(
  JobPostingSchema,
) as Record<string, unknown>;

export const MISTRAL_EXTRACTION_PROMPT = [
  "Extract all job posting details from this markdown into strict JSON.",
  "Use this JSON schema shape:",
  JSON.stringify(JOB_POSTING_JSON_SCHEMA),
  "Rules:",
  "- Return ONLY valid JSON object and no additional text.",
  "- If a field is not found, use null.",
  "- For description, return canonical markdown for the actual job content only.",
  "- Exclude navigation, footer, cookie, share, login, and apply-widget chrome unless it contains unique job details.",
  "- Normalize headings, bullets, and spacing so the markdown is clean and readable.",
  "- Preserve meaningful sections like responsibilities, requirements, benefits, compensation, and application steps.",
  "- workMode must be one of REMOTE, HYBRID, ONSITE, UNKNOWN.",
  "- employmentType must be one of FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN, VOLUNTEER, OTHER.",
].join("\n");
