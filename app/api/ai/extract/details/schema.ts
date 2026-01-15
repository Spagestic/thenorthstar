// app/api/extract/details/schema.ts
import { z } from "zod";

const MonetaryAmountSchema = z.object({
    // Remove default("USD") to avoid silent data corruption
    currency: z.string().nullable().describe(
        "ISO 4217 currency code e.g. USD, EUR",
    ),
    minValue: z.number().nullable(),
    maxValue: z.number().nullable(),
    // loose string allows for "Project", "Day", etc.
    unitText: z.enum(["HOUR", "WEEK", "MONTH", "YEAR"]).or(z.string())
        .optional(),
});

export const JobPostingSchema = z.object({
    // Core Identity
    title: z.string(),
    companyName: z.string(),

    // URL is critical for unique identification and re-scraping
    url: z.url().describe("The canonical URL of the job post"),

    // Location & Work Mode
    jobLocation: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        rawAddress: z.string().optional(),
    }).optional(),

    // Replaces boolean isRemote. Matches real-world filtering needs better.
    workMode: z.enum(["REMOTE", "HYBRID", "ONSITE", "UNKNOWN"])
        .default("UNKNOWN")
        .describe("Inferred work arrangement"),

    // Broader enum to match Schema.org + "Contractor" variations
    employmentType: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "TEMPORARY",
        "INTERN",
        "VOLUNTEER",
        "OTHER",
    ]).optional(),

    // Description & Requirements
    // CRITICAL: Always keep the raw HTML/markdown as a fallback
    rawDescription: z.string().describe("Raw content of the job body"),

    // Make extraction best-effort (optional)
    responsibilities: z.array(z.string()).optional(),
    qualifications: z.array(z.string()).optional(),

    // Compensation
    baseSalary: MonetaryAmountSchema.optional(),

    // Meta
    datePosted: z.string().optional(), // Keep as string, normalize to Date object in DB layer
    validThrough: z.string().optional(),
    directApplyUrl: z.url().optional(),
});

export type JobPosting = z.infer<typeof JobPostingSchema>;
