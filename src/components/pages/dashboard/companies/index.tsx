"use client";

import { CompanyCardSkeleton } from "@/components/company-card";
import type { Company } from "@/types/company";
import { CompaniesTableSkeleton } from "./companies-table";
import { CompaniesDialogs } from "./components/companies-dialogs";
import { CompaniesEmptyState } from "./components/companies-empty-state";
import { CompaniesFilterBar } from "./components/companies-filter-bar";
import { CompaniesGrid } from "./components/companies-grid";
import { CompaniesPagination } from "./components/companies-pagination";
import { PaginationInfo } from "./components/pagination-info";
import { useCompanyActions } from "./hooks/use-company-actions";
import { useCompanyFilters } from "./hooks/use-company-filters";
import { usePagination } from "./hooks/use-pagination";

interface CompaniesPaginatedListProps {
  companies: Company[];
  initialPage: number;
  initialItemsPerPage: number;
  initialSearch: string;
  initialIndustry: string;
}

export function CompaniesPaginatedList({
  companies,
  initialPage,
  initialItemsPerPage,
  initialSearch,
  initialIndustry,
}: CompaniesPaginatedListProps) {
  // Custom hooks for state management
  const filters = useCompanyFilters({
    companies,
    initialPage,
    initialItemsPerPage,
    initialSearch,
    initialIndustry,
  });

  const actions = useCompanyActions(filters.filteredCompanies);

  const pagination = usePagination({
    companies: actions.optimisticCompanies,
    currentPage: filters.currentPage,
    itemsPerPage: filters.itemsPerPage,
    initialPage,
    initialItemsPerPage,
  });

  const handleSearchInputChange = (value: string) => {
    filters.setSearchInput(value);
  };

  const handleClearSearch = () => {
    filters.setSearchInput("");
    void filters.setSearch(null);
    void filters.setCurrentPage(1);
  };

  const handleIndustryChange = (value: string | null) => {
    void filters.setIndustry(value);
    void filters.setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    pagination.goToPage(page, (p) => void filters.setCurrentPage(p));
  };

  const handleItemsPerPageChange = (value: number) => {
    void filters.setItemsPerPage(value);
    void filters.setCurrentPage(1);
  };

  if (actions.optimisticCompanies.length === 0) {
    return (
      <>
        <CompaniesFilterBar
          searchInput={filters.searchInput}
          onSearchInputChange={handleSearchInputChange}
          onClearSearch={handleClearSearch}
          industry={filters.industry}
          onIndustryChange={handleIndustryChange}
          industries={filters.industries}
          onCreateClick={() => actions.setCreateDialogOpen(true)}
        />

        <CompaniesEmptyState
          hasActiveFilters={filters.hasActiveFilters}
          onClearFilters={filters.clearFilters}
        />

        <CompaniesDialogs
          deleteDialogOpen={actions.deleteDialogOpen}
          setDeleteDialogOpen={actions.setDeleteDialogOpen}
          companyToDelete={actions.companyToDelete}
          onDeleteConfirm={actions.handleDeleteConfirm}
          editDialogOpen={actions.editDialogOpen}
          setEditDialogOpen={actions.setEditDialogOpen}
          companyToEdit={actions.companyToEdit}
          onEditSuccess={actions.handleEditSuccess}
          createDialogOpen={actions.createDialogOpen}
          setCreateDialogOpen={actions.setCreateDialogOpen}
          onCreateSuccess={actions.handleCreateSuccess}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <CompaniesFilterBar
          searchInput={filters.searchInput}
          onSearchInputChange={handleSearchInputChange}
          onClearSearch={handleClearSearch}
          industry={filters.industry}
          onIndustryChange={handleIndustryChange}
          industries={filters.industries}
          onCreateClick={() => actions.setCreateDialogOpen(true)}
        />

        <CompaniesGrid
          companies={pagination.currentCompanies}
          onEdit={actions.handleEdit}
          onDelete={actions.handleDelete}
        />

        <CompaniesPagination
          totalPages={pagination.totalPages}
          activePage={pagination.activePage}
          onPageChange={handlePageChange}
          getPageNumbers={pagination.getPageNumbers}
        />

        <PaginationInfo
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalCompanies={actions.optimisticCompanies.length}
          itemsPerPage={filters.itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <CompaniesDialogs
        deleteDialogOpen={actions.deleteDialogOpen}
        setDeleteDialogOpen={actions.setDeleteDialogOpen}
        companyToDelete={actions.companyToDelete}
        onDeleteConfirm={actions.handleDeleteConfirm}
        editDialogOpen={actions.editDialogOpen}
        setEditDialogOpen={actions.setEditDialogOpen}
        companyToEdit={actions.companyToEdit}
        onEditSuccess={actions.handleEditSuccess}
        createDialogOpen={actions.createDialogOpen}
        setCreateDialogOpen={actions.setCreateDialogOpen}
        onCreateSuccess={actions.handleCreateSuccess}
      />
    </>
  );
}

export function CompaniesListSkeleton({
  itemsPerPage = 9,
}: {
  itemsPerPage?: number;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:hidden">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </div>

      <div className="hidden xl:block">
        <CompaniesTableSkeleton rows={itemsPerPage} />
      </div>
    </div>
  );
}
