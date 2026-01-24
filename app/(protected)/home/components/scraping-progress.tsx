import { useEffect } from "react";
import { useJobScraper } from "../job-scraper";

export function ScrapingProgress({ jobId }: { jobId: string | null }) {
  const { steps, restoreProgress } = useJobScraper();

  useEffect(() => {
    if (!jobId) return;

    // Restore state on mount
    restoreProgress(jobId);

    // Poll every 2 seconds while job is running
    const interval = setInterval(async () => {
      const job = await restoreProgress(jobId);
      if (job?.status === "completed" || job?.status === "failed") {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div>
      {steps.map((step) => (
        <div key={step.id}>
          <h3>{step.title}</h3>
          <p>Status: {step.status}</p>
          {step.details && (
            <ul>
              {step.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
