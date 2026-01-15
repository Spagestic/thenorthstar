"use server";

import { createClient } from "@/lib/supabase/server";
import { JobPosting } from "@/app/api/ai/extract/details/schema";

export type SaveJobResult = {
    success: boolean;
    count?: number;
    error?: string;
};

export async function saveJobsToSupabase(
    jobs: JobPosting[],
): Promise<SaveJobResult> {
    const supabase = await createClient();

    // Map the Zod schema to the Database table structure
    const validJobs = jobs.filter((j) => !!j.url);

    const dbRows = validJobs.map((job) => {
        // 1. Flatten Salary
        const salary = job.baseSalary;

        // 2. Prepare location JSON
        // The DB has 'location' as jsonb. We can pass the object directly.

        // 3. Dates
        // The schema has strings, DB wants timestamptz.
        // Usually Supabase/Postgres is flexible with ISO strings, but good to ensure valid dates.
        const postedAt = job.datePosted
            ? new Date(job.datePosted).toISOString()
            : null;
        const validThrough = job.validThrough
            ? new Date(job.validThrough).toISOString()
            : null;

        return {
            url: job.url!,
            title: job.title,
            company_name: job.companyName,
            description_html: job.rawDescription,
            // Simple strip tags for text preview if needed, or leave null to let DB/backend handle later
            description_text: job.rawDescription.replace(/<[^>]*>?/gm, ""),
            location: job.jobLocation, // JSONB column
            work_mode: job.workMode,
            employment_type: job.employmentType,

            // Salary mapping
            salary_min: salary?.minValue ?? null,
            salary_max: salary?.maxValue ?? null,
            salary_currency: salary?.currency ?? null,
            salary_period: salary?.unitText ?? null,

            posted_at: postedAt,
            valid_through: validThrough,
            direct_apply_url: job.directApplyUrl ?? null,
        };
    });

    if (dbRows.length === 0) {
        return { success: true, count: 0 };
    }

    try {
        // We use 'upsert' to handle duplicates on 'url' (if configured as primary/unique key)
        // The user's table shows: constraint job_postings_url_key unique (url)
        const { error } = await supabase
            .from("job_postings" as any) // Type assertion until database.types.ts is updated
            .upsert(dbRows, {
                onConflict: "url",
                ignoreDuplicates: false, // Update if exists
            });

        if (error) {
            console.error("Supabase upsert error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, count: dbRows.length };
    } catch (err: any) {
        console.error("Unexpected error saving jobs:", err);
        return { success: false, error: err.message };
    }
}
