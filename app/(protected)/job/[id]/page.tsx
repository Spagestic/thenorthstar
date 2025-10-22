import React from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/(protected)/Header";
import { getCompanyLogo } from "@/lib/company-logos";
import Image from "next/image";
import { Building2, PhoneIcon, BookmarkIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase
    .from("job_positions")
    .select(`*, company:companies(*), industry:industry(name)`)
    .eq("id", id)
    .single();
  const companyLogo =
    job?.company?.logo_url ||
    (job?.company?.name ? getCompanyLogo(job?.company?.name) : null);

  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header
        nav={[
          {
            label: job?.industry?.name,
            href: `/dashboard?industry=${encodeURIComponent(
              job?.industry?.name || ""
            )}`,
          },
          {
            label: job?.company?.name,
            href: `/dashboard?company=${encodeURIComponent(
              job?.company?.name || ""
            )}`,
          },
          { label: job?.title },
        ]}
      />

      <div className="max-w-2xl mx-auto w-full px-6 py-12 overflow-y-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-light mb-6 tracking-tight">
            {job?.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <span>{job?.company?.name}</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>{job?.industry?.name}</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>{job?.seniority_level}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/call/${id}`}>
              <Button
                size="lg"
                className="rounded-full font-normal"
                variant="default"
              >
                <PhoneIcon className="mr-2 h-4 w-4" />
                Start Interview
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="rounded-full">
              <BookmarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-16 py-8 border-y">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Category
            </p>
            <p className="font-light">{job?.category || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Compensation
            </p>
            <p className="font-light">
              {job?.salary_range_min && job?.salary_range_max
                ? `${
                    job.salary_currency || ""
                  } ${job.salary_range_min.toLocaleString()} - ${job.salary_range_max.toLocaleString()}`
                : "—"}
            </p>
          </div>
        </div>

        {/* Requirements */}
        {job?.typical_requirements && job.typical_requirements.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Requirements
            </h2>
            <ul className="space-y-3">
              {job.typical_requirements.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-muted-foreground mt-1.5 text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Responsibilities */}
        {job?.typical_responsibilities &&
          job.typical_responsibilities.length > 0 && (
            <section className="mb-16">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.typical_responsibilities.map(
                  (item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-muted-foreground mt-1.5 text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-light leading-relaxed">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

        {/* Company */}
        {job?.company && (
          <section className="mb-16 pt-12 border-t">
            <div className="flex items-start gap-6 mb-8">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                {companyLogo ? (
                  <Image
                    alt={`${job?.company?.name || "Company"} logo`}
                    className="h-full w-full object-contain p-2"
                    fill
                    src={companyLogo}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-light mb-1">{job.company.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Since {job.company.founded_year || "—"}
                </p>
              </div>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm hover:underline"
                >
                  Visit
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>

            {job.company.description && (
              <p className="font-light leading-relaxed text-muted-foreground mb-8">
                {job.company.description}
              </p>
            )}

            {job.company.values && job.company.values.length > 0 && (
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Values
                  </p>
                  <div className="space-y-1">
                    {job.company.values.map((value: string) => (
                      <p key={value} className="font-light text-sm">
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
                {job.company.culture && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                      Culture
                    </p>
                    <p className="font-light text-sm leading-relaxed">
                      {job.company.culture}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>
    </div>
  );
}
