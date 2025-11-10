import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationInfoProps {
  startIndex: number;
  endIndex: number;
  totalCompanies: number;
  itemsPerPage: number | null;
  onItemsPerPageChange: (value: number) => void;
}

export function PaginationInfo({
  startIndex,
  endIndex,
  totalCompanies,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
      <div className="text-muted-foreground text-center sm:text-left">
        Showing {startIndex + 1}-{Math.min(endIndex, totalCompanies)} of{" "}
        {totalCompanies} companies
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Items per page:</span>
        <Select
          value={itemsPerPage?.toString() ?? "6"}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
