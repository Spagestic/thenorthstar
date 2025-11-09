import Image from "next/image";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { getCompanyLogo } from "@/lib/company-logos";
const COMPANY_NAMES_ROW_A = [
  "Google",
  "Microsoft",
  "Amazon",
  "Goldman Sachs",
  "McKinsey & Company",
  "Apple",
  "Meta",
  "Netflix",
  "Pfizer",
  "Deloitte",
  "EY",
  "KPMG",
  "PwC",
  "JPMorgan Chase",
  "Bank of America",
  "Morgan Stanley",
  "HSBC",
  "Citi",
  "Costco",
  "Walmart",
];
const COMPANY_NAMES_ROW_B = [
  "Shell",
  "Siemens",
  "TSMC",
  "Nestlé",
  "UPS",
  "FedEx",
  "Disney",
  "Comcast",
  "Verizon",
  "ADM",
  "BASF",
  "Cargill",
  "Maersk",
  "Skanska",
  "Vinci",
  "Dr Horton",
  "ExxonMobil",
  "Aramco",
];

export default function LogoCloud() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden pt-28">
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4">
          {COMPANY_NAMES_ROW_A.map((name) => {
            const logo = getCompanyLogo(name);
            if (!logo) return null;
            return (
              <div className="relative h-18 w-18 overflow-hidden rounded-md border bg-accent/20 aspect-square p-8 mr-8">
                <Image
                  alt={`${name || "Company"} logo`}
                  className="h-full w-full object-contain"
                  fill
                  src={logo.src}
                />
              </div>
            );
          })}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4">
          {COMPANY_NAMES_ROW_B.map((name, idx) => {
            const logo = getCompanyLogo(name);
            if (!logo) return null;
            return (
              <div className="relative  h-18 w-18 overflow-hidden rounded-md border bg-accent/20 aspect-square p-8 mr-8">
                <Image
                  alt={`${name || "Company"} logo`}
                  className="h-full w-full object-contain"
                  fill
                  src={logo.src}
                />
              </div>
            );
          })}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}
