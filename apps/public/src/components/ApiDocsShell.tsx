"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function ApiDocsShell({ children, currentRole }: { children: React.ReactNode, currentRole?: string }) {
  const pathname = usePathname();

  // Pull to refresh states
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const viewport = document.querySelector('#main-scroll [data-slot="scroll-area-viewport"]');
    if (viewport && viewport.scrollTop <= 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || refreshing) return;
    
    const viewport = document.querySelector('#main-scroll [data-slot="scroll-area-viewport"]');
    if (viewport && viewport.scrollTop > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;
    
    if (distance > 0) {
      // Add friction to the pull
      setPullDistance(Math.min(distance * 0.4, 80));
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);
    
    if (pullDistance > 60) {
      setRefreshing(true);
      setPullDistance(60); // lock at threshold while refreshing
      window.location.reload();
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const viewport = document.querySelector('#main-scroll [data-slot="scroll-area-viewport"]');
    if (viewport) {
      viewport.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] w-full bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
        {/* Shadcn Sidebar */}
        <AppSidebar currentRole={currentRole || "Software Engineer"} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-hidden">
          {/* Universal Header with SidebarTrigger */}
          <header className="h-14 shrink-0 border-b border-zinc-800 flex items-center px-3 md:px-4 bg-zinc-950 sticky top-0 z-10">
            <SidebarTrigger className="mr-3 text-zinc-400 hover:text-zinc-100" />
            <div className="flex items-center gap-2 font-semibold text-zinc-100">
              <span className="md:hidden">Debjyoti Mondal</span>
            </div>
          </header>

          <ScrollArea id="main-scroll" className="h-[calc(100dvh-3.5rem)] w-full relative">
            <div 
              className="w-full min-h-full xl:p-6 2xl:p-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Pull Indicator */}
              <div 
                className="w-full flex justify-center items-center overflow-hidden transition-opacity"
                style={{ 
                  height: `${pullDistance}px`,
                  opacity: pullDistance / 60 
                }}
              >
                <div className="flex items-center gap-2 text-zinc-400 mt-4">
                  <RefreshCw 
                    className={`size-4 ${refreshing ? 'animate-spin' : ''}`} 
                    style={{ transform: refreshing ? 'none' : `rotate(${pullDistance * 3}deg)` }} 
                  />
                  <span className="text-sm font-medium">
                    {refreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div 
                className={`${isPulling ? '' : 'transition-transform duration-200'}`}
              >
                {children}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
}
