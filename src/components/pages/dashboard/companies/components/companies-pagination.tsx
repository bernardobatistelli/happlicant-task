import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompaniesPaginationProps {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
  getPageNumbers: (
    totalPages: number,
    activePage: number,
  ) => (number | "ellipsis")[];
}

export function CompaniesPagination({
  totalPages,
  activePage,
  onPageChange,
  getPageNumbers,
}: CompaniesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 px-2.5 sm:pl-2.5"
            onClick={() => onPageChange(Math.max(1, activePage - 1))}
            disabled={activePage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:block">Previous</span>
          </Button>
        </PaginationItem>

        {getPageNumbers(totalPages, activePage).map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <Button
                variant={activePage === page ? "outline" : "ghost"}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={activePage === page ? "page" : undefined}
              >
                {page}
              </Button>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 px-2.5 sm:pr-2.5"
            onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}
            disabled={activePage === totalPages}
            aria-label="Go to next page"
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
