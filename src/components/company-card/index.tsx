import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCEO,
  formatEmployeeCount,
  formatIndustry,
  formatLocation,
} from "@/lib/utils/company";
import type { Company } from "@/types/company";
import { Calendar, Globe, MapPin, Pencil, Trash2, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CompanyCardProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const location = formatLocation(company.location);
  const industry = formatIndustry(company.industry);
  const ceo = formatCEO(company.ceo);
  const employeeCount = formatEmployeeCount(company.employee_count);

  return (
    <Card className="gap-5.5 md:min-w-86.5">
      <CardHeader className="grid grid-cols-2 items-center px-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 shrink-0">
            <AvatarImage src={company.logo_url} alt={company.name} />
            <AvatarFallback>
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle>{company.name}</CardTitle>
            {industry && industry !== "N/A" && (
              <CardDescription>{industry}</CardDescription>
            )}
          </div>
        </div>
        <CardAction className="w-full flex-1">
          <div className="flex w-full gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit?.(company)}
              aria-label="Edit company"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete?.(company)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete company"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3.5">
        {company.description && (
          <p
            className="text-muted-foreground line-clamp-3 h-15 items-baseline text-sm"
            title={company.description}
          >
            {company.description}
          </p>
        )}

        <div className="space-y-2">
          {location && location !== "N/A" && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-muted-foreground size-4 shrink-0 text-sm" />
              <span>{location}</span>
            </div>
          )}

          {employeeCount && employeeCount !== "N/A" && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="text-muted-foreground size-4 shrink-0 text-sm" />
              <span>{employeeCount} employees</span>
            </div>
          )}

          {company.founded && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground size-4 shrink-0 text-sm" />
              <span>Founded {company.founded}</span>
            </div>
          )}

          {company.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="text-muted-foreground size-4 shrink-0 text-sm" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {company.website.replace(/^https?:\/\//i, "")}
              </a>
            </div>
          )}
        </div>
      </CardContent>

      {ceo && ceo !== "N/A" && (
        <CardFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary">CEO: {ceo}</Badge>
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
        </CardFooter>
      )}
    </Card>
  );
}

export function CompanyCardSkeleton() {
  return (
    <Card className="gap-5.5 md:min-w-86.5">
      <CardHeader className="grid h-full grid-cols-[2fr] items-center px-5">
        <div className="flex items-start gap-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-5 w-18" />
          </div>
        </div>
        <CardAction>
          <div className="flex gap-2">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-44" />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-6 w-32 rounded-full" />
      </CardFooter>
    </Card>
  );
}
