import { JobPosting } from "@/app/api/ai/extract/details/schema";
import { JobCard } from "./job-card";

interface JobListProps {
  jobs: JobPosting[];
}

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="grid gap-4">
      {jobs.map((job, idx) => (
        <JobCard key={job.url || idx} job={job} />
      ))}
    </div>
  );
}
