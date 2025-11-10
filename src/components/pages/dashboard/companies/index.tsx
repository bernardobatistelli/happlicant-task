"use client";

import { CompanyCard, CompanyCardSkeleton } from "@/components/company-card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import type { Company } from "@/types/company";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { CompaniesTable, CompaniesTableSkeleton } from "./companies-table";

interface CompaniesPaginatedListProps {
  companies: Company[];
  itemsPerPage?: number;
  initialPage: number;
}

export function CompaniesPaginatedList({
  companies,
  itemsPerPage = 6,
  initialPage,
}: CompaniesPaginatedListProps) {
  // Use nuqs to manage page state in URL
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(initialPage),
  );

  // Ensure currentPage is never null
  const activePage = currentPage ?? initialPage;

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = companies.slice(startIndex, endIndex);

  const handleEdit = (company: Company) => {
    // TODO: Implement edit dialog
    console.log("Edit company:", company.name);
  };

  const handleDelete = (company: Company) => {
    // TODO: Implement delete dialog
    console.log("Delete company:", company.name);
  };

  const goToPage = (page: number) => {
    void setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
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

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-lg">No companies found.</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Try adding some companies to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:hidden">
        {currentCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="hidden xl:block">
        <CompaniesTable
          companies={currentCompanies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <Button
                variant="ghost"
                size="default"
                className="gap-1 px-2.5 sm:pl-2.5"
                onClick={() => goToPage(Math.max(1, activePage - 1))}
                disabled={activePage === 1}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:block">Previous</span>
              </Button>
            </PaginationItem>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <Button
                    variant={activePage === page ? "outline" : "ghost"}
                    size="icon"
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={activePage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                )}
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <Button
                variant="ghost"
                size="default"
                className="gap-1 px-2.5 sm:pr-2.5"
                onClick={() => goToPage(Math.min(totalPages, activePage + 1))}
                disabled={activePage === totalPages}
                aria-label="Go to next page"
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRight className="size-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Pagination Info */}
      <div className="text-muted-foreground text-center text-sm">
        Showing {startIndex + 1}-{Math.min(endIndex, companies.length)} of{" "}
        {companies.length} companies
      </div>
    </div>
  );
}

// Loading skeleton for the entire list
export function CompaniesListSkeleton({
  itemsPerPage = 9,
}: {
  itemsPerPage?: number;
}) {
  return (
    <div className="space-y-8">
      {/* Grid Skeleton - Hidden on xl screens */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:hidden">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </div>

      {/* Table Skeleton - Visible only on xl screens */}
      <div className="hidden xl:block">
        <CompaniesTableSkeleton rows={itemsPerPage} />
      </div>
    </div>
  );
}
