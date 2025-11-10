"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatCEO,
  formatEmployeeCount,
  formatIndustry,
  formatLocation,
} from "@/lib/utils/company";
import type { Company } from "@/types/company";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

interface CompaniesTableProps {
  companies: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

export function CompaniesTable({
  companies,
  onEdit,
  onDelete,
}: CompaniesTableProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
        <p className="text-muted-foreground text-lg">No companies found.</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Try adding some companies to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Company</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-center">Employees</TableHead>
          <TableHead>CEO</TableHead>
          <TableHead className="text-center">Founded</TableHead>
          <TableHead className="w-[100px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => {
          const location = formatLocation(company.location);
          const industry = formatIndustry(company.industry);
          const ceo = formatCEO(company.ceo);
          const employeeCount = formatEmployeeCount(company.employee_count);

          return (
            <TableRow key={company.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage src={company.logo_url} alt={company.name} />
                    <AvatarFallback>
                      {company.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{company.name}</span>
                    {company.website && (
                      <Link
                        href={company.website as Route}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary flex max-w-56 items-center gap-1 truncate text-xs"
                      >
                        <span className="truncate">
                          {company.website.replace(/^https?:\/\//i, "")}
                        </span>
                        <ExternalLink className="size-3 shrink-0" />
                      </Link>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Industry */}
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm">
                    {industry !== "N/A" ? industry : "-"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {typeof company.industry === "string"
                        ? company.industry
                        : `${company.industry?.primary ?? "Unknown"} - ${company.industry?.sectors?.join(', ') ?? ""}`}
                    </p>
                  </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              {/* Location */}
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm">
                        {location !== "N/A" ? location : "-"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {typeof company.location === "string"
                          ? company.location
                          : `${company.location?.address ?? "Unknown"}, ${company.location?.city ?? ""}, ${company.location?.country ?? ""}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              {/* Employees */}
              <TableCell className="text-center">
                <span className="text-sm">
                  {employeeCount !== "N/A" ? employeeCount : "-"}
                </span>
              </TableCell>

              {/* CEO */}
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm">
                        {ceo !== "N/A" ? ceo : "-"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {typeof company.ceo === "string"
                          ? company.ceo
                          : (company.ceo?.name ?? "Unknown")}
                      </p>
                      {company.ceo &&
                        typeof company.ceo === "object" &&
                        company.ceo.since && <p>Since: {company.ceo.since}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              {/* Founded */}
              <TableCell className="text-center">
                <span className="text-sm">{company.founded ?? "-"}</span>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit?.(company)}
                    aria-label="Edit company"
                    className="size-9"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete?.(company)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 size-9"
                    aria-label="Delete company"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function CompaniesTableSkeleton({ rows = 9 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Company</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-center">Employees</TableHead>
          <TableHead>CEO</TableHead>
          <TableHead className="text-center">Founded</TableHead>
          <TableHead className="w-[100px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="ml-auto h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="mx-auto h-4 w-12" />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Skeleton className="size-9" />
                <Skeleton className="size-9" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
