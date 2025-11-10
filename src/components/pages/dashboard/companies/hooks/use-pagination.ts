import type { Company } from "@/types/company";
import { useMemo } from "react";

interface UsePaginationProps {
  companies: Company[];
  currentPage: number | null;
  itemsPerPage: number | null;
  initialPage: number;
  initialItemsPerPage: number;
}

export function usePagination({
  companies,
  currentPage,
  itemsPerPage,
  initialPage,
  initialItemsPerPage,
}: UsePaginationProps) {
  const activePage = currentPage ?? initialPage;
  const activeItemsPerPage = itemsPerPage ?? initialItemsPerPage;

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(companies.length / activeItemsPerPage);
    const startIndex = (activePage - 1) * activeItemsPerPage;
    const endIndex = startIndex + activeItemsPerPage;
    const currentCompanies = companies.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentCompanies,
      activePage,
      activeItemsPerPage,
    };
  }, [companies, activePage, activeItemsPerPage]);

  const goToPage = (page: number, setCurrentPage: (page: number) => void) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = (totalPages: number, activePage: number) => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (activePage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (activePage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return {
    ...paginationData,
    goToPage,
    getPageNumbers,
  };
}
