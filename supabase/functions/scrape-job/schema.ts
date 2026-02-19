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
  "- Preserve full job description in markdown for description.",
  "- workMode must be one of REMOTE, HYBRID, ONSITE, UNKNOWN.",
  "- employmentType must be one of FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN, VOLUNTEER, OTHER.",
].join("\n");
