/** One place slot from job postings (DB `location` JSON is often an array of these). */
export type JobLocationEntry = {
    city?: string | null;
    state?: string | null;
    country?: string | null;
    rawAddress?: string | null;
};

export type JobPosting = {
    id: string;
    title?: string | null;
    companyName?: string | null;
    companyLogo?: string | null;
    companyLogoUrl?: string | null;
    companyDomain?: string | null;
    url?: string | null;
    jobLocations?: JobLocationEntry[] | null;
    workMode?: "REMOTE" | "HYBRID" | "ONSITE" | "UNKNOWN" | null;
    employmentType?:
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT"
        | "TEMPORARY"
        | "INTERN"
        | "VOLUNTEER"
        | "OTHER"
        | null;
    description?: string | null;
    descriptionRaw?: string | null;
    responsibilities?: string[] | null;
    qualifications?: string[] | null;
    baseSalary?: {
        currency?: string | null;
        minValue?: number | null;
        maxValue?: number | null;
        unitText?: string | null;
    } | null;
    datePosted?: string | null;
    validThrough?: string | null;
    directApplyUrl?: string | null;
};
