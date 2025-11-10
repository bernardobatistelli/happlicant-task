import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

export const companiesSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  itemsPerPage: parseAsInteger.withDefault(6),
  search: parseAsString.withDefault(""),
  industry: parseAsString.withDefault(""),
});
