import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4 sticky top-0 bg-background z-10">
          <SidebarTrigger className="-ml-1" />
          <div className="md:hidden flex items-center gap-2">
            <span className="font-semibold">RishiCodes Admin</span>
          </div>
        </header>
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-4 p-3 md:gap-6 md:p-6">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
