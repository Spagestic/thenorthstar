import React from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/(protected)/Header";
import { getCompanyLogo } from "@/lib/company-logos";
import Image from "next/image";
import { Building2 } from "lucide-react";

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
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-primary">{job?.title}</h1>
        <div className="mb-4 grid grid-cols-2 gap-4">
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
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          {Array.isArray(job?.typical_requirements) &&
          job.typical_requirements.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {job.typical_requirements.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No requirements specified.</p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
          {Array.isArray(job?.typical_responsibilities) &&
          job.typical_responsibilities.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {job.typical_responsibilities.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No responsibilities specified.</p>
          )}
        </div>
        <hr className="mt-4" />
        {job?.company && (
          <div className="my-8">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-accent/20 aspect-square p-8">
              {companyLogo ? (
                <Image
                  alt={`${job?.company?.name || "Company"} logo`}
                  className="h-full w-full object-contain"
                  fill
                  src={companyLogo}
                />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center mb-2">
              <div>
                <h2 className="text-2xl font-bold">{job.company.name}</h2>
                <p className="text-sm text-gray-500">
                  Founded: {job.company.founded_year || "N/A"}
                </p>
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {job.company.website}
                </a>
              </div>
            </div>
            <p className="mb-2 text-gray-700">{job.company.description}</p>
            <div className="mb-2">
              <strong>Values:</strong>
              {Array.isArray(job.company.values) &&
              job.company.values.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {job.company.values.map((value: string) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              ) : (
                <span> N/A</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Culture:</strong>
              <span className="ml-2">{job.company.culture || "N/A"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
