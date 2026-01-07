// app/api/extract/details/schema.ts
import { z } from "zod";

// Helper for Salary (often complex in descriptions)
const MonetaryAmountSchema = z.object({
    currency: z.string().default("USD").describe(
        "Currency code, e.g., USD, EUR, HKD",
    ),
    minValue: z.number().nullable().describe("Minimum salary amount per year"),
    maxValue: z.number().nullable().describe("Maximum salary amount per year"),
    unitText: z.enum(["HOUR", "WEEK", "MONTH", "YEAR"]).default("YEAR"),
});

export const JobPostingSchema = z.object({
    // Core Identity
    title: z.string().describe("The official job title"),
    companyName: z.string().describe("Name of the hiring organization"),

    // Location & Remote Status
    jobLocation: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        rawAddress: z.string().describe(
            "The full location string as shown, e.g., 'Memphis, TN'",
        ),
    }),
    isRemote: z.boolean().describe(
        "True if the job mentions 'Remote' or 'Work from home'",
    ),
    employmentType: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERN",
        "OTHER",
    ]).optional(),

    // Description & Requirements
    description: z.string().describe("The full job description text"),
    responsibilities: z.array(z.string()).describe(
        "List of specific job duties",
    ),
    qualifications: z.array(z.string()).describe(
        "List of required skills or experience",
    ),

    // Compensation
    baseSalary: MonetaryAmountSchema.optional().describe(
        "Salary range if available",
    ),

    // Meta
    datePosted: z.string().optional().describe("ISO 8601 date string if found"),
    validThrough: z.string().optional().describe(
        "Application deadline if found",
    ),
    directApplyUrl: z.string().url().optional(),
});

export type JobPosting = z.infer<typeof JobPostingSchema>;
