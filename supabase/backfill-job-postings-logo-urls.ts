import { createClient } from "@supabase/supabase-js";
import { getDomainLogoUrl } from "../lib/company-logo";
import type { Database } from "../lib/supabase/database.types";

const PAGE_SIZE = 200;

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);
  let offset = 0;
  let updatedRows = 0;

  while (true) {
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, company_domain, company_logo_url")
      .order("id")
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    const updates = data
      .map((row) => {
        if (row.company_logo_url || !row.company_domain) {
          return null;
        }

        return {
          id: row.id,
          company_logo_url: getDomainLogoUrl(row.company_domain),
        };
      })
      .filter(Boolean);

    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from("job_postings")
        .upsert(updates, { onConflict: "id", ignoreDuplicates: false });

      if (updateError) {
        throw updateError;
      }

      updatedRows += updates.length;
    }

    offset += data.length;
  }

  console.log(`Backfill complete. Updated ${updatedRows} job posting rows.`);
}

main().catch((error) => {
  console.error("Failed to backfill job posting logo URLs:", error);
  process.exit(1);
});
