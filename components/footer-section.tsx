import { Button } from "@/components/ui/button";
import Link from "next/link";

type FooterProps = {
  logo: React.ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
};

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="pt-8 pb-6 lg:pt-16 lg:pb-8">
      <div className="px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <Link
            aria-label={brandName}
            className="flex items-center gap-x-2"
            href="/"
          >
            {logo}
            <span className="font-bold text-xl">{brandName}</span>
          </Link>
          <ul className="mt-6 flex list-none space-x-3 md:mt-0">
            {socialLinks.map((link, i) => (
              <li key={i as number}>
                <Button
                  asChild
                  className="h-10 w-10 rounded-full"
                  size="icon"
                  variant="secondary"
                >
                  <a aria-label={link.label} href={link.href} target="_blank">
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 border-t pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:col-[4/11] lg:mt-0">
            <ul className="-my-1 -mx-2 flex list-none flex-wrap lg:justify-end">
              {mainLinks.map((link, i) => (
                <li className="mx-2 my-1 shrink-0" key={i as number}>
                  <a
                    className="text-primary text-sm underline-offset-4 hover:underline"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:col-[4/11] lg:mt-0">
            <ul className="-my-1 -mx-3 flex list-none flex-wrap lg:justify-end">
              {legalLinks.map((link, i) => (
                <li className="mx-3 my-1 shrink-0" key={i as number}>
                  <a
                    className="text-muted-foreground text-sm underline-offset-4 hover:underline"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 whitespace-nowrap text-muted-foreground text-sm leading-6 lg:col-[1/4] lg:row-[1/3] lg:mt-0">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  );
}
