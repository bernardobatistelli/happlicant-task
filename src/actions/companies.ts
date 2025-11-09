"use server";

import { createCompany, deleteCompany, seedDummyData, updateCompany } from "@/http/companies";
import { CACHE_TAGS } from "@/lib/cache-tags";

import { simpleCompanySchema } from "@/lib/validations/company";
import type { FormActionState } from "@/types/company";
import { revalidateTag } from "next/cache";


export async function createCompanyAction(
  prevState: FormActionState | null,
  formData: FormData
): Promise<FormActionState> {
  try {
    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      logo_url: formData.get("logo_url"),
      website: formData.get("website"),
      location: formData.get("location"),
      industry: formData.get("industry"),
      employee_count: formData.get("employee_count"),
      founded: formData.get("founded"),
      ceo: formData.get("ceo"),
    };

    const validatedFields = simpleCompanySchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed. Please check the form fields.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const id = crypto.randomUUID();

    const newCompany = await createCompany({
      id,
      ...validatedFields.data,
    });

    revalidateTag(CACHE_TAGS.companies, "max");

    return {
      success: true,
      message: `Company "${newCompany.name}" created successfully!`,
      data: newCompany,
    };
  } catch (error) {
    console.error("Error in createCompanyAction:", error);
    return {
      success: false,
      message: "Failed to create company. Please try again.",
    };
  }
}

export async function updateCompanyAction(
  id: string,
  prevState: FormActionState | null,
  formData: FormData
): Promise<FormActionState> {
  try {
    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      logo_url: formData.get("logo_url"),
      website: formData.get("website"),
      location: formData.get("location"),
      industry: formData.get("industry"),
      employee_count: formData.get("employee_count"),
      founded: formData.get("founded"),
      ceo: formData.get("ceo"),
    };

    const validatedFields = simpleCompanySchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed. Please check the form fields.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const updatedCompany = await updateCompany(id, validatedFields.data);

    revalidateTag(CACHE_TAGS.companies, "max");
    revalidateTag(CACHE_TAGS.company(id), "max");

    return {
      success: true,
      message: `Company "${updatedCompany.name}" updated successfully!`,
      data: updatedCompany,
    };
  } catch (error) {
    console.error("Error in updateCompanyAction:", error);
    return {
      success: false,
      message: "Failed to update company. Please try again.",
    };
  }
}

export async function deleteCompanyAction(
  id: string
): Promise<FormActionState> {
  try {
    await deleteCompany(id);

    revalidateTag(CACHE_TAGS.companies, "max");
    revalidateTag(CACHE_TAGS.company(id), "max");

    return {
      success: true,
      message: "Company deleted successfully!",
    };
  } catch (error) {
    console.error("Error in deleteCompanyAction:", error);
    return {
      success: false,
      message: "Failed to delete company. Please try again.",
    };
  }
}

export async function bulkDeleteCompanies(
  ids: string[]
): Promise<FormActionState> {
  try {
    await Promise.all(ids.map((id) => deleteCompany(id)));

    revalidateTag(CACHE_TAGS.companies, "max");
    ids.forEach((id) => revalidateTag(CACHE_TAGS.company(id), "max"));

    return {
      success: true,
      message: `${ids.length} ${ids.length === 1 ? "company" : "companies"} deleted successfully!`,
    };
  } catch (error) {
    console.error("Error in bulkDeleteCompanies:", error);
    return {
      success: false,
      message: "Failed to delete companies. Please try again.",
    };
  }
}

export async function seedDummyDataAction(): Promise<FormActionState> {
  try {
    const result = await seedDummyData();
    
    revalidateTag(CACHE_TAGS.companies, "max");
    
    return {
      success: true,
      message: `Successfully seeded ${result.count} ${result.count === 1 ? "company" : "companies"}!`,
    };
  } catch (error) {
    console.error("Error in seedDummyDataAction:", error);
    return {
      success: false,
      message: "Failed to seed dummy data. Please try again.",
    };
  }
}
