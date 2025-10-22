import Header from "@/components/header";
import { Footer } from "@/components/footer-section";
import { IconBrandGithub } from "@tabler/icons-react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer
        brandName="NorthStar"
        copyright={{
          text: "© 2025 NorthStar",
          license: "All rights reserved",
        }}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        logo={
          <Image
            alt="Logo"
            className="h-10 w-10"
            height={40}
            src={"/logo_light.svg"}
            width={40}
          />
        }
        mainLinks={
          [
            // { href: "/products", label: "Products" },
            // { href: "/about", label: "About" },
            // { href: "/blog", label: "Blog" },
            // { href: "/contact", label: "Contact" },
          ]
        }
        socialLinks={[
          //   {
          //     icon: <Twitter className="h-5 w-5" />,
          //     href: "https://twitter.com",
          //     label: "Twitter",
          //   },
          {
            icon: <IconBrandGithub className="h-5 w-5" />,
            href: "https://github.com/Spagestic/thenorthstar",
            label: "GitHub",
          },
        ]}
      />
    </div>
  );
}
