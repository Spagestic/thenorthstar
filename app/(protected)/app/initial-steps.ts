import { ScraperStep } from "./components/scraper-progress";

export const INITIAL_STEPS: ScraperStep[] = [
    {
        id: "1",
        title: "Scrape Job Page",
        description: "Fetching content from the job posting URL...",
        status: "pending",
    },
    {
        id: "2",
        title: "Extract Details",
        description: "Using AI to extract structured job data...",
        status: "pending",
    },
    {
        id: "3",
        title: "Save to Database",
        description: "Storing the job posting...",
        status: "pending",
    },
];
