/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-base-to-string */
"use server";

import { createCompany, deleteCompany, getCompanies, updateCompany } from "@/http/companies";
import { CACHE_TAGS } from "@/lib/cache-tags";

import { companySchema } from "@/lib/validations/company";
import type { Company, FormActionState } from "@/types/company";
import { updateTag } from "next/cache";

// Server action to fetch companies (can be called from client)
export async function getCompaniesAction(): Promise<Company[]> {
  return await getCompanies();
}

export async function createCompanyAction(
  prevState: FormActionState | null,
  formData: FormData
): Promise<FormActionState> {
  try {
    // Helper function to parse JSON or return string
    const parseField = (value: FormDataEntryValue | null) => {
      if (!value) return undefined;
      const strValue = value.toString();
      try {
        return JSON.parse(strValue);
      } catch {
        return strValue;
      }
    };

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      logo_url: formData.get("logo_url"),
      website: formData.get("website"),
      location: parseField(formData.get("location")),
      industry: parseField(formData.get("industry")),
      employee_count: formData.get("employee_count")
        ? Number(formData.get("employee_count"))
        : undefined,
      founded: formData.get("founded")
        ? Number(formData.get("founded"))
        : undefined,
      ceo: parseField(formData.get("ceo")),
    };

    const validatedFields = companySchema.safeParse(rawData);

    if (!validatedFields.success) {
      console.error("Create validation errors:", validatedFields.error.format());
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

    updateTag(CACHE_TAGS.companies);

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
    // Helper function to parse JSON or return string
    const parseField = (value: FormDataEntryValue | null) => {
      if (!value) return undefined;
      const strValue = value.toString();
      try {
        return JSON.parse(strValue);
      } catch {
        return strValue;
      }
    };

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      logo_url: formData.get("logo_url"),
      website: formData.get("website"),
      location: parseField(formData.get("location")),
      industry: parseField(formData.get("industry")),
      employee_count: formData.get("employee_count")
        ? Number(formData.get("employee_count"))
        : undefined,
      founded: formData.get("founded")
        ? Number(formData.get("founded"))
        : undefined,
      ceo: parseField(formData.get("ceo")),
    };

    const validatedFields = companySchema.safeParse(rawData);

    if (!validatedFields.success) {
      console.error("Update validation errors:", validatedFields.error.format());
      return {
        success: false,
        message: "Validation failed. Please check the form fields.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const updatedCompany = await updateCompany(id, validatedFields.data);

    // Small delay to show optimistic update
    await new Promise((resolve) => setTimeout(resolve, 300));

    updateTag(CACHE_TAGS.companies);
    updateTag(CACHE_TAGS.company(id));

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

    updateTag(CACHE_TAGS.companies);
    updateTag(CACHE_TAGS.company(id));

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

    updateTag(CACHE_TAGS.companies);
    ids.forEach((id) => updateTag(CACHE_TAGS.company(id)));

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
