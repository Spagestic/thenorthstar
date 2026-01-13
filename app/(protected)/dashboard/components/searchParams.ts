import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

// Define all job search parameters with their parsers
export const jobSearchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  industry: parseAsString,
  company: parseAsString,
  seniority: parseAsString,
  page: parseAsInteger.withDefault(1),
});
