import { CACHE_TAGS } from "@/lib/cache-tags";
import { prismaToCompany } from "@/lib/company-mapper";
import {
  createCompanyInDb,
  deleteCompanyFromDb,
  findAllCompanies,
  findCompanyById,
  updateCompanyInDb,
} from "@/lib/company-repository";
import type { Company } from "@/types/company";
import { cacheTag } from "next/cache";

export async function getCompanies(filters?: {
  search?: string;
  industry?: string;
}): Promise<Company[]> {
  "use cache";
  cacheTag(CACHE_TAGS.companies);

  try {
    const dbCompanies = await findAllCompanies(filters);
    return dbCompanies.map(prismaToCompany);
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies");
  }
}

export async function getCompany(id: string): Promise<Company | null> {
  "use cache";
  cacheTag(CACHE_TAGS.company(id));

  try {
    const dbCompany = await findCompanyById(id);
    return dbCompany ? prismaToCompany(dbCompany) : null;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw new Error("Failed to fetch company");
  }
}

export async function createCompany(data: {
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
}): Promise<Company> {
  try {
    const newCompany = await createCompanyInDb(data);
    return prismaToCompany(newCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    throw new Error("Failed to create company");
  }
}

export async function updateCompany(
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
): Promise<Company> {
  try {
    const updatedCompany = await updateCompanyInDb(id, data);
    return prismaToCompany(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    throw new Error("Failed to update company");
  }
}


export async function deleteCompany(id: string): Promise<void> {
  try {
    const company = await findCompanyById(id);
    
    if (!company) {
      console.warn(`[Delete] Company with id ${id} not found in database`);
      return;
    }

    await deleteCompanyFromDb(id);
  } catch (error) {
    console.error("Error deleting company:", error);
    throw new Error("Failed to delete company");
  }
}
