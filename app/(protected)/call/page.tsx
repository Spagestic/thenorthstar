import { CallInterface } from "@/components/call";
import Header from "../Header";

interface PageProps {
  searchParams: { jobId?: string };
}

async function getJobTitle(jobId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.title || null;
  } catch (error) {
    console.error("Failed to fetch job details:", error);
    return null;
  }
}

export default async function Page({ searchParams }: PageProps) {
  const data = await searchParams;
  const jobId = data.jobId;
  const jobTitle = jobId ? await getJobTitle(jobId) : null;

  return (
    <div>
      <Header
        nav={
          jobTitle
            ? [{ label: jobTitle, href: `/job/${jobId}` }, { label: "Call" }]
            : [{ label: "Call" }]
        }
      />
      <CallInterface />
    </div>
  );
}
