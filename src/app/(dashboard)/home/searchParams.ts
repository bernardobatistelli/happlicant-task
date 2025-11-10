import { createSearchParamsCache, parseAsInteger } from "nuqs/server";

export const companiesSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
});
