import { AppSidebar } from "@/components/sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <header className="bg-background h-14 w-full">
            <div className="bg-background fixed z-10 flex w-full items-center gap-4 px-5 md:static mt-2.5">
              <SidebarTrigger className="cursor-pointer" />

              <div className="flex flex-col gap-0">
                <h1 className="text-foreground text-3xl">Companies</h1>
                <p className="text-muted-foreground">
                  Manage your company portfolio
                </p>
              </div>
            </div>
          </header>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
