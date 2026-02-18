// refer to https://logos.apistemic.com/
"use client";

export function CompanyLogo({ domain }: { domain: string }) {
  return (
    <img
      src={
        domain.includes(".")
          ? `https://logos-api.apistemic.com/domain:${domain}`
          : `https://logos-api.apistemic.com/linkedin:${domain}`
      }
      alt={`${domain} logo`}
      width={64}
      height={64}
      loading="lazy"
    />
  );
}
