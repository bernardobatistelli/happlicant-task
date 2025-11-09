import type { Company } from "../types/company";
import { companyToPrismaCreate, companyToPrismaUpdate } from "./company-mapper";
import { db } from "./db";

export async function isCompanyPersisted(id: string): Promise<boolean> {
  const company = await db.company.findUnique({
    where: { id },
  });
  return company !== null;
}

export async function findCompanyById(id: string) {
  return await db.company.findUnique({
    where: { id },
  });
}

export async function findAllCompanies() {
  return await db.company.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCompanyInDb(company: {
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
}) {
  const prismaData = companyToPrismaCreate(company);
  return await db.company.create({
    data: prismaData,
  });
}

export async function updateCompanyInDb(
  id: string,
  data: Partial<{
    name: string;
    description?: string;
    logo_url?: string;
    website?: string;
    location?: Company["location"];
    industry?: Company["industry"];
    employee_count?: number;
    founded?: number;
    ceo?: Company["ceo"];
  }>
) {
  const prismaData = companyToPrismaUpdate(data);
  return await db.company.update({
    where: { id },
    data: prismaData,
  });
}

export async function deleteCompanyFromDb(id: string) {
  return await db.company.delete({
    where: { id },
  });
}


export async function persistCompany(company: Company): Promise<void> {
  await createCompanyInDb(company);
}
