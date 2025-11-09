export const CACHE_TAGS = {
  companies: "companies",
  company: (id: string) => `company:${id}`,
} as const;
