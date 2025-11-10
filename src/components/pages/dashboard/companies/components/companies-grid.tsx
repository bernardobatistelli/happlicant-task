import { CompanyCard } from "@/components/company-card";
import type { Company } from "@/types/company";
import { CompaniesTable } from "../companies-table";

interface CompaniesGridProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompaniesGrid({
  companies,
  onEdit,
  onDelete,
}: CompaniesGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:hidden">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden xl:block">
        <CompaniesTable
          companies={companies}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}
