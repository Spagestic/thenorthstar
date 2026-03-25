export type BrandingProfile = {
  logo?: string | null;
  images?: {
    logo?: string | null;
    favicon?: string | null;
    ogImage?: string | null;
  } | null;
} | null;

type ResolveCompanyLogoUrlInput = {
  companyLogoUrl?: string | null;
  companyDomain?: string | null;
};

type ExtractCompanyLogoUrlInput = {
  branding?: BrandingProfile;
  sourceUrl?: string | null;
};

function toAbsoluteUrl(value: string | null | undefined, sourceUrl?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return sourceUrl ? new URL(value, sourceUrl).href : new URL(value).href;
  } catch {
    return null;
  }
}

export function getDomainLogoUrl(companyDomain: string | null | undefined) {
  if (!companyDomain) {
    return null;
  }

  return `https://logos-api.apistemic.com/domain:${companyDomain}`;
}

export function resolveCompanyLogoUrl({
  companyLogoUrl,
  companyDomain,
}: ResolveCompanyLogoUrlInput) {
  return toAbsoluteUrl(companyLogoUrl) || getDomainLogoUrl(companyDomain);
}

export function extractCompanyLogoUrl({
  branding,
  sourceUrl,
}: ExtractCompanyLogoUrlInput) {
  return (
    toAbsoluteUrl(branding?.logo, sourceUrl) ||
    toAbsoluteUrl(branding?.images?.logo, sourceUrl)
  );
}
