import React from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/(protected)/Header";
import { getCompanyLogo } from "@/lib/company-logos";
import Image from "next/image";
import { Building2, PhoneIcon, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="max-w-3xl mx-auto p-6 overflow-y-auto">
        {/* Header Section with CTA */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-primary">
                {job?.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {job?.category && (
                  <Badge variant="secondary">{job.category}</Badge>
                )}
                {job?.seniority_level && (
                  <Badge variant="outline">{job.seniority_level}</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <BookmarkIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Primary CTA */}
          <Link href={`/call?jobId=${id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              <PhoneIcon className="mr-2 h-5 w-5" />
              Start Interview for this Role
            </Button>
          </Link>
        </div>

        {/* Job Details Grid */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-accent/20">
          <div>
            <p className="mb-1">
              <strong>Company:</strong> {job?.company?.name || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Industry:</strong> {job?.industry?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="mb-1">
              <strong>Salary Range:</strong>{" "}
              {job?.salary_range_min && job?.salary_range_max
                ? `${job.salary_range_min.toLocaleString()} - ${job.salary_range_max.toLocaleString()} ${
                    job.salary_currency || ""
                  }`
                : "N/A"}
            </p>
            <p className="mb-1">
              <strong>Seniority Level:</strong> {job?.seniority_level || "N/A"}
            </p>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mt-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> Requirements
          </h2>
          {Array.isArray(job?.typical_requirements) &&
          job.typical_requirements.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {job.typical_requirements.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No requirements specified.</p>
          )}
        </div>

        {/* Responsibilities Section */}
        <div className="mt-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="text-2xl">💼</span> Responsibilities
          </h2>
          {Array.isArray(job?.typical_responsibilities) &&
          job.typical_responsibilities.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {job.typical_responsibilities.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No responsibilities specified.
            </p>
          )}
        </div>

        {/* Company Section */}
        {job?.company && (
          <div className="mt-8 p-6 border rounded-lg bg-accent/10">
            <h2 className="text-2xl font-bold mb-4">About the Company</h2>
            <div className="flex items-start gap-4 mb-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-accent/20 aspect-square p-2">
                {companyLogo ? (
                  <Image
                    alt={`${job?.company?.name || "Company"} logo`}
                    className="h-full w-full object-contain"
                    fill
                    src={companyLogo}
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{job.company.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Founded: {job.company.founded_year || "N/A"}
                </p>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>

            {job.company.description && (
              <p className="mb-4 text-muted-foreground">
                {job.company.description}
              </p>
            )}
            {Array.isArray(job.company.values) &&
              job.company.values.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Company Values:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.company.values.map((value: string) => (
                      <Badge key={value} variant="secondary">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {job.company.culture && (
              <div>
                <h4 className="font-semibold mb-2">Company Culture:</h4>
                <p className="text-muted-foreground">{job.company.culture}</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 p-6 border rounded-lg bg-primary/5 text-center">
          <h3 className="text-lg font-semibold mb-2">Ready to Interview?</h3>
          <p className="text-muted-foreground mb-4">
            Practice your interview skills with our AI interviewer tailored for
            this role
          </p>
          <Link href={`/call?jobId=${id}`}>
            <Button size="lg">
              <PhoneIcon className="mr-2 h-5 w-5" />
              Start Interview Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
