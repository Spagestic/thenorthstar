import React from "react";
import { createClient } from "@/lib/supabase/server";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase
    .from("job_positions")
    .select(`*, company:companies(name), industry:industry(name)`)
    .eq("id", id)
    .single();

  return (
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
    </div>
  );
}
