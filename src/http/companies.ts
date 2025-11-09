import { prismaToCompany } from "@/lib/company-mapper";
import {
  createCompanyInDb,
  deleteCompanyFromDb,
  findAllCompanies,
  findCompanyById,
  isCompanyPersisted,
  persistCompany,
  updateCompanyInDb,
} from "@/lib/company-repository";
import { loadDummyData } from "@/lib/data/dummy-data";
import type { Company } from "@/types/company";
import { cache } from "react";

export const getCompanies = cache(async (): Promise<Company[]> => {
  try {
    const [dbCompanies, dummyCompanies] = await Promise.all([
      findAllCompanies(),
      loadDummyData(),
    ]);

    const dbCompaniesFormatted = dbCompanies.map(prismaToCompany);

    const persistedIds = new Set(dbCompanies.map((c) => c.id));

    const nonPersistedDummy = dummyCompanies.filter(
      (c) => !persistedIds.has(c.id)
    );

    return [...dbCompaniesFormatted, ...nonPersistedDummy];
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies");
  }
});


export const getCompany = cache(async (id: string): Promise<Company | null> => {
  try {
    const dbCompany = await findCompanyById(id);

    if (dbCompany) {
      return prismaToCompany(dbCompany);
    }

    const dummyCompanies = await loadDummyData();
    const dummyCompany = dummyCompanies.find((c) => c.id === id);

    if (dummyCompany) {
      await persistCompany(dummyCompany);
      console.log(`[Lazy Load] Persisted company: ${dummyCompany.name}`);
      return dummyCompany;
    }

    return null;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw new Error("Failed to fetch company");
  }
});

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
    const existingCompany = await findCompanyById(id);

    if (!existingCompany) {
      const dummyCompanies = await loadDummyData();
      const dummyCompany = dummyCompanies.find((c) => c.id === id);
      
      if (dummyCompany) {
        await persistCompany(dummyCompany);
      } else {
        throw new Error("Company not found");
      }
    }

    const updatedCompany = await updateCompanyInDb(id, data);
    return prismaToCompany(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    throw new Error("Failed to update company");
  }
}


export async function deleteCompany(id: string): Promise<void> {
  try {
    await deleteCompanyFromDb(id);
  } catch (error) {
    console.error("Error deleting company:", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return;
    }
    throw new Error("Failed to delete company");
  }
}

export async function seedDummyData(): Promise<{ count: number }> {
  try {
    const dummyCompanies = await loadDummyData();
    let persistedCount = 0;

    for (const company of dummyCompanies) {
      const exists = await isCompanyPersisted(company.id);
      if (!exists) {
        await persistCompany(company);
        persistedCount++;
      }
    }
    
    return { count: persistedCount };
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    throw new Error("Failed to seed dummy data");
  }
}
