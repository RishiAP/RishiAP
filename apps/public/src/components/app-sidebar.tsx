'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Terminal,
  LayoutTemplate,
  Briefcase,
  GraduationCap,
  Code2,
  FileText,
  Database,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: "Introduction", href: "/", icon: Terminal },
  { title: "Projects", href: "/projects", icon: LayoutTemplate },
  { title: "Experience", href: "/experience", icon: Briefcase },
  { title: "Education", href: "/education", icon: GraduationCap },
  { title: "Skills", href: "/skills", icon: Code2 },
  { title: "Blog", href: "/blog", icon: FileText },
];

export function AppSidebar({ currentRole = "Software Engineer" }: { currentRole?: string }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="font-sans text-zinc-300">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center bg-transparent hover:bg-sidebar-accent" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center">
                  <img src="/rishicodes.svg" alt="Logo" className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-zinc-100">Debjyoti Mondal</span>
                  <span className="truncate text-xs text-zinc-500">{currentRole}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 uppercase tracking-wider text-xs">Documentation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                // Robust check: if it's the home page, ensure it matches exactly '/' or empty string.
                // Otherwise, use startsWith for nested routes like /projects/slug
                const isActive = item.href === '/' 
                  ? (pathname === '/' || pathname === '') 
                  : pathname?.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={isActive ? "bg-indigo-500/10 text-indigo-400 font-medium hover:bg-indigo-500/20 hover:text-indigo-300" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"}
                    >
                      <Link href={item.href} onClick={handleLinkClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
