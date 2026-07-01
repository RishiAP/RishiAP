import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollReset } from '@/components/scroll-reset';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-[100dvh] overflow-hidden min-w-0 w-full">
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4 sticky top-0 bg-background z-10">
          <SidebarTrigger className="-ml-1" />
          <div className="md:hidden flex items-center gap-2">
            <span className="font-semibold">RishiCodes Admin</span>
          </div>
        </header>
        <ScrollArea id="main-scroll" className="flex-1 min-h-0">
          <ScrollReset />
          <div className="grid grid-cols-1 gap-4 p-3 md:gap-6 md:p-6">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
