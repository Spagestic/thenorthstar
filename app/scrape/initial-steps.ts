import { ScraperStep } from "@/app/scrape/components/scraper-progress";

export const INITIAL_STEPS: ScraperStep[] = [
    {
        id: "1",
        title: "Scrape Career Page",
        description:
            "Fetching raw HTML and markdown from the main careers page.",
        status: "pending",
    },
    {
        id: "2",
        title: "Identify Job Links",
        description:
            "Using AI to analyze the page and extract valid job posting URLs.",
        status: "pending",
    },
    {
        id: "3",
        title: "Extract Job Details",
        description: "Crawling and analyzing individual postings in parallel.",
        status: "pending",
    },
    {
        id: "4",
        title: "Save to Database",
        description: "Upserting extracted jobs into Supabase.",
        status: "pending",
    },
];
