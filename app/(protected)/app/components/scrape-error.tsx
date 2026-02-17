import { CircleX } from "lucide-react";

interface ScrapeErrorProps {
  error: string;
}

export function ScrapeError({ error }: ScrapeErrorProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 flex items-center">
      <CircleX className="w-5 h-5 mr-2" />
      {error}
    </div>
  );
}
