import { createClient } from "@/lib/supabase/server";
import { JobsPageFilters } from "./jobs-page-filters";

export async function JobsFilters() {
  const supabase = await createClient();

  // Fetch unique industries
  const { data: industriesData } = await supabase
    .from("industry")
    .select("name")
    .order("name");

  // Fetch unique seniority levels
  const { data: senioritiesData } = await supabase
    .from("job_positions")
    .select("seniority_level")
    .order("seniority_level");

  // Fetch unique companies
  const { data: companiesData } = await supabase
    .from("companies")
    .select("name")
    .order("name");

  // Extract unique values
  const industries = industriesData || [];
  const seniorities = [
    ...new Set(
      (senioritiesData || [])
        .map((item) => item.seniority_level)
        .filter((sen): sen is string => sen !== null)
    ),
  ];
  const companies = companiesData || [];

  return (
    <JobsPageFilters
      industries={industries}
      seniorities={seniorities}
      companies={companies}
    />
  );
}
