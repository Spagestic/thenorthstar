// app/(protected)/jobs/components/searchParams.ts
import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsString,
} from "nuqs/server";

export const jobPostingsSearchParamsCache = createSearchParamsCache({
    search: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("posted_at_desc"),
    employmentType: parseAsString,
    workMode: parseAsString,
    page: parseAsInteger.withDefault(1),
});
