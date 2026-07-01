"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export function ApiDocsShell({ children, currentRole }: { children: React.ReactNode, currentRole?: string }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
        {/* Shadcn Sidebar */}
        <AppSidebar currentRole={currentRole || "Software Engineer"} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          {/* Universal Header with SidebarTrigger */}
          <header className="h-14 shrink-0 border-b border-zinc-800 flex items-center px-3 md:px-4 bg-zinc-950 sticky top-0 z-10">
            <SidebarTrigger className="mr-3 text-zinc-400 hover:text-zinc-100" />
            <div className="flex items-center gap-2 font-semibold text-zinc-100">
              <span className="md:hidden">Debjyoti Mondal</span>
            </div>
          </header>

          <ScrollArea className="h-[calc(100vh-3.5rem)] w-full">
            <div className="xl:p-6 2xl:p-8">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
}
