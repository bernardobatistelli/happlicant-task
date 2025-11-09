import type { CEO, Industry, Location } from "../../types/company";


export function isLocationObject(
  location: Location
): location is {
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
} {
  return typeof location === "object" && location !== null;
}

export function isIndustryObject(
  industry: Industry
): industry is {
  primary: string;
  sectors?: string[];
} {
  return typeof industry === "object" && industry !== null && "primary" in industry;
}

export function isCEOObject(
  ceo: CEO
): ceo is {
  name: string;
  since?: number;
  bio?: string;
} {
  return typeof ceo === "object" && ceo !== null && "name" in ceo;
}


export function formatLocation(location?: Location | null): string {
  if (!location) return "N/A";

  if (typeof location === "string") {
    return location;
  }

  // Build location string from object
  const parts: string[] = [];
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);

  return parts.length > 0 ? parts.join(", ") : "N/A";
}

export function formatIndustry(industry?: Industry | null): string {
  if (!industry) return "N/A";

  if (typeof industry === "string") {
    return industry;
  }

  return industry.primary;
}

export function getIndustrySectors(industry?: Industry | null): string[] {
  if (!industry) return [];

  if (typeof industry === "string") {
    return [];
  }

  return industry.sectors ?? [];
}

export function formatCEO(ceo?: CEO | null): string {
  if (!ceo) return "N/A";

  if (typeof ceo === "string") {
    return ceo;
  }

  return ceo.name;
}

export function getCEOTenure(ceo?: CEO | null): string | null {
  if (!ceo || typeof ceo === "string" || !ceo.since) {
    return null;
  }

  const years = new Date().getFullYear() - ceo.since;
  return years === 1 ? "1 year" : `${years} years`;
}

export function getFullAddress(location?: Location | null): string {
  if (!location || typeof location === "string") {
    return location ?? "N/A";
  }

  const parts: string[] = [];
  if (location.address) parts.push(location.address);
  if (location.city) parts.push(location.city);
  if (location.zip_code) parts.push(location.zip_code);
  if (location.country) parts.push(location.country);

  return parts.length > 0 ? parts.join(", ") : "N/A";
}

export function stringToLocation(locationStr: string): Location | undefined {
  const trimmed = locationStr.trim();
  return trimmed || undefined;
}

export function stringToIndustry(industryStr: string): Industry | undefined {
  const trimmed = industryStr.trim();
  return trimmed || undefined;
}

export function stringToCEO(ceoStr: string): CEO | undefined {
  const trimmed = ceoStr.trim();
  return trimmed || undefined;
}

export function isCompleteCompany(company: {
  name: string;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  location?: Location | null;
  industry?: Industry | null;
  employee_count?: number | null;
  founded?: number | null;
  ceo?: CEO | null;
}): boolean {
  return !!(
    company.name &&
    company.description &&
    company.logo_url &&
    company.website &&
    company.location &&
    company.industry &&
    company.employee_count &&
    company.founded &&
    company.ceo
  );
}

export function getCompanyAge(founded?: number | null): number | null {
  if (!founded) return null;
  return new Date().getFullYear() - founded;
}

export function formatCompanyAge(founded?: number | null): string {
  const age = getCompanyAge(founded);
  if (age === null) return "N/A";
  return age === 1 ? "1 year old" : `${age} years old`;
}

export function formatEmployeeCount(count?: number | null): string {
  if (!count) return "N/A";
  return count.toLocaleString();
}
