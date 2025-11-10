import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, X } from "lucide-react";

interface CompaniesFilterBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onClearSearch: () => void;
  industry: string | null;
  onIndustryChange: (value: string | null) => void;
  industries: string[];
  onCreateClick: () => void;
}

export function CompaniesFilterBar({
  searchInput,
  onSearchInputChange,
  onClearSearch,
  industry,
  onIndustryChange,
  industries,
  onCreateClick,
}: CompaniesFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        {/* Search Input */}
        <div className="relative max-w-sm min-w-68 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search companies..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            className="pr-9 pl-9"
          />
          {searchInput && (
            <button
              onClick={onClearSearch}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Industry Filter */}
        <Select
          value={industry ?? "all"}
          onValueChange={(value) =>
            onIndustryChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-full max-w-[24rem]">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Create Button */}
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Create Company
      </Button>
    </div>
  );
}
