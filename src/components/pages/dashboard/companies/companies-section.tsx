import { companiesSearchParamsCache } from "@/app/(dashboard)/home/searchParams";
import { getCompanies } from "@/http/companies";
import type { SearchParams } from "nuqs/server";
import { CompaniesPaginatedList } from "./index";

interface CompaniesSectionProps {
  searchParams: Promise<SearchParams>;
}

export async function CompaniesSection({
  searchParams,
}: CompaniesSectionProps) {
  const { page, itemsPerPage, search, industry } = await companiesSearchParamsCache.parse(searchParams);
  
  const filters = {
    ...(search && { search }),
    ...(industry && { industry }),
  };
  
  const companies = await getCompanies(Object.keys(filters).length > 0 ? filters : undefined);

  return (
    <CompaniesPaginatedList
      companies={companies}
      initialPage={page}
      initialItemsPerPage={itemsPerPage}
      initialSearch={search}
      initialIndustry={industry}
    />
  );
}
