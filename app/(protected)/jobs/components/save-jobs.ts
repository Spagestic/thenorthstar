"use server";

import { createClient } from "@/lib/supabase/server";
import { JobPosting } from "@/app/api/ai/extract/details/schema";

export type SaveJobResult = {
    success: boolean;
    error?: string;
};

export type CompanyInfo = {
    name: string;
    website: string;
    logoUrl?: string;
};

export async function saveJobToSupabase(
    job: JobPosting,
    options: {
        companyInfo?: CompanyInfo;
    } = {},
): Promise<SaveJobResult> {
    const supabase = await createClient();

    if (!job.url) {
        return { success: false, error: "Job URL is required" };
    }

    let companyId: string | null = null;

    // 1. Upsert company
    if (options.companyInfo) {
        const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .upsert(
                {
                    name: options.companyInfo.name,
                    website: options.companyInfo.website,
                    logo_url: options.companyInfo.logoUrl,
                },
                { onConflict: "name" },
            )
            .select("id")
            .single();

        if (companyError) {
            console.error("Failed to upsert company:", companyError);
        } else {
            companyId = companyData.id;
        }
    }

    // 2. Build the DB row
    const salary = job.baseSalary;
    const postedAt = job.datePosted
        ? new Date(job.datePosted).toISOString()
        : null;
    const validThrough = job.validThrough
        ? new Date(job.validThrough).toISOString()
        : null;

    const dbRow = {
        url: job.url,
        title: job.title || "Unknown Title",
        company_name: job.companyName || options.companyInfo?.name ||
            "Unknown Company",
        company_id: companyId,
        description: job.description || "",
        location: job.jobLocations,
        work_mode: job.workMode,
        employment_type: job.employmentType,
        salary_min: salary?.minValue ?? null,
        salary_max: salary?.maxValue ?? null,
        salary_currency: salary?.currency ?? null,
        salary_period: salary?.unitText ?? null,
        posted_at: postedAt,
        valid_through: validThrough,
        direct_apply_url: job.directApplyUrl ?? null,
    };

    // 3. Upsert (update if URL already exists)
    try {
        const { error } = await supabase
            .from("job_postings" as any)
            .upsert(dbRow, {
                onConflict: "url",
                ignoreDuplicates: false,
            });

        if (error) {
            console.error("Supabase upsert error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Unexpected error saving job:", err);
        return { success: false, error: err.message };
    }
}
