import type { Prisma, Company as PrismaCompany } from "@prisma/client";
import type { Company } from "../types/company";

export function prismaToCompany(prismaCompany: PrismaCompany): Company {
  return {
    id: prismaCompany.id,
    name: prismaCompany.name,
    description: prismaCompany.description ?? undefined,
    logo_url: prismaCompany.logoUrl ?? undefined,
    website: prismaCompany.website ?? undefined,
    location: prismaCompany.location as Company["location"],
    industry: prismaCompany.industry as Company["industry"],
    employee_count: prismaCompany.employeeCount ?? undefined,
    founded: prismaCompany.founded ?? undefined,
    ceo: prismaCompany.ceo as Company["ceo"],
  };
}

export function companyToPrismaCreate(company: {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  location?: Company["location"];
  industry?: Company["industry"];
  employee_count?: number;
  founded?: number;
  ceo?: Company["ceo"];
}): Prisma.CompanyCreateInput {
  return {
    id: company.id,
    name: company.name,
    description: company.description ?? null,
    logoUrl: company.logo_url ?? null,
    website: company.website ?? null,
    location: company.location as Prisma.InputJsonValue,
    industry: company.industry as Prisma.InputJsonValue,
    employeeCount: company.employee_count ?? null,
    founded: company.founded ?? null,
    ceo: company.ceo as Prisma.InputJsonValue,
  };
}

export function companyToPrismaUpdate(data: Partial<{
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  location?: Company["location"];
  industry?: Company["industry"];
  employee_count?: number;
  founded?: number;
  ceo?: Company["ceo"];
}>): Prisma.CompanyUpdateInput {
  return {
    name: data.name,
    description: data.description,
    logoUrl: data.logo_url,
    website: data.website,
    location: data.location as Prisma.InputJsonValue,
    industry: data.industry as Prisma.InputJsonValue,
    employeeCount: data.employee_count,
    founded: data.founded,
    ceo: data.ceo as Prisma.InputJsonValue,
  };
}
