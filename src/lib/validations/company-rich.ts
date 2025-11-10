import { z } from "zod";

// Schema for the rich form that supports both simple and advanced modes
export const richCompanyFormSchema = z.object({
  name: z.string().min(1, "Company name is required").max(100),
  description: z.string().max(255).optional(),
  logo_url: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  employee_count: z.coerce.number().int().min(0).optional(),
  founded: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),

  // Location fields
  location_simple: z.string().optional(),
  location_address: z.string().optional(),
  location_city: z.string().optional(),
  location_zip_code: z.string().optional(),
  location_country: z.string().optional(),

  // Industry fields
  industry_simple: z.string().optional(),
  industry_primary: z.string().optional(),
  industry_sectors: z.string().optional(), // comma-separated

  // CEO fields
  ceo_simple: z.string().optional(),
  ceo_name: z.string().optional(),
  ceo_since: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  ceo_bio: z.string().optional(),
});

export type RichCompanyFormData = z.infer<typeof richCompanyFormSchema>;
