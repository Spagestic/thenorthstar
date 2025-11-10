import { Footer } from "@/components/footer-section";
import {
  IconBrandGithub,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
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
            src={"/logo_light.png"}
            width={40}
          />
        }
        mainLinks={[
          { href: "#products", label: "Products" },
          { href: "#about", label: "About" },
          { href: "#blog", label: "Blog" },
          { href: "#contact", label: "Contact" },
        ]}
        socialLinks={[
          {
            icon: <IconBrandYoutube className="h-5 w-5" />,
            href: "https://youtube.com/",
            label: "YouTube",
          },
          {
            icon: <IconBrandX className="h-5 w-5" />,
            href: "https://x.com",
            label: "X",
          },
          {
            icon: <IconBrandInstagram className="h-5 w-5" />,
            href: "https://instagram.com/",
            label: "Instagram",
          },
          {
            icon: <IconBrandFacebook className="h-5 w-5" />,
            href: "https://facebook.com/",
            label: "Facebook",
          },
          {
            icon: <IconBrandLinkedin className="h-5 w-5" />,
            href: "https://linkedin.com/company/",
            label: "LinkedIn",
          },
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
