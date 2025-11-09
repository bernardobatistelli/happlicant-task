import { z } from "zod";

const locationSchema = z.union([
  z.string(),
  z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    zip_code: z.string().optional(),
    country: z.string().optional(),
  }),
]);

const industrySchema = z.union([
  z.string(),
  z.object({
    primary: z.string(),
    sectors: z.array(z.string()).optional(),
  }),
]);

const ceoSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    since: z.number().optional(),
    bio: z.string().optional(),
  }),
]);

export const companySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Company name is required").max(100),
  description: z.string().max(255).optional(),
  logo_url: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  location: locationSchema.optional(),
  industry: industrySchema.optional(),
  employee_count: z.number().int().min(0).optional(),
  founded: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  ceo: ceoSchema.optional(),
});

export const updateCompanySchema = companySchema.partial().extend({
  id: z.string().uuid(), 
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;

export const simpleCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(100),
  description: z.string().max(255).optional(),
  logo_url: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  location: z.string().optional(),
  industry: z.string().optional(),
  employee_count: z.coerce.number().int().min(0).optional(),
  founded: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  ceo: z.string().optional(),
});

export type SimpleCompanyFormData = z.infer<typeof simpleCompanySchema>;
