// app/api/extract/details/schema.ts
import { z } from "zod";

const MonetaryAmountSchema = z.object({
    // Remove default("USD") to avoid silent data corruption
    currency: z.string().nullable().optional().describe(
        "ISO 4217 currency code e.g. USD, EUR",
    ),
    minValue: z.number().nullable().optional(),
    maxValue: z.number().nullable().optional(),
    // loose string allows for "Project", "Day", etc.
    unitText: z.string().nullable().optional(),
});

export const JobPostingSchema = z.object({
    // Core Identity
    title: z.string().nullable().optional().describe("The official job title"),
    companyName: z.string().nullable().optional().describe(
        "Name of the hiring organization",
    ),

    // URL is critical for unique identification and re-scraping
    url: z.string().describe("The canonical URL of the job post"),

    // Location & Work Mode
    // Updated to array to support multiple locations (e.g. Los Angeles, CA; New York, NY)
    jobLocations: z.array(z.object({
        city: z.string().nullable().optional(),
        state: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        rawAddress: z.string().nullable().optional(),
    })).nullable().optional().describe(
        "List of physical locations where the job is available",
    ),

    // Replaces boolean isRemote. Matches real-world filtering needs better.
    workMode: z.enum(["REMOTE", "HYBRID", "ONSITE", "UNKNOWN"])
        .nullable()
        .optional()
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
    ]).nullable().optional(),

    // Description & Requirements
    // CRITICAL: Always keep the markdown as the primary content
    description: z.string().nullable().optional().describe(
        "Content of the job body in markdown",
    ),

    // Make extraction best-effort (optional)
    responsibilities: z.array(z.string()).nullable().optional(),
    qualifications: z.array(z.string()).nullable().optional(),

    // Compensation
    baseSalary: MonetaryAmountSchema.nullable().optional(),

    // Meta
    datePosted: z.string().nullable().optional(), // Keep as string, normalize to Date object in DB layer
    validThrough: z.string().nullable().optional(),
    // Relaxed URL check because AI sometimes fails format
    directApplyUrl: z.string().nullable().optional(),
});

export type JobPosting = z.infer<typeof JobPostingSchema>;
