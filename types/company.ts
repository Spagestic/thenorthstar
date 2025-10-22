export type Company = {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null; // maps to logo_url
  culture?: string | null;
  values?: Record<string, unknown> | null; // maps to jsonb `values`
  foundedYear?: number | null; // maps to founded_year
  createdAt?: string | null; // ISO timestamp, maps to created_at
  updatedAt?: string | null; // ISO timestamp, maps to updated_at
  industryId?: string | null; // maps to industry_id
};
