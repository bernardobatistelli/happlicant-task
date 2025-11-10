import type { Company } from "@/types/company";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

interface UseCompanyFiltersProps {
  companies: Company[];
  initialPage: number;
  initialItemsPerPage: number;
  initialSearch: string;
  initialIndustry: string;
}

export function useCompanyFilters({
  companies,
  initialPage,
  initialItemsPerPage,
  initialSearch,
  initialIndustry,
}: UseCompanyFiltersProps) {
  const [searchInput, setSearchInput] = useState(initialSearch);

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(initialPage)
  );

  const [itemsPerPage, setItemsPerPage] = useQueryState(
    "itemsPerPage",
    parseAsInteger.withDefault(initialItemsPerPage)
  );

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(initialSearch)
  );

  const [industry, setIndustry] = useQueryState(
    "industry",
    parseAsString.withDefault(initialIndustry)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        void setSearch(searchInput || null);
        void setCurrentPage(1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch, setCurrentPage]);

  const industries = useMemo(() => {
    const industrySet = new Set<string>();
    companies.forEach((company) => {
      if (company.industry) {
        if (typeof company.industry === "string") {
          industrySet.add(company.industry);
        } else if (
          typeof company.industry === "object" &&
          "primary" in company.industry &&
          typeof company.industry.primary === "string"
        ) {
          industrySet.add(company.industry.primary);
        }
      }
    });
    return Array.from(industrySet).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    let filtered = companies;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((company) => {
        const nameMatch = company.name.toLowerCase().includes(searchLower);
        const descMatch = company.description?.toLowerCase().includes(searchLower);
        return nameMatch || descMatch;
      });
    }

    if (industry) {
      filtered = filtered.filter((company) => {
        if (!company.industry) return false;
        
        if (typeof company.industry === "string") {
          return company.industry === industry;
        } else if (
          typeof company.industry === "object" &&
          "primary" in company.industry
        ) {
          return company.industry.primary === industry;
        }
        return false;
      });
    }

    return filtered;
  }, [companies, search, industry]);

  const clearFilters = () => {
    setSearchInput("");
    void setSearch(null);
    void setIndustry(null);
    void setCurrentPage(1);
  };

  return {
    // Search state
    searchInput,
    setSearchInput,
    search,
    setSearch,

    // Filter state
    industry,
    setIndustry,
    industries,

    // Pagination state
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,

    // Derived data
    filteredCompanies,
    hasActiveFilters: Boolean(search || industry),

    // Actions
    clearFilters,
  };
}
