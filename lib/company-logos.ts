// Dynamic import of company logos
import ADM from "@/public/logos/images/adm.png";
import Amazon from "@/public/logos/images/amazon.png";
import Apple from "@/public/logos/images/apple.png";
import Aramco from "@/public/logos/images/aramco.png";
import ATnT from "@/public/logos/images/at&t.png";
import BankOfAmerica from "@/public/logos/images/bank-of-america.png";
import BASF from "@/public/logos/images/basf.png";
import Cargill from "@/public/logos/images/cargill.png";
import Citi from "@/public/logos/images/citi.png";
import Comcast from "@/public/logos/images/comcast.png";
import Costco from "@/public/logos/images/costco.png";
import Deloitte from "@/public/logos/images/deloitte.png";
import DeutscheTelekom from "@/public/logos/images/deutsche-telekom.png";
import Disney from "@/public/logos/images/disney.png";
import DrHorton from "@/public/logos/images/dr-horton.png";
import ExxonMobil from "@/public/logos/images/exxonmobil.png";
import EY from "@/public/logos/images/ey.png";
import FedEx from "@/public/logos/images/fedex.png";
import GoldmanSachs from "@/public/logos/images/goldman-sachs.png";
import Google from "@/public/logos/images/google.png";
import HSBC from "@/public/logos/images/hsbc.png";
import JohnsonAndJohnson from "@/public/logos/images/johnson-&-johnson.png";
import JPMC from "@/public/logos/images/jpmc.png";
import KPMG from "@/public/logos/images/kpmg.png";
import Maersk from "@/public/logos/images/maersk.png";
import McKinsey from "@/public/logos/images/mckinsey.png";
import Meta from "@/public/logos/images/meta.png";
import Microsoft from "@/public/logos/images/microsoft.png";
import MorganStanley from "@/public/logos/images/morgan-stanley.png";
import Nestle from "@/public/logos/images/nestle.png";
import Netflix from "@/public/logos/images/netflix.png";
import Pfizer from "@/public/logos/images/pfizer.png";
import PWC from "@/public/logos/images/pwc.png";
import Roche from "@/public/logos/images/roche.png";
import Siemens from "@/public/logos/images/siemens.png";
import Shell from "@/public/logos/images/shell.png";
import Skanska from "@/public/logos/images/skanska.png";
import TSMC from "@/public/logos/images/tsmc.png";
import TysonFoods from "@/public/logos/images/tyson-foods.png";
import UPS from "@/public/logos/images/ups.png";
import Verizon from "@/public/logos/images/verizon.png";
import Vinci from "@/public/logos/images/vinci.png";
import Walmart from "@/public/logos/images/walmart.png";

export const companyLogos = {
  ADM: ADM,
  Amazon: Amazon,
  Apple: Apple,
  "Saudi Aramco": Aramco,
  "AT&T": ATnT,
  "Bank of America": BankOfAmerica,
  BASF: BASF,
  Cargill: Cargill,
  Citi: Citi,
  Comcast: Comcast,
  Costco: Costco,
  Deloitte: Deloitte,
  "Deutsche Telekom": DeutscheTelekom,
  Disney: Disney,
  "DR Horton": DrHorton,
  ExxonMobil: ExxonMobil,
  EY: EY,
  FedEx: FedEx,
  "Goldman Sachs": GoldmanSachs,
  Google: Google,
  HSBC: HSBC,
  "Johnson & Johnson": JohnsonAndJohnson,
  "JPMorgan Chase": JPMC,
  KPMG: KPMG,
  Maersk: Maersk,
  "McKinsey & Company": McKinsey,
  Meta: Meta,
  Microsoft: Microsoft,
  "Morgan Stanley": MorganStanley,
  Nestlé: Nestle,
  Netflix: Netflix,
  Pfizer: Pfizer,
  PwC: PWC,
  Roche: Roche,
  Siemens: Siemens,
  Shell: Shell,
  Skanska: Skanska,
  TSMC: TSMC,
  "Tyson Foods": TysonFoods,
  UPS: UPS,
  Verizon: Verizon,
  Vinci: Vinci,
  Walmart: Walmart,
} as const;

/**
 * Get the logo for a company
 * @param companyName - The name of the company
 * @returns The company logo image
 */
export const getCompanyLogo = (companyName: string) => {
  return companyLogos[companyName as keyof typeof companyLogos];
};
