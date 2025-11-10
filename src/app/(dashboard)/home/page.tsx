import { Container } from "@/components/container";
import { CompaniesListSkeleton } from "@/components/pages/dashboard/companies";
import { CompaniesSection } from "@/components/pages/dashboard/companies/companies-section";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your companies in one place.
          </p>
        </div>

        <Suspense fallback={<CompaniesListSkeleton />}>
          <CompaniesSection searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
