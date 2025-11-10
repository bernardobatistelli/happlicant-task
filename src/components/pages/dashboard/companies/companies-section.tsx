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
  const { page } = await companiesSearchParamsCache.parse(searchParams);
  const companies = await getCompanies();

  return <CompaniesPaginatedList companies={companies} initialPage={page} />;
}
