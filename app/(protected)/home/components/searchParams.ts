import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsString,
} from "nuqs/server";

export const jobPostingsSearchParamsCache = createSearchParamsCache({
    search: parseAsString.withDefault(""),
    employmentType: parseAsString,
    workMode: parseAsString,
    page: parseAsInteger.withDefault(1),
});
