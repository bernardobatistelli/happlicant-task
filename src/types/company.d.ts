export type Location =
  | string
  | {
      address?: string;
      city?: string;
      zip_code?: string;
      country?: string;
    };

export type Industry =
  | string
  | {
      primary: string;
      sectors?: string[];
    };

export type CEO =
  | string
  | {
      name: string;
      since?: number;
      bio?: string;
    };

export type Company = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  location?: Location;
  industry?: Industry;
  employee_count?: number;
  founded?: number;
  ceo?: CEO;
};

/**
 * Form action state for structured error responses
 */
export type FormActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: Company;
};
