import { PrismaClient } from "@prisma/client";
import dummyData from "../dummyData.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing companies)
  const deleteResult = await prisma.company.deleteMany({});
  console.log(`🗑️  Cleared ${deleteResult.count} existing companies`);

  // Seed companies from dummyData.json
  let seededCount = 0;
  for (const company of dummyData) {
    await prisma.company.create({
      data: {
        id: company.id,
        name: company.name,
        description: company.description ?? null,
        logoUrl: company.logo_url ?? null,
        website: company.website ?? null,
        location: company.location ?? null,
        industry: company.industry ?? null,
        employeeCount: company.employee_count ?? null,
        founded: company.founded ?? null,
        ceo: company.ceo ?? null,
      },
    });
    seededCount++;
    console.log(`  ✓ Seeded: ${company.name}`);
  }

  console.log(`\n✅ Successfully seeded ${seededCount} companies!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
