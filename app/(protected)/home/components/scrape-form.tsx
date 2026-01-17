import { Button } from "@/components/ui/button";
import { UrlInput } from "./url-input";

interface ScrapeFormProps {
  url: string;
  setUrl: (url: string) => void;
  onScrape: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ScrapeForm({
  url,
  setUrl,
  onScrape,
  loading,
}: ScrapeFormProps) {
  return (
    <form onSubmit={onScrape} className="flex gap-4">
      <div className="grid w-full items-center gap-1.5 flex-1">
        <UrlInput value={url} onChange={setUrl} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Scraping..." : "Start Scrape"}
      </Button>
    </form>
  );
}
