// refer to https://logos.apistemic.com/
"use client";

import { resolveCompanyLogoUrl } from "@/lib/company-logo";

export function CompanyLogo({
  domain,
  logoUrl,
  className,
}: {
  domain?: string | null;
  logoUrl?: string | null;
  className?: string;
}) {
  const src = resolveCompanyLogoUrl({
    companyLogoUrl: logoUrl,
    companyDomain: domain,
  });

  if (!src) {
    return null;
  }

  return (
    <img
      className={className}
      src={src}
      alt={`${domain || "Company"} logo`}
      width={64}
      height={64}
      loading="lazy"
    />
  );
}
