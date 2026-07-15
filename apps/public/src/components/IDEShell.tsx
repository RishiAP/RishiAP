"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Files, Search, GitBranch, Settings, ChevronRight, ChevronDown, MonitorPlay, TerminalSquare, User } from 'lucide-react';

const EXPLORER_ITEMS = [
  { name: 'home.md', path: '/', icon: <User className="w-4 h-4 text-blue-400" /> },
  { name: 'projects.json', path: '/projects', icon: <Files className="w-4 h-4 text-yellow-400" /> },
  { name: 'skills.sh', path: '/skills', icon: <TerminalSquare className="w-4 h-4 text-green-400" /> },
];

export function IDEShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);

  // Find active file name
  const activeItem = EXPLORER_ITEMS.find(item => item.path === pathname) || EXPLORER_ITEMS[0];

  return (
    <div className="flex h-screen w-full bg-[var(--color-ide-bg)] text-[var(--color-foreground)] font-mono overflow-hidden">
      
      {/* Activity Bar (Far Left) */}
      <div className="w-12 bg-[var(--color-ide-activity-bar)] flex flex-col items-center py-4 border-r border-[var(--color-ide-panel-border)] z-20">
        <div className="flex flex-col gap-6 w-full items-center">
          <button 
            className={`relative group ${isExplorerOpen ? 'text-white' : 'text-[#858585] hover:text-white transition-colors'} cursor-pointer`}
            onClick={() => setIsExplorerOpen(!isExplorerOpen)}
          >
            <Files className="w-6 h-6 stroke-1" />
            {isExplorerOpen && <div className="absolute left-[-16px] top-0 bottom-0 w-0.5 bg-[#007acc]"></div>}
          </button>
          <button className="text-[#858585] hover:text-white transition-colors cursor-pointer"><Search className="w-6 h-6 stroke-1" /></button>
          <button className="text-[#858585] hover:text-white transition-colors cursor-pointer"><GitBranch className="w-6 h-6 stroke-1" /></button>
          <button className="text-[#858585] hover:text-white transition-colors cursor-pointer"><MonitorPlay className="w-6 h-6 stroke-1" /></button>
        </div>
        <div className="mt-auto pb-6">
          <button className="text-[#858585] hover:text-white transition-colors cursor-pointer"><Settings className="w-6 h-6 stroke-1" /></button>
        </div>
      </div>

      {/* Sidebar (Explorer) */}
      {isExplorerOpen && (
        <div className="w-64 bg-[var(--color-ide-sidebar)] flex flex-col border-r border-[var(--color-ide-panel-border)] flex-shrink-0 z-10 pb-6">
          <div className="px-4 py-2 text-xs text-[#cccccc] uppercase tracking-wider mt-2">
            Explorer
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Portfolio Folder */}
            <div className="py-1">
              <div className="px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] text-sm font-bold text-white">
                <ChevronDown className="w-4 h-4" />
                <span>RISHI_PORTFOLIO</span>
              </div>
              
              <div className="pl-6 flex flex-col mt-1">
                {EXPLORER_ITEMS.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link href={item.path} key={item.path}>
                      <div className={`px-2 py-1 flex items-center gap-2 cursor-pointer text-sm ${isActive ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}>
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-ide-bg)] pb-6">
        {/* Editor Tabs */}
        <div className="flex h-9 bg-[var(--color-ide-sidebar)] overflow-x-auto border-b border-[var(--color-ide-panel-border)] no-scrollbar">
          {EXPLORER_ITEMS.map((item) => {
             const isActive = pathname === item.path;
             return (
               <Link href={item.path} key={item.path} className="shrink-0">
                 <div className={`flex items-center gap-2 px-3 h-full border-r border-[var(--color-ide-panel-border)] cursor-pointer text-sm min-w-32 ${isActive ? 'bg-[var(--color-ide-bg)] text-white border-t-2 border-t-[#007acc]' : 'bg-[var(--color-ide-tab-inactive)] text-[#858585] border-t-2 border-t-transparent hover:bg-[#2b2b2b]'}`}>
                   {item.icon}
                   <span>{item.name}</span>
                 </div>
               </Link>
             )
          })}
        </div>

        {/* Breadcrumbs */}
        <div className="h-6 flex items-center px-4 text-xs text-[#858585] border-b border-[#3c3c3c] shadow-sm bg-[var(--color-ide-bg)]">
          <span>RISHI_PORTFOLIO</span>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span>{activeItem.name}</span>
        </div>

        {/* Editor Viewport (Scrollable) */}
        <div className="flex-1 overflow-y-auto relative p-6">
           {children}
        </div>
      </div>

      {/* Status Bar (Bottom) - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-2 z-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded h-full"><GitBranch className="w-3 h-3" /> main</span>
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">Prettier</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">UTF-8</span>
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">TypeScript React</span>
        </div>
      </div>
    </div>
  );
}
