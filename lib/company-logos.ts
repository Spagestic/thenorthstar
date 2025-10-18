// Dynamic import of company logos
import Google from "@/public/logos/images/google.png";
import Microsoft from "@/public/logos/images/microsoft.png";
import Meta from "@/public/logos/images/meta.png";
import Apple from "@/public/logos/images/apple.png";
import Amazon from "@/public/logos/images/amazon.png";
import Netflix from "@/public/logos/images/netflix.png";
import BankOfAmerica from "@/public/logos/images/bank-of-america.png";
import Citi from "@/public/logos/images/citi.png";
import Deloitte from "@/public/logos/images/deloitte.png";
import EY from "@/public/logos/images/ey.png";
import GoldmanSachs from "@/public/logos/images/goldman-sachs.png";
import HSBC from "@/public/logos/images/hsbc.png";
import JPMC from "@/public/logos/images/jpmc.png";
import McKinsey from "@/public/logos/images/mckinsey.png";
import MorganStanley from "@/public/logos/images/morgan-stanley.png";
import PWC from "@/public/logos/images/pwc.png";

export const companyLogos = {
  Google,
  Microsoft,
  Meta,
  Apple,
  Amazon,
  Netflix,
  "Bank of America": BankOfAmerica,
  Citi,
  Deloitte,
  EY,
  "Goldman Sachs": GoldmanSachs,
  HSBC,
  JPMC,
  McKinsey,
  "Morgan Stanley": MorganStanley,
  PWC,
} as const;

/**
 * Get the logo for a company
 * @param companyName - The name of the company
 * @returns The company logo image
 */
export const getCompanyLogo = (companyName: string) => {
  return companyLogos[companyName as keyof typeof companyLogos];
};
