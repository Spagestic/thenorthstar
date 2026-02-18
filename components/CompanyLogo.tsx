// refer to https://logos.apistemic.com/
import Image from "next/image";

export function CompanyLogo({ domain }: { domain: string }) {
  return (
    <Image
      src={
        domain.includes(".")
          ? `https://logos-api.apistemic.com/domain:${domain}`
          : `https://logos-api.apistemic.com/linkedin:${domain}`
      }
      alt={`${domain} logo`}
      width={64}
      height={64}
      unoptimized // Required: ensures client-side fetching
    />
  );
}
