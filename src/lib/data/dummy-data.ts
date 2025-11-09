import { readFile } from "fs/promises";
import { join } from "path";
import { cache } from "react";
import type { Company } from "../../types/company";

export const loadDummyData = cache(async (): Promise<Company[]> => {
  try {
    const filePath = join(process.cwd(), "dummyData.json");
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as Company[];
  } catch (error) {
    console.error("Error loading dummy data:", error);
    return [];
  }
});
