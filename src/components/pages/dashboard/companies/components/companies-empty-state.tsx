import { Button } from "@/components/ui/button";

interface CompaniesEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function CompaniesEmptyState({
  hasActiveFilters,
  onClearFilters,
}: CompaniesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground text-lg">No companies found.</p>
      <p className="text-muted-foreground mt-2 text-sm">
        {hasActiveFilters
          ? "Try adjusting your search or filters."
          : "Try adding some companies to get started."}
      </p>
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="mt-4">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
